import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { AppBrandLogo } from '../components/AppBrandLogo';
import { DraftIncident, EvidenceAttachment, Incident, IncidentSeverity, IncidentType } from '../types/incident';
import { ScreenName } from '../types/navigation';
import { LostFoundDraft, LostFoundMode, LostFoundRecord } from '../types/lostFound';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 28 : 0;
const HEADER_TOP = Platform.OS === 'android' ? STATUS_BAR_HEIGHT + 14 : 18;

const C = {
  bg: '#020B18',
  card: '#071426',
  card2: '#0B1B31',
  card3: '#0D2138',
  border: 'rgba(255,255,255,0.09)',
  borderStrong: 'rgba(255,255,255,0.16)',
  text: '#F7FAFC',
  muted: '#94A7BD',
  muted2: '#6B7F96',
  blue: '#2F80FF',
  blueSoft: 'rgba(47,128,255,0.15)',
  red: '#FF4D4F',
  redSoft: 'rgba(255,77,79,0.16)',
  green: '#23D160',
  greenSoft: 'rgba(35,209,96,0.15)',
  orange: '#FF8A1F',
  orangeSoft: 'rgba(255,138,31,0.15)',
  yellow: '#FFD43B',
  yellowSoft: 'rgba(255,212,59,0.15)',
  purple: '#A855F7',
  purpleSoft: 'rgba(168,85,247,0.15)',
  white: '#FFFFFF'
};

const DEFAULT_REGION: Region = {
  latitude: 6.8152,
  longitude: 3.4894,
  latitudeDelta: 0.018,
  longitudeDelta: 0.018
};

const incidentCategories: Array<{
  label: string;
  type: IncidentType;
  severity: IncidentSeverity;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}> = [
  { label: 'Fire', type: 'Fire / Smoke', severity: 'Critical', icon: 'flame-outline', color: C.red },
  { label: 'Security', type: 'Theft / Security Issue', severity: 'High', icon: 'shield-outline', color: C.blue },
  { label: 'Medical', type: 'Medical / First Aid', severity: 'High', icon: 'medical-outline', color: C.green },
  { label: 'Power', type: 'Electricity / Power Issue', severity: 'Medium', icon: 'flash-outline', color: C.yellow },
  { label: 'Traffic', type: 'Traffic / Road Obstruction', severity: 'Medium', icon: 'car-outline', color: C.orange },
  { label: 'Facility', type: 'Facility / Maintenance Fault', severity: 'Medium', icon: 'business-outline', color: C.purple },
  { label: 'Other', type: 'Other', severity: 'Medium', icon: 'ellipsis-horizontal-outline', color: C.muted }
];

const lostFoundCategories = ['Phone', 'Bag', 'Wallet', 'ID Card', 'Keys', 'Bible / Book', 'Clothing', 'Electronics', 'Other'];

function getIncidentDisplay(type: IncidentType | string) {
  return incidentCategories.find((item) => item.type === type) ?? incidentCategories[6];
}

function getSeverityColor(severity: string) {
  if (severity === 'Critical') return C.red;
  if (severity === 'High') return C.orange;
  if (severity === 'Medium') return C.blue;
  if (severity === 'Low') return C.yellow;
  return C.green;
}

function getSeverityLabel(severity: IncidentSeverity) {
  if (severity === 'Critical') return 'CRITICAL';
  if (severity === 'High') return 'HIGH';
  if (severity === 'Medium') return 'MEDIUM';
  return 'LOW';
}

async function reverseAddress(latitude: number, longitude: number) {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    const first = results[0];

    if (!first) return 'Pinned location, Redemption City Camp';

    const parts = [first.name, first.street, first.district, first.city].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Pinned location, Redemption City Camp';
  } catch {
    return 'Pinned location, Redemption City Camp';
  }
}

async function requestCurrentLocation() {
  const permission = await Location.requestForegroundPermissionsAsync();

  if (permission.status !== 'granted') {
    Alert.alert('Location permission needed', 'Please allow location access to capture where the incident happened.');
    return null;
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High
  });

  const { latitude, longitude } = position.coords;
  const address = await reverseAddress(latitude, longitude);

  return { latitude, longitude, address };
}

async function pickMedia(source: 'camera' | 'gallery', media: 'photo' | 'video') {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permission.status !== 'granted') {
    Alert.alert('Permission needed', source === 'camera' ? 'Camera access is required.' : 'Gallery access is required.');
    return null;
  }

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: media === 'photo' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
          quality: 0.7
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: media === 'photo' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
          quality: 0.7
        });

  if (result.canceled) return null;

  const asset = result.assets[0];

  return {
    uri: asset.uri,
    name: asset.fileName || `${media}-${Date.now()}`,
    size: asset.fileSize ? `${Math.round(asset.fileSize / 1024)} KB` : 'Attached',
    type: media === 'photo' ? 'Photo' : 'Video'
  };
}

function BrandHeader({
  title = 'Redemption City Safety',
  subtitle = 'Incident Management System',
  onBack,
  right
}: {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.brandHeader}>
      <View style={styles.brandRow}>
        {onBack ? (
          <TouchableOpacity activeOpacity={0.85} style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={C.text} />
          </TouchableOpacity>
        ) : null}

        <AppBrandLogo size="small" />

        <View style={styles.brandTextWrap}>
          <View style={styles.commandHeaderChip}>
            <View style={styles.commandHeaderDot} />
            <Text style={styles.commandHeaderText}>RCC SAFETY COMMAND</Text>
          </View>

          <Text style={styles.brandTitle}>{title}</Text>
          <Text style={styles.brandSubtitle}>{subtitle}</Text>
        </View>

        {right ?? (
          <TouchableOpacity activeOpacity={0.85} style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={24} color={C.text} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function BottomTabs({
  active,
  onNavigate
}: {
  active: 'home' | 'reports' | 'alerts' | 'map' | 'profile';
  onNavigate: (screen: ScreenName) => void;
}) {
  return (
    <View style={styles.tabBar}>
      <TabItem label="Home" icon="home" active={active === 'home'} onPress={() => onNavigate('home')} />
      <TabItem label="Reports" icon="clipboard-outline" active={active === 'reports'} onPress={() => onNavigate('my-reports')} />
      <TabItem label="Alerts" icon="notifications" active={active === 'alerts'} badge onPress={() => onNavigate('alerts')} />
      <TabItem label="Map" icon="location" active={active === 'map'} onPress={() => onNavigate('map')} />
      <TabItem label="Profile" icon="person-outline" active={active === 'profile'} onPress={() => onNavigate('profile')} />
    </View>
  );
}

function TabItem({
  label,
  icon,
  active,
  badge,
  onPress
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  badge?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.tabItem} onPress={onPress}>
      <View>
        <Ionicons name={icon} size={25} color={active ? C.blue : C.muted} />
        {badge ? (
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>3</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function CriticalAlert({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.88} style={styles.criticalAlert} onPress={onPress}>
      <View style={styles.criticalIcon}>
        <Ionicons name="warning" size={29} color={C.white} />
      </View>

      <View style={styles.flex}>
        <Text style={styles.criticalTitle}>CRITICAL ALERT</Text>
        <Text style={styles.criticalText}>Major incident reported. Avoid the affected area.</Text>
      </View>

      <View style={styles.criticalDivider} />
      <Text style={styles.criticalAction}>VIEW DETAILS</Text>
      <Ionicons name="chevron-forward" size={20} color={C.white} />
    </TouchableOpacity>
  );
}

function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.statusPill, { backgroundColor: `${color}25`, borderColor: `${color}70` }]}>
      <Text style={[styles.statusPillText, { color }]}>{label}</Text>
    </View>
  );
}

export function ReportStepOneScreen({
  draft,
  setDraft,
  onNavigate
}: {
  draft: DraftIncident;
  setDraft: React.Dispatch<React.SetStateAction<DraftIncident>>;
  onNavigate: (screen: ScreenName) => void;
}) {
  function selectCategory(item: (typeof incidentCategories)[number]) {
    setDraft((current) => ({
      ...current,
      type: item.type,
      severity: item.severity,
      title: `${item.label} report`
    }));
  }

  function continueNext() {
    if (!draft.type) {
      Alert.alert('Select incident type', 'Choose the category that best describes the incident.');
      return;
    }

    onNavigate('report-step-two');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BrandHeader title="Report Incident" subtitle="Select report category" onBack={() => onNavigate('home')} />

        <View style={styles.stepHeader}>
          <Text style={styles.bigTitle}>New Incident Report</Text>
          <Text style={styles.stepText}>Step 1 of 3</Text>
        </View>

        <StepDots active={1} />

        <Text style={styles.formTitle}>Select Incident Type</Text>
        <Text style={styles.formSubtitle}>Choose the category that best describes the incident you are reporting.</Text>

        <View style={styles.categoryGridCompact}>
          {incidentCategories.map((item) => {
            const selected = draft.type === item.type;

            return (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.86}
                style={[styles.categoryCardCompact, selected && { borderColor: item.color, backgroundColor: `${item.color}14` }]}
                onPress={() => selectCategory(item)}
              >
                {selected ? (
                  <View style={[styles.selectedTick, { backgroundColor: item.color }]}>
                    <Ionicons name="checkmark" size={16} color={C.white} />
                  </View>
                ) : null}

                <Ionicons name={item.icon} size={42} color={item.color} />
                <Text style={styles.categoryTextCompact}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.helpCard}>
          <View style={styles.helpIcon}>
            <Ionicons name="alert-circle-outline" size={29} color={C.blue} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.helpTitle}>Need immediate help?</Text>
            <Text style={styles.helpText}>Move to safety first. This app sends the report to Admin Control Desk for routing.</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={C.muted} />
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity activeOpacity={0.9} style={styles.blueButton} onPress={continueNext}>
          <Text style={styles.blueButtonText}>Continue</Text>
          <Ionicons name="chevron-forward" size={23} color={C.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function StepDots({ active }: { active: 1 | 2 | 3 }) {
  return (
    <View style={styles.stepDotsWrap}>
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <View style={[styles.stepCircle, active >= step && styles.stepCircleActive]}>
            <Text style={[styles.stepCircleText, active >= step && styles.stepCircleTextActive]}>{step}</Text>
          </View>
          {step !== 3 ? <View style={[styles.stepLine, active > step && styles.stepLineActive]} /> : null}
        </React.Fragment>
      ))}
    </View>
  );
}

export function ReportStepTwoScreen({
  draft,
  setDraft,
  onNavigate,
  onSubmit,
  isSubmitting
}: {
  draft: DraftIncident;
  setDraft: React.Dispatch<React.SetStateAction<DraftIncident>>;
  onNavigate: (screen: ScreenName) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const [mapRegion, setMapRegion] = useState<Region>({
    ...DEFAULT_REGION,
    latitude: draft.latitude ?? DEFAULT_REGION.latitude,
    longitude: draft.longitude ?? DEFAULT_REGION.longitude
  });

  const selectedDisplay = getIncidentDisplay(draft.type ?? 'Other');

  async function useCurrentLocation() {
    const current = await requestCurrentLocation();
    if (!current) return;

    setDraft((old) => ({
      ...old,
      location: 'Current pinned location',
      address: current.address,
      latitude: current.latitude,
      longitude: current.longitude
    }));

    setMapRegion({
      latitude: current.latitude,
      longitude: current.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    });
  }

  async function addMedia(source: 'camera' | 'gallery', media: 'photo' | 'video') {
    const picked = await pickMedia(source, media);
    if (!picked) return;

    const attachment: EvidenceAttachment = {
      id: `media-${Date.now()}`,
      type: picked.type as EvidenceAttachment['type'],
      name: picked.name,
      size: picked.size,
      uri: picked.uri,
      thumbnailLabel: picked.type === 'Photo' ? 'Photo evidence' : 'Video evidence'
    };

    setDraft((old) => ({
      ...old,
      attachments: [...old.attachments, attachment]
    }));
  }

  async function handleMapPress(latitude: number, longitude: number) {
    const address = await reverseAddress(latitude, longitude);

    setDraft((old) => ({
      ...old,
      location: 'Dropped pin location',
      address,
      latitude,
      longitude
    }));
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BrandHeader title="Incident Details" subtitle="Step 2 of 3" onBack={() => onNavigate('report-step-one')} />

        <StepDots active={2} />

        <View style={styles.selectedIncidentCard}>
          <View style={[styles.selectedIncidentIcon, { backgroundColor: `${selectedDisplay.color}22` }]}>
            <Ionicons name={selectedDisplay.icon} size={30} color={selectedDisplay.color} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.smallMuted}>Selected Category</Text>
            <Text style={styles.selectedIncidentTitle}>{selectedDisplay.label}</Text>
            <Text style={styles.selectedIncidentLocation}>
              <Ionicons name="location-outline" size={14} color={C.muted} /> {draft.location || 'Location not selected'}
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.85} style={styles.changeRow} onPress={() => onNavigate('report-step-one')}>
            <Text style={styles.blueText}>Change</Text>
            <Ionicons name="chevron-forward" size={18} color={C.blue} />
          </TouchableOpacity>
        </View>

        <Text style={styles.formNumber}>1. DESCRIPTION</Text>
        <TextInput
          value={draft.description}
          onChangeText={(text) => setDraft((old) => ({ ...old, description: text }))}
          placeholder="Provide details about the incident..."
          placeholderTextColor={C.muted2}
          multiline
          textAlignVertical="top"
          style={styles.darkTextArea}
        />
        <Text style={styles.assistText}>Include what happened, where it happened, and any immediate actions taken.</Text>

        <Text style={styles.formNumber}>2. PHOTO / VIDEO EVIDENCE</Text>
        <View style={styles.mediaGrid}>
          <TouchableOpacity activeOpacity={0.85} style={styles.mediaBox} onPress={() => addMedia('camera', 'photo')}>
            <Ionicons name="camera-outline" size={32} color={C.blue} />
            <Text style={styles.mediaTitle}>Take Photo</Text>
            <Text style={styles.mediaText}>Open camera</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} style={styles.mediaBox} onPress={() => addMedia('gallery', 'photo')}>
            <Ionicons name="image-outline" size={32} color={C.green} />
            <Text style={styles.mediaTitle}>Gallery</Text>
            <Text style={styles.mediaText}>Choose photo</Text>
          </TouchableOpacity>
        </View>

        {draft.attachments.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.attachmentRow}>
            {draft.attachments.map((item) => (
              <View key={item.id} style={styles.attachmentPreview}>
                {item.uri && item.type === 'Photo' ? <Image source={{ uri: item.uri }} style={styles.attachmentImage} /> : null}
                <View style={styles.attachmentOverlay}>
                  <Ionicons name={item.type === 'Photo' ? 'image-outline' : 'videocam-outline'} size={15} color={C.white} />
                  <Text style={styles.attachmentOverlayText}>{item.type}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : null}

        <Text style={styles.formNumber}>3. LOCATION</Text>
        <View style={styles.locationPanel}>
          <View style={styles.locationTop}>
            <View style={styles.bigLocationIcon}>
              <Ionicons name="location" size={34} color={C.blue} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.locationTitle}>{draft.location || 'No location selected'}</Text>
              <Text style={styles.locationSub}>{draft.address || 'Use current location or tap the map preview.'}</Text>
              {draft.latitude && draft.longitude ? (
                <Text style={styles.coordinateText}>
                  {draft.latitude.toFixed(5)} N, {draft.longitude.toFixed(5)} E
                </Text>
              ) : null}
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.mapActionButton} onPress={useCurrentLocation}>
            <Ionicons name="locate-outline" size={20} color={C.blue} />
            <Text style={styles.mapActionText}>Use Current Location</Text>
            <Ionicons name="chevron-forward" size={18} color={C.muted} />
          </TouchableOpacity>

          <View style={styles.mapBox}>
            <MapView
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              style={styles.map}
              initialRegion={mapRegion}
              region={mapRegion}
              onRegionChangeComplete={setMapRegion}
              onPress={(event: any) => {
                const { latitude, longitude } = event.nativeEvent.coordinate;
                handleMapPress(latitude, longitude);
              }}
            >
              {draft.latitude && draft.longitude ? (
                <Marker coordinate={{ latitude: draft.latitude, longitude: draft.longitude }} title="Incident location" description={draft.address} />
              ) : null}
            </MapView>

            <View style={styles.mapHint}>
              <Ionicons name="map-outline" size={16} color={C.blue} />
              <Text style={styles.mapHintText}>Tap preview map to drop pin</Text>
            </View>
          </View>
        </View>

        <Text style={styles.formNumber}>4. SEVERITY SELF-ASSESSMENT</Text>
        <View style={styles.severityGrid}>
          <SeverityCard label="CRITICAL" text="Immediate danger" value="Critical" icon="warning-outline" color={C.red} draft={draft} setDraft={setDraft} />
          <SeverityCard label="HIGH" text="Needs fast action" value="High" icon="shield-outline" color={C.orange} draft={draft} setDraft={setDraft} />
          <SeverityCard label="MEDIUM" text="Needs attention" value="Medium" icon="medical-outline" color={C.blue} draft={draft} setDraft={setDraft} />
          <SeverityCard label="LOW" text="FYI only" value="Low" icon="information-circle-outline" color={C.green} draft={draft} setDraft={setDraft} />
        </View>

        <Text style={styles.formNumber}>5. CONTACT</Text>
        <TextInput
          value={draft.reporterContact}
          onChangeText={(text) => setDraft((old) => ({ ...old, reporterContact: text }))}
          placeholder="Phone number or email for admin follow-up"
          placeholderTextColor={C.muted2}
          style={styles.darkInput}
        />

        <View style={styles.switchRow}>
          <View style={styles.flex}>
            <Text style={styles.switchTitle}>Submit anonymously</Text>
            <Text style={styles.switchText}>Hide your identity from public report view.</Text>
          </View>
          <Switch
            value={draft.anonymous}
            onValueChange={(value) => setDraft((old) => ({ ...old, anonymous: value }))}
            trackColor={{ true: C.blue, false: C.borderStrong }}
            thumbColor={C.white}
          />
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.blueButton} onPress={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color={C.white} /> : <Ionicons name="send-outline" size={22} color={C.white} />}
          <Text style={styles.blueButtonText}>{isSubmitting ? 'Submitting...' : 'Submit Report'}</Text>
        </TouchableOpacity>

        <Text style={styles.secureText}>
          <Ionicons name="lock-closed" size={13} color={C.muted} /> Your report is secure and confidential.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SeverityCard({
  label,
  text,
  value,
  icon,
  color,
  draft,
  setDraft
}: {
  label: string;
  text: string;
  value: IncidentSeverity;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  draft: DraftIncident;
  setDraft: React.Dispatch<React.SetStateAction<DraftIncident>>;
}) {
  const active = draft.severity === value;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.severityCard, active && { borderColor: color, backgroundColor: `${color}12` }]}
      onPress={() => setDraft((old) => ({ ...old, severity: value }))}
    >
      {active ? (
        <View style={[styles.severityTick, { backgroundColor: color }]}>
          <Ionicons name="checkmark" size={15} color={C.white} />
        </View>
      ) : null}
      <Ionicons name={icon} size={31} color={color} />
      <Text style={[styles.severityLabel, { color }]}>{label}</Text>
      <Text style={styles.severityText}>{text}</Text>
    </TouchableOpacity>
  );
}

export function SubmitSuccessScreen({
  incident,
  onNavigate,
  onOpenIncident
}: {
  incident: Incident;
  onNavigate: (screen: ScreenName) => void;
  onOpenIncident: (incident: Incident) => void;
}) {
  const display = getIncidentDisplay(incident.type);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BrandHeader title="Report Submitted" subtitle="Submission complete" />

        <Text style={styles.sectionCaps}>REPORT SUBMISSION</Text>

        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={46} color={C.green} />
          </View>

          <Text style={styles.successTitle}>Report Submitted</Text>
          <Text style={styles.successMessage}>Thank you. Your report has been successfully submitted.</Text>

          <View style={styles.successDivider} />

          <Text style={styles.successLabel}>REPORT ID</Text>
          <Text style={styles.successId}>{incident.id}</Text>

          <View style={styles.responseBox}>
            <View style={styles.responseLeft}>
              <View style={styles.responseIcon}>
                <Ionicons name="time-outline" size={27} color={C.green} />
              </View>
              <View>
                <Text style={styles.responseText}>Response expected in</Text>
                <Text style={styles.responseTime}>{incident.responseEta || '8–15 mins'}</Text>
              </View>
            </View>

            <Text style={styles.responseNote}>We’ll notify you of updates in real time.</Text>
          </View>
        </View>

        <Text style={styles.sectionCaps}>REPORT SUMMARY</Text>
        <View style={styles.summaryBox}>
          <SummaryRow icon={display.icon} color={display.color} label="Category" value={display.label} />
          <SummaryRow icon="location-outline" color={C.blue} label="Location" value={incident.location} />
          <SummaryRow icon="shield-outline" color={getSeverityColor(incident.severity)} label="Severity" value={incident.severity} badge />
          <SummaryRow icon="calendar-outline" color={C.purple} label="Submitted" value={incident.reportedAt} />
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.blueButton} onPress={() => onOpenIncident(incident)}>
          <Ionicons name="analytics-outline" size={23} color={C.white} />
          <Text style={styles.blueButtonText}>Track Report</Text>
          <Ionicons name="chevron-forward" size={22} color={C.white} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9} style={styles.outlineButton} onPress={() => onNavigate('home')}>
          <Ionicons name="home-outline" size={22} color={C.muted} />
          <Text style={styles.outlineButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabs active="home" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function SummaryRow({
  icon,
  color,
  label,
  value,
  badge
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <View style={[styles.summaryIcon, { backgroundColor: `${color}20`, borderColor: `${color}60` }]}>
        <Ionicons name={icon} size={23} color={color} />
      </View>

      <View style={styles.flex}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
      </View>

      {badge ? <StatusPill label={value.toUpperCase()} color={color} /> : <Ionicons name="chevron-forward" size={20} color={C.muted} />}
    </View>
  );
}

export function AlertsScreen({
  incidents,
  onNavigate,
  onOpenIncident
}: {
  incidents: Incident[];
  onNavigate: (screen: ScreenName) => void;
  onOpenIncident: (incident: Incident) => void;
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContentCompact} showsVerticalScrollIndicator={false}>
        <BrandHeader title="Alerts" subtitle="Live camp safety updates" />

        <CriticalAlert onPress={() => incidents[0] && onOpenIncident(incidents[0])} />

        {incidents.map((incident) => (
          <DetailedAlertCard key={incident.id} incident={incident} onPress={() => onOpenIncident(incident)} />
        ))}
      </ScrollView>

      <BottomTabs active="alerts" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function DetailedAlertCard({ incident, onPress }: { incident: Incident; onPress: () => void }) {
  const display = getIncidentDisplay(incident.type);
  const color = getSeverityColor(incident.severity);

  return (
    <TouchableOpacity activeOpacity={0.86} style={[styles.detailedAlert, { borderLeftColor: color }]} onPress={onPress}>
      <View style={[styles.detailedIcon, { backgroundColor: `${display.color}20`, borderColor: `${display.color}60` }]}>
        <Ionicons name={display.icon} size={29} color={display.color} />
      </View>

      <View style={styles.flex}>
        <Text style={styles.detailedTitle}>{incident.title}</Text>
        <Text style={styles.detailedMeta}>
          {display.label} • <Ionicons name="location-outline" size={14} color={C.muted} /> {incident.location}
        </Text>
        <Text style={styles.detailedDescription}>{incident.description}</Text>
      </View>

      <View style={styles.alertRightCompact}>
        <StatusPill label={getSeverityLabel(incident.severity)} color={color} />
        <Text style={styles.alertTimeCompact}>2m ago</Text>
      </View>
    </TouchableOpacity>
  );
}

export function ReportDetailsScreen({ incident, onNavigate }: { incident: Incident; onNavigate: (screen: ScreenName) => void }) {
  const display = getIncidentDisplay(incident.type);
  const severityColor = getSeverityColor(incident.severity);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BrandHeader title="Report Detail" subtitle="Status tracking" onBack={() => onNavigate('my-reports')} />

        <View style={[styles.detailHero, { borderLeftColor: severityColor }]}>
          <View style={[styles.detailHeroIcon, { backgroundColor: `${display.color}20` }]}>
            <Ionicons name={display.icon} size={31} color={display.color} />
          </View>

          <View style={styles.flex}>
            <Text style={styles.detailTitle}>{incident.title}</Text>
            <Text style={styles.detailLocation}>
              <Ionicons name="location-outline" size={15} color={C.muted} /> {incident.location}
            </Text>
          </View>

          <StatusPill label={getSeverityLabel(incident.severity)} color={severityColor} />
        </View>

        <View style={styles.detailMetaBox}>
          <MetaBlock label="Report ID" value={incident.id} />
          <MetaBlock label="Submitted" value={incident.reportedAt} />
          <MetaBlock label="Reported By" value={incident.anonymous ? 'Anonymous' : 'You'} />
        </View>

        <Text style={styles.sectionCaps}>STATUS TRACKING</Text>
        <View style={styles.trackingWrap}>
          <TrackPoint active done label="Submitted" time={incident.timeline[0]?.timestamp ?? '--'} />
          <TrackLine active />
          <TrackPoint active done label="Under Review" time="Current" />
          <TrackLine active={incident.status === 'Assigned' || incident.status === 'Responder En Route' || incident.status === 'Resolved'} />
          <TrackPoint
            active={incident.status === 'Assigned' || incident.status === 'Responder En Route' || incident.status === 'Resolved'}
            label="Assigned"
            time={incident.responseEta ?? '--'}
          />
          <TrackLine active={incident.status === 'Resolved'} dashed />
          <TrackPoint active={incident.status === 'Resolved'} label="Resolved" time="--:--" />
        </View>

        <View style={styles.statusInfoCard}>
          <Ionicons name="person-circle-outline" size={36} color={C.blue} />
          <View style={styles.flex}>
            <Text style={styles.statusInfoTitle}>{incident.status}</Text>
            <Text style={styles.statusInfoText}>
              {incident.assignedUnitName
                ? `${incident.assignedUnitName} has been notified.`
                : 'Admin Control Desk is reviewing this report before routing.'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionCaps}>ASSIGNED RESPONSE BODY</Text>
        <View style={styles.responderCard}>
          <View style={styles.responderIcon}>
            <Ionicons name="shield-outline" size={31} color={C.blue} />
            <View style={styles.responderOnline} />
          </View>

          <View style={styles.flex}>
            <Text style={styles.responderName}>{incident.assignedUnitName || 'Pending assignment'}</Text>
            <Text style={styles.responderRole}>Verified camp response body</Text>
            <View style={styles.unitBadge}>
              <Text style={styles.unitBadgeText}>{incident.assignedUnitName ? 'ASSIGNED' : 'PENDING'}</Text>
            </View>
          </View>

          <View style={styles.etaBlock}>
            <Text style={styles.metaLabel}>ETA</Text>
            <Text style={styles.etaText}>{incident.responseEta || '--'}</Text>
          </View>
        </View>

        <Text style={styles.sectionCaps}>INCIDENT NOTES</Text>
        <View style={styles.notesBox}>
          <Ionicons name="document-text-outline" size={30} color={C.muted} />
          <View style={styles.flex}>
            <Text style={styles.noteText}>{incident.description}</Text>
            <Text style={styles.noteMeta}>Submitted by you • {incident.reportedAt}</Text>
          </View>
        </View>

        <Text style={styles.sectionCaps}>MEDIA</Text>
        <View style={styles.mediaDetailRow}>
          {incident.attachments.length > 0 ? (
            incident.attachments.map((item) => (
              <View key={item.id} style={styles.mediaDetailBox}>
                {item.uri && item.type === 'Photo' ? <Image source={{ uri: item.uri }} style={styles.mediaDetailImage} /> : null}
                <View style={styles.mediaCount}>
                  <Ionicons name="image-outline" size={15} color={C.white} />
                  <Text style={styles.mediaCountText}>1</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.addMoreMedia}>
              <View style={styles.plusCircle}>
                <Ionicons name="add" size={27} color={C.blue} />
              </View>
              <View>
                <Text style={styles.addMoreTitle}>No media attached</Text>
                <Text style={styles.addMoreText}>Photos or videos help teams respond faster.</Text>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.sectionCaps}>LATEST UPDATE</Text>
        <View style={styles.latestUpdate}>
          <View style={[styles.detailedIcon, { backgroundColor: `${C.purple}20` }]}>
            <Ionicons name="shield-outline" size={27} color={C.purple} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.latestTitle}>{incident.timeline[incident.timeline.length - 1]?.title ?? 'Report received'}</Text>
            <Text style={styles.latestText}>
              {incident.timeline[incident.timeline.length - 1]?.actor ?? 'Admin'} •{' '}
              {incident.timeline[incident.timeline.length - 1]?.timestamp ?? 'Current'}
            </Text>
          </View>
        </View>

        <View style={styles.detailActions}>
          <TouchableOpacity activeOpacity={0.9} style={styles.outlineHalf}>
            <Ionicons name="chatbubble-outline" size={21} color={C.blue} />
            <Text style={styles.outlineHalfText}>Contact Support</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} style={styles.blueHalf}>
            <Ionicons name="create-outline" size={21} color={C.white} />
            <Text style={styles.blueHalfText}>Update Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaBlock}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function TrackPoint({ active, done, label, time }: { active?: boolean; done?: boolean; label: string; time: string }) {
  return (
    <View style={styles.trackPointWrap}>
      <View style={[styles.trackCircle, active && styles.trackCircleActive]}>
        {done ? <Ionicons name="checkmark" size={18} color={C.green} /> : <Ionicons name="person-outline" size={18} color={active ? C.blue : C.muted2} />}
      </View>
      <Text style={[styles.trackLabel, active && styles.trackLabelActive]}>{label}</Text>
      <Text style={styles.trackTime}>{time}</Text>
    </View>
  );
}

function TrackLine({ active, dashed }: { active?: boolean; dashed?: boolean }) {
  return <View style={[styles.trackLine, active && styles.trackLineActive, dashed && styles.trackLineDashed]} />;
}

export function MyReportsScreen({
  incidents,
  lostFoundRecords,
  onNavigate,
  onOpenIncident
}: {
  incidents: Incident[];
  lostFoundRecords: LostFoundRecord[];
  onNavigate: (screen: ScreenName) => void;
  onOpenIncident: (incident: Incident) => void;
}) {
  const [filter, setFilter] = useState<'All' | 'Incidents' | 'Lost & Found'>('All');

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContentCompact} showsVerticalScrollIndicator={false}>
        <BrandHeader title="My Reports" subtitle="Track submitted cases" />

        <View style={styles.filterRow}>
          {(['All', 'Incidents', 'Lost & Found'] as const).map((item) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.85}
              style={[styles.darkFilter, filter === item && styles.darkFilterActive]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.darkFilterText, filter === item && styles.darkFilterTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {(filter === 'All' || filter === 'Incidents') &&
          incidents.map((incident) => <DetailedAlertCard key={incident.id} incident={incident} onPress={() => onOpenIncident(incident)} />)}

        {(filter === 'All' || filter === 'Lost & Found') &&
          lostFoundRecords.map((record) => (
            <View key={record.id} style={styles.lostFoundReportCard}>
              <View style={[styles.detailedIcon, { backgroundColor: record.mode === 'Lost Item' ? `${C.orange}20` : `${C.purple}20` }]}>
                <Ionicons name={record.mode === 'Lost Item' ? 'search-outline' : 'file-tray-full-outline'} size={29} color={record.mode === 'Lost Item' ? C.orange : C.purple} />
              </View>

              <View style={styles.flex}>
                <Text style={styles.detailedTitle}>{record.itemName}</Text>
                <Text style={styles.detailedMeta}>
                  {record.id} • {record.mode} • {record.locationLabel}
                </Text>
                <Text style={styles.detailedDescription}>{record.description}</Text>
                <StatusPill label={record.status} color={C.orange} />
              </View>
            </View>
          ))}
      </ScrollView>

      <BottomTabs active="reports" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

export function LostFoundScreen({
  onNavigate,
  onSubmitLostFound
}: {
  onNavigate: (screen: ScreenName) => void;
  onSubmitLostFound: (draft: LostFoundDraft) => Promise<LostFoundRecord>;
}) {
  const [mode, setMode] = useState<LostFoundMode>('Lost Item');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Phone');
  const [locationLabel, setLocationLabel] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mapRegion, setMapRegion] = useState<Region>(DEFAULT_REGION);

  async function useCurrentLocationForItem() {
    const current = await requestCurrentLocation();
    if (!current) return;

    setLatitude(current.latitude);
    setLongitude(current.longitude);
    setAddress(current.address);
    setLocationLabel('Current pinned location');

    setMapRegion({
      latitude: current.latitude,
      longitude: current.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    });
  }

  async function handleMapPress(latitudeValue: number, longitudeValue: number) {
    const foundAddress = await reverseAddress(latitudeValue, longitudeValue);

    setLatitude(latitudeValue);
    setLongitude(longitudeValue);
    setAddress(foundAddress);
    setLocationLabel('Dropped pin location');
  }

  async function addItemPhoto() {
    const picked = await pickMedia('gallery', 'photo');
    if (!picked) return;

    setImageUri(picked.uri);
  }

  async function takeItemPhoto() {
    const picked = await pickMedia('camera', 'photo');
    if (!picked) return;

    setImageUri(picked.uri);
  }

  async function submitItemReport() {
    if (!itemName.trim()) {
      Alert.alert('Item name required', 'Enter the name of the lost or found item.');
      return;
    }

    if (!description.trim() || description.trim().length < 8) {
      Alert.alert('Description required', 'Describe the item clearly.');
      return;
    }

    if (!locationLabel.trim() || !latitude || !longitude) {
      Alert.alert('Location required', 'Use current location or tap the map to pin where the item was lost/found.');
      return;
    }

    if (!contact.trim()) {
      Alert.alert('Contact required', 'Enter a phone number or email so admin can follow up.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmitLostFound({
        mode,
        itemName,
        category,
        locationLabel,
        address,
        latitude,
        longitude,
        description,
        contact,
        imageUri,
        photoLabel: imageUri ? 'Attached item photo' : undefined
      });

      Alert.alert('Submitted', 'Your Lost & Found report has been submitted for admin review.', [
        {
          text: 'Track Report',
          onPress: () => onNavigate('my-reports')
        }
      ]);

      setItemName('');
      setCategory('Phone');
      setLocationLabel('');
      setAddress('');
      setLatitude(null);
      setLongitude(null);
      setDescription('');
      setContact('');
      setImageUri(undefined);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BrandHeader title="Lost & Found" subtitle="Report lost or found items" onBack={() => onNavigate('home')} />

        <View style={styles.modeToggleRow}>
          {(['Lost Item', 'Found Item'] as LostFoundMode[]).map((item) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.85}
              style={[styles.modeButton, mode === item && styles.modeButtonActive]}
              onPress={() => setMode(item)}
            >
              <Ionicons
                name={item === 'Lost Item' ? 'search-outline' : 'file-tray-full-outline'}
                size={20}
                color={mode === item ? C.white : C.muted}
              />
              <Text style={[styles.modeText, mode === item && styles.modeTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.formNumber}>1. ITEM DETAILS</Text>

        <Text style={styles.label}>Item Name</Text>
        <TextInput
          value={itemName}
          onChangeText={setItemName}
          placeholder="Example: Black iPhone, wallet, ID card..."
          placeholderTextColor={C.muted2}
          style={styles.darkInput}
        />

        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectRow}>
          {lostFoundCategories.map((item) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.85}
              style={[styles.choiceChip, category === item && styles.choiceChipActive]}
              onPress={() => setCategory(item)}
            >
              <Text style={[styles.choiceText, category === item && styles.choiceTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the item, color, brand, unique marks, and where it was last seen..."
          placeholderTextColor={C.muted2}
          multiline
          textAlignVertical="top"
          style={styles.darkTextArea}
        />

        <Text style={styles.formNumber}>2. ITEM PHOTO</Text>

        <View style={styles.mediaGrid}>
          <TouchableOpacity activeOpacity={0.85} style={styles.mediaBox} onPress={takeItemPhoto}>
            <Ionicons name="camera-outline" size={32} color={C.blue} />
            <Text style={styles.mediaTitle}>Take Photo</Text>
            <Text style={styles.mediaText}>Open camera</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} style={styles.mediaBox} onPress={addItemPhoto}>
            <Ionicons name="image-outline" size={32} color={C.green} />
            <Text style={styles.mediaTitle}>Gallery</Text>
            <Text style={styles.mediaText}>Choose photo</Text>
          </TouchableOpacity>
        </View>

        {imageUri ? (
          <View style={styles.previewBox}>
            <Image source={{ uri: imageUri }} style={styles.lostFoundImage} />
            <View style={styles.attachmentOverlay}>
              <Ionicons name="image-outline" size={15} color={C.white} />
              <Text style={styles.attachmentOverlayText}>Item photo attached</Text>
            </View>
          </View>
        ) : null}

        <Text style={styles.formNumber}>3. LOCATION</Text>

        <View style={styles.locationPanel}>
          <View style={styles.locationTop}>
            <View style={styles.bigLocationIcon}>
              <Ionicons name="location" size={34} color={C.blue} />
            </View>

            <View style={styles.flex}>
              <Text style={styles.locationTitle}>{locationLabel || 'No location selected'}</Text>
              <Text style={styles.locationSub}>{address || 'Use current location or tap the map preview.'}</Text>
              {latitude && longitude ? (
                <Text style={styles.coordinateText}>
                  {latitude.toFixed(5)} N, {longitude.toFixed(5)} E
                </Text>
              ) : null}
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.mapActionButton} onPress={useCurrentLocationForItem}>
            <Ionicons name="locate-outline" size={20} color={C.blue} />
            <Text style={styles.mapActionText}>Use Current Location</Text>
            <Ionicons name="chevron-forward" size={18} color={C.muted} />
          </TouchableOpacity>

          <View style={styles.mapBox}>
            <MapView
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              style={styles.map}
              initialRegion={mapRegion}
              region={mapRegion}
              onRegionChangeComplete={setMapRegion}
              onPress={(event: any) => {
                const { latitude: pressedLatitude, longitude: pressedLongitude } = event.nativeEvent.coordinate;
                handleMapPress(pressedLatitude, pressedLongitude);
              }}
            >
              {latitude && longitude ? (
                <Marker coordinate={{ latitude, longitude }} title="Lost & Found location" description={address} />
              ) : null}
            </MapView>

            <View style={styles.mapHint}>
              <Ionicons name="map-outline" size={16} color={C.blue} />
              <Text style={styles.mapHintText}>Tap preview map to drop pin</Text>
            </View>
          </View>
        </View>

        <Text style={styles.formNumber}>4. CONTACT</Text>

        <Text style={styles.label}>Phone or Email</Text>
        <TextInput
          value={contact}
          onChangeText={setContact}
          placeholder="Phone number or email for admin follow-up"
          placeholderTextColor={C.muted2}
          style={styles.darkInput}
        />

        <View style={styles.helpCard}>
          <View style={styles.helpIcon}>
            <Ionicons name="shield-checkmark-outline" size={29} color={C.green} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.helpTitle}>Claim protection</Text>
            <Text style={styles.helpText}>Admin should verify ownership before releasing any found item.</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.blueButton} onPress={submitItemReport} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color={C.white} /> : <Ionicons name="send-outline" size={22} color={C.white} />}
          <Text style={styles.blueButtonText}>{isSubmitting ? 'Submitting...' : 'Submit Lost & Found Report'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export function ProfileScreen({ onNavigate }: { onNavigate: (screen: ScreenName) => void }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContentCompact} showsVerticalScrollIndicator={false}>
        <BrandHeader title="Profile" subtitle="Reporter account" />

        <View style={styles.profileHero}>
          <AppBrandLogo size="large" />

          <Text style={styles.profileName}>Safety Reporter</Text>
          <Text style={styles.profileRole}>Redemption City Safety Command</Text>

          <View style={styles.profileBadge}>
            <View style={styles.commandHeaderDot} />
            <Text style={styles.profileBadgeText}>VERIFIED DEVICE</Text>
          </View>
        </View>

        <View style={styles.profileList}>
          <ProfileRow icon="person-outline" title="Reporter Type" value="Resident / Visitor" color={C.blue} />
          <ProfileRow icon="call-outline" title="Contact" value="Add phone number later" color={C.green} />
          <ProfileRow icon="shield-outline" title="Privacy" value="Anonymous reporting supported" color={C.purple} />
          <ProfileRow icon="notifications-outline" title="Alerts" value="Safety updates enabled" color={C.orange} />
        </View>

        <View style={styles.helpCard}>
          <View style={styles.helpIcon}>
            <Ionicons name="information-circle-outline" size={29} color={C.blue} />
          </View>

          <View style={styles.flex}>
            <Text style={styles.helpTitle}>Account note</Text>
            <Text style={styles.helpText}>
              This profile is currently local/demo. When Supabase is connected, user accounts, password recovery, and admin roles will become real backend features.
            </Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.outlineButton} onPress={() => onNavigate('home')}>
          <Ionicons name="home-outline" size={22} color={C.muted} />
          <Text style={styles.outlineButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabs active="profile" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function ProfileRow({
  icon,
  title,
  value,
  color
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.profileRow}>
      <View style={[styles.profileRowIcon, { backgroundColor: `${color}20`, borderColor: `${color}60` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>

      <View style={styles.flex}>
        <Text style={styles.profileRowTitle}>{title}</Text>
        <Text style={styles.profileRowValue}>{value}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={C.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg
  },
  flex: {
    flex: 1
  },
  scrollContent: {
    paddingTop: HEADER_TOP,
    paddingHorizontal: 16,
    paddingBottom: 44
  },
  scrollContentCompact: {
    paddingTop: HEADER_TOP,
    paddingHorizontal: 16,
    paddingBottom: 110
  },
  brandHeader: {
    minHeight: 82,
    borderRadius: 22,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
    marginBottom: 16
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  brandTextWrap: {
    flex: 1,
    marginLeft: 12
  },
  commandHeaderChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: 'rgba(35,209,96,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(35,209,96,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  commandHeaderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.green,
    marginRight: 6
  },
  commandHeaderText: {
    color: C.green,
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1
  },
  brandTitle: {
    color: C.text,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4
  },
  brandSubtitle: {
    color: C.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2
  },
  bellButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  notificationDot: {
    position: 'absolute',
    right: 9,
    top: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.red
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 76,
    backgroundColor: '#06111E',
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 7
  },
  tabItem: {
    flex: 1,
    alignItems: 'center'
  },
  tabBadge: {
    position: 'absolute',
    top: -9,
    right: -13,
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabBadgeText: {
    color: C.white,
    fontSize: 10,
    fontWeight: '900'
  },
  tabLabel: {
    color: C.muted,
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 3
  },
  tabLabelActive: {
    color: C.blue
  },
  criticalAlert: {
    minHeight: 72,
    borderRadius: 18,
    backgroundColor: '#690B12',
    borderWidth: 1,
    borderColor: '#991B24',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  criticalIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11
  },
  criticalTitle: {
    color: C.white,
    fontSize: 14,
    fontWeight: '900'
  },
  criticalText: {
    color: '#F6D1D5',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2
  },
  criticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 9
  },
  criticalAction: {
    color: C.white,
    fontSize: 10.5,
    fontWeight: '900'
  },
  statusPill: {
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignSelf: 'flex-start'
  },
  statusPillText: {
    fontSize: 9.5,
    fontWeight: '900'
  },
  stepHeader: {
    marginBottom: 10
  },
  bigTitle: {
    color: C.text,
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: -0.8
  },
  stepText: {
    color: C.muted,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4
  },
  stepDotsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.borderStrong,
    backgroundColor: C.card2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepCircleActive: {
    backgroundColor: C.blue,
    borderColor: C.blue
  },
  stepCircleText: {
    color: C.muted,
    fontWeight: '900'
  },
  stepCircleTextActive: {
    color: C.white
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: C.borderStrong,
    marginHorizontal: 7
  },
  stepLineActive: {
    backgroundColor: C.blue
  },
  formTitle: {
    color: C.text,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 7
  },
  formSubtitle: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16
  },
  categoryGridCompact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 16
  },
  categoryCardCompact: {
    width: '48.5%',
    minHeight: 118,
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14
  },
  selectedTick: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryTextCompact: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 10
  },
  helpCard: {
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  helpIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: C.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11
  },
  helpTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900'
  },
  helpText: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3
  },
  bottomAction: {
    padding: 16,
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: C.border
  },
  blueButton: {
    minHeight: 62,
    borderRadius: 18,
    backgroundColor: C.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10
  },
  blueButtonText: {
    color: C.white,
    fontSize: 16.5,
    fontWeight: '900'
  },
  selectedIncidentCard: {
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18
  },
  selectedIncidentIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  smallMuted: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '800'
  },
  selectedIncidentTitle: {
    color: C.text,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 2
  },
  selectedIncidentLocation: {
    color: C.muted,
    fontSize: 12,
    marginTop: 5
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  blueText: {
    color: C.blue,
    fontSize: 12,
    fontWeight: '900'
  },
  formNumber: {
    color: '#B8C8DE',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: 9,
    marginTop: 6
  },
  label: {
    color: C.text,
    fontSize: 13.5,
    fontWeight: '900',
    marginBottom: 8
  },
  darkInput: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.border,
    color: C.text,
    fontSize: 15,
    paddingHorizontal: 14,
    marginBottom: 15
  },
  darkTextArea: {
    minHeight: 128,
    borderRadius: 18,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.border,
    color: C.text,
    fontSize: 15,
    padding: 14,
    marginBottom: 8
  },
  assistText: {
    color: C.muted,
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 16
  },
  mediaGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  mediaBox: {
    flex: 1,
    minHeight: 104,
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mediaTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 8
  },
  mediaText: {
    color: C.muted,
    fontSize: 12,
    marginTop: 2
  },
  attachmentRow: {
    gap: 10,
    marginBottom: 16
  },
  attachmentPreview: {
    width: 104,
    height: 104,
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden'
  },
  attachmentImage: {
    width: '100%',
    height: '100%'
  },
  attachmentOverlay: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(2,11,24,0.78)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  attachmentOverlayText: {
    color: C.white,
    fontSize: 10.5,
    fontWeight: '900',
    marginLeft: 5
  },
  locationPanel: {
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 13,
    marginBottom: 16
  },
  locationTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11
  },
  bigLocationIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: C.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  locationTitle: {
    color: C.text,
    fontSize: 15,
    fontWeight: '900'
  },
  locationSub: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3
  },
  coordinateText: {
    color: C.blue,
    fontSize: 11.5,
    fontWeight: '800',
    marginTop: 4
  },
  mapActionButton: {
    minHeight: 46,
    borderRadius: 15,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 11
  },
  mapActionText: {
    color: C.text,
    fontSize: 13,
    fontWeight: '900',
    flex: 1,
    marginLeft: 8
  },
  mapBox: {
    height: 210,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: C.card2
  },
  map: {
    flex: 1
  },
  mapHint: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(2,11,24,0.86)',
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center'
  },
  mapHintText: {
    color: C.text,
    fontSize: 11.5,
    fontWeight: '800',
    marginLeft: 6
  },
  severityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 16
  },
  severityCard: {
    width: '48.5%',
    minHeight: 104,
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 13
  },
  severityTick: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 23,
    height: 23,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  severityLabel: {
    fontSize: 12,
    fontWeight: '900',
    marginTop: 8
  },
  severityText: {
    color: C.muted,
    fontSize: 11.5,
    marginTop: 3
  },
  switchRow: {
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  switchTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900'
  },
  switchText: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3
  },
  secureText: {
    color: C.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 8
  },
  successCard: {
    borderRadius: 26,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    alignItems: 'center',
    marginBottom: 18
  },
  successIcon: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: C.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  successTitle: {
    color: C.text,
    fontSize: 27,
    fontWeight: '900'
  },
  successMessage: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8
  },
  successDivider: {
    height: 1,
    width: '100%',
    backgroundColor: C.border,
    marginVertical: 18
  },
  successLabel: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5
  },
  successId: {
    color: C.blue,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 5
  },
  responseBox: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.border,
    padding: 13,
    marginTop: 16
  },
  responseLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  responseIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: C.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11
  },
  responseText: {
    color: C.muted,
    fontSize: 12
  },
  responseTime: {
    color: C.text,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2
  },
  responseNote: {
    color: C.muted,
    fontSize: 12,
    marginTop: 10
  },
  sectionCaps: {
    color: '#B8C8DE',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: 10,
    marginTop: 4
  },
  summaryBox: {
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 16,
    overflow: 'hidden'
  },
  summaryRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.border
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  summaryLabel: {
    color: C.muted,
    fontSize: 11.5,
    fontWeight: '800'
  },
  summaryValue: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 3
  },
  outlineButton: {
    minHeight: 60,
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 10
  },
  outlineButtonText: {
    color: C.muted,
    fontSize: 15,
    fontWeight: '900'
  },
  detailedAlert: {
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderLeftWidth: 4,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  detailedIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11
  },
  detailedTitle: {
    color: C.text,
    fontSize: 14.5,
    fontWeight: '900'
  },
  detailedMeta: {
    color: C.muted,
    fontSize: 12,
    marginTop: 4
  },
  detailedDescription: {
    color: C.muted,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 6
  },
  alertRightCompact: {
    alignItems: 'flex-end',
    marginLeft: 8
  },
  alertTimeCompact: {
    color: C.muted,
    fontSize: 10.5,
    marginTop: 7
  },
  detailHero: {
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderLeftWidth: 4,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  detailHeroIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  detailTitle: {
    color: C.text,
    fontSize: 17,
    fontWeight: '900'
  },
  detailLocation: {
    color: C.muted,
    fontSize: 12.5,
    marginTop: 4
  },
  detailMetaBox: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  metaBlock: {
    flex: 1,
    minHeight: 66,
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 10,
    justifyContent: 'center'
  },
  metaLabel: {
    color: C.muted,
    fontSize: 10.5,
    fontWeight: '800'
  },
  metaValue: {
    color: C.text,
    fontSize: 12.5,
    fontWeight: '900',
    marginTop: 5
  },
  trackingWrap: {
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 15,
    marginBottom: 15
  },
  trackPointWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  trackCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11
  },
  trackCircleActive: {
    borderColor: C.blue,
    backgroundColor: C.blueSoft
  },
  trackLabel: {
    color: C.muted,
    fontSize: 14,
    fontWeight: '900',
    flex: 1
  },
  trackLabelActive: {
    color: C.text
  },
  trackTime: {
    color: C.muted,
    fontSize: 12,
    fontWeight: '700'
  },
  trackLine: {
    width: 2,
    height: 25,
    backgroundColor: C.borderStrong,
    marginLeft: 16,
    marginVertical: 4
  },
  trackLineActive: {
    backgroundColor: C.blue
  },
  trackLineDashed: {
    opacity: 0.45
  },
  statusInfoCard: {
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  statusInfoTitle: {
    color: C.text,
    fontSize: 15,
    fontWeight: '900'
  },
  statusInfoText: {
    color: C.muted,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 3
  },
  responderCard: {
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  responderIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: C.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  responderOnline: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.green,
    borderWidth: 2,
    borderColor: C.card
  },
  responderName: {
    color: C.text,
    fontSize: 15,
    fontWeight: '900'
  },
  responderRole: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3
  },
  unitBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: C.greenSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8
  },
  unitBadgeText: {
    color: C.green,
    fontSize: 9.5,
    fontWeight: '900'
  },
  etaBlock: {
    alignItems: 'flex-end',
    marginLeft: 8
  },
  etaText: {
    color: C.blue,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4
  },
  notesBox: {
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    marginBottom: 16
  },
  noteText: {
    color: C.text,
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '700'
  },
  noteMeta: {
    color: C.muted,
    fontSize: 11.5,
    marginTop: 8
  },
  mediaDetailRow: {
    marginBottom: 16
  },
  mediaDetailBox: {
    height: 158,
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden'
  },
  mediaDetailImage: {
    width: '100%',
    height: '100%'
  },
  mediaCount: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(2,11,24,0.82)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center'
  },
  mediaCountText: {
    color: C.white,
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 5
  },
  addMoreMedia: {
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  plusCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  addMoreTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900'
  },
  addMoreText: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3
  },
  latestUpdate: {
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  latestTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900'
  },
  latestText: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3
  },
  detailActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18
  },
  outlineHalf: {
    flex: 1,
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.blue,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7
  },
  outlineHalfText: {
    color: C.blue,
    fontSize: 12.5,
    fontWeight: '900'
  },
  blueHalf: {
    flex: 1,
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: C.blue,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7
  },
  blueHalfText: {
    color: C.white,
    fontSize: 12.5,
    fontWeight: '900'
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  darkFilter: {
    flex: 1,
    minHeight: 42,
    borderRadius: 999,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  darkFilterActive: {
    backgroundColor: C.blue,
    borderColor: C.blue
  },
  darkFilterText: {
    color: C.muted,
    fontSize: 12,
    fontWeight: '900'
  },
  darkFilterTextActive: {
    color: C.white
  },
  lostFoundReportCard: {
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  modeToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18
  },
  modeButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  modeButtonActive: {
    backgroundColor: C.blue,
    borderColor: C.blue
  },
  modeText: {
    color: C.muted,
    fontSize: 14,
    fontWeight: '900'
  },
  modeTextActive: {
    color: C.white
  },
  selectRow: {
    gap: 8,
    paddingBottom: 12,
    marginBottom: 5
  },
  choiceChip: {
    borderRadius: 999,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  choiceChipActive: {
    backgroundColor: C.blue,
    borderColor: C.blue
  },
  choiceText: {
    color: C.muted,
    fontSize: 12.5,
    fontWeight: '900'
  },
  choiceTextActive: {
    color: C.white
  },
  previewBox: {
    height: 170,
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    marginBottom: 16
  },
  lostFoundImage: {
    width: '100%',
    height: '100%'
  },
  profileHero: {
    borderRadius: 26,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16
  },
  profileName: {
    color: C.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 16
  },
  profileRole: {
    color: C.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4
  },
  profileBadge: {
    borderRadius: 999,
    backgroundColor: C.greenSoft,
    borderWidth: 1,
    borderColor: 'rgba(35,209,96,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginTop: 13
  },
  profileBadgeText: {
    color: C.green,
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 1.2
  },
  profileList: {
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    marginBottom: 16
  },
  profileRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.border
  },
  profileRowIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  profileRowTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900'
  },
  profileRowValue: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3
  }
});