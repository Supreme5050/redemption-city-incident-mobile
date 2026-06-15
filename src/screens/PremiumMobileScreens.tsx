import React, { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DraftIncident, Incident, IncidentSeverity, IncidentType } from '../types/incident';
import { ScreenName } from '../types/navigation';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

const C = {
  green: '#0F3D2A',
  green2: '#155B3B',
  greenSoft: '#EAF7EF',
  gold: '#D6B45B',
  bg: '#F4F7F5',
  card: '#FFFFFF',
  line: '#E4EAE6',
  text: '#0F172A',
  muted: '#64748B',
  light: '#F8FAFC',
  red: '#DC2626',
  orange: '#F59E0B',
  blue: '#2563EB',
  purple: '#7C3AED',
  teal: '#0F766E'
};

const incidentOptions = [
  { label: 'Power Issue', type: 'Electricity / Power Issue', icon: 'flash-outline', color: C.orange, bg: '#FFF7E6' },
  { label: 'Theft / Security', type: 'Theft / Security Issue', icon: 'shield-checkmark-outline', color: C.blue, bg: '#EFF6FF' },
  { label: 'Misconduct', type: 'Fight / Misconduct', icon: 'hand-left-outline', color: C.red, bg: '#FEF2F2' },
  { label: 'Suspicious Activity', type: 'Suspicious Activity', icon: 'eye-outline', color: C.purple, bg: '#F5F3FF' },
  { label: 'Lost Person', type: 'Lost Child / Missing Person', icon: 'person-outline', color: C.orange, bg: '#FFF7E6' },
  { label: 'Medical', type: 'Medical / First Aid', icon: 'medkit-outline', color: '#15803D', bg: '#F0FDF4' },
  { label: 'Fire / Smoke', type: 'Fire / Smoke', icon: 'flame-outline', color: '#E11D48', bg: '#FFF1F2' },
  { label: 'Traffic', type: 'Traffic / Road Obstruction', icon: 'car-outline', color: '#EA580C', bg: '#FFF7ED' },
  { label: 'Facility Fault', type: 'Facility / Maintenance Fault', icon: 'business-outline', color: C.teal, bg: '#F0FDFA' },
  { label: 'Other', type: 'Other', icon: 'ellipsis-horizontal-circle-outline', color: '#475569', bg: '#F8FAFC' }
];

const severityOptions: Array<{ label: IncidentSeverity; color: string; bg: string; note: string }> = [
  { label: 'Low', color: '#15803D', bg: '#F0FDF4', note: 'Routine review' },
  { label: 'Medium', color: C.orange, bg: '#FFF7E6', note: 'Needs attention' },
  { label: 'High', color: C.red, bg: '#FEF2F2', note: 'Fast response' },
  { label: 'Critical', color: '#7F1D1D', bg: '#FEE2E2', note: 'Urgent action' }
];

const zones = [
  'Main Auditorium Area',
  'Diligence Road',
  'Chalet Area',
  'Clinic Area',
  'Market Area',
  'Camp Road',
  'Youth Centre',
  'Residential Area'
];

function toIncidentType(value: string): IncidentType {
  return value as IncidentType;
}

function getSeverityColor(severity?: string | null) {
  if (severity === 'Critical' || severity === 'High') return C.red;
  if (severity === 'Medium') return C.orange;
  return '#15803D';
}

function getStatusColor(status: string) {
  if (status === 'Resolved') return '#15803D';
  if (status === 'Rejected') return C.red;
  if (status === 'Assigned' || status === 'Responder En Route') return C.blue;
  return C.orange;
}

export function HomeScreen({
  incidents,
  onNavigate,
  onStartReport,
  onOpenIncident
}: {
  incidents: Incident[];
  onNavigate: (screen: ScreenName) => void;
  onStartReport: (options?: Partial<DraftIncident>) => void;
  onOpenIncident: (incident: Incident) => void;
}) {
  const recentReports = useMemo(() => incidents.slice(0, 3), [incidents]);

  function startQuickReport(type: string, severity: IncidentSeverity, title: string) {
    onStartReport({
      type: toIncidentType(type),
      severity,
      title,
      description: '',
      location: 'Main Auditorium Area',
      address: 'Main Auditorium Area, Redemption City Camp'
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={C.green} barStyle="light-content" translucent={false} />

      <View style={styles.homeHeader}>
        <View style={styles.headerTop}>
          <View style={styles.brandRow}>
            <View style={styles.logoBox}>
              <Ionicons name="leaf-outline" size={25} color={C.gold} />
            </View>

            <View style={styles.brandTextWrap}>
              <Text style={styles.brandTitle}>REDEMPTION CITY CAMP</Text>
              <Text style={styles.brandSubtitle}>SAFETY & INCIDENT MANAGEMENT</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerCircle} activeOpacity={0.85} onPress={() => onNavigate('alerts')}>
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              <View style={styles.badgeBubble}>
                <Text style={styles.badgeBubbleText}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileCircle} activeOpacity={0.85} onPress={() => onNavigate('profile')}>
              <Ionicons name="person" size={18} color={C.green} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroArea}>
          <View style={styles.statusPillDark}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusPillTextDark}>Admin Control Desk Online</Text>
          </View>

          <Text style={styles.heroTitle}>Camp safety, reports, and response in one place.</Text>
          <Text style={styles.heroSubtitle}>
            Submit incidents, report lost items, track cases, and receive updates through verified admin routing.
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.emergencyCard}
          onPress={() => startQuickReport('Medical / First Aid', 'Critical', 'Emergency assistance needed')}
        >
          <View style={styles.emergencyIconWrap}>
            <Ionicons name="warning-outline" size={30} color={C.red} />
          </View>

          <View style={styles.flex}>
            <Text style={styles.priorityLabel}>PRIORITY ACTION</Text>
            <Text style={styles.emergencyTitle}>Emergency Report</Text>
            <Text style={styles.emergencyText}>Use this for urgent danger, injury, fire, or serious threat.</Text>
          </View>

          <View style={styles.redArrow}>
            <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <SectionCard>
          <SectionHead
            title="Quick Actions"
            subtitle="Choose the right action for your situation."
            action="My Reports"
            onAction={() => onNavigate('my-reports')}
          />

          <View style={styles.actionStack}>
            <ActionRow
              title="Report Incident"
              subtitle="Submit a new incident for admin review"
              icon="document-text-outline"
              color={C.green}
              bg={C.greenSoft}
              onPress={() => onStartReport()}
            />
            <ActionRow
              title="Lost & Found"
              subtitle="Report lost or found property"
              icon="file-tray-full-outline"
              color={C.purple}
              bg="#F3E8FF"
              onPress={() => onNavigate('lost-found')}
            />
            <ActionRow
              title="Track Reports"
              subtitle="Follow progress of your submitted cases"
              icon="analytics-outline"
              color={C.blue}
              bg="#EAF2FF"
              onPress={() => onNavigate('my-reports')}
            />
          </View>
        </SectionCard>

        <SectionCard>
          <SectionHead title="Incident Categories" subtitle="Fast reporting for common camp issues." />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {incidentOptions.map((item) => (
              <CategoryChip
                key={item.label}
                title={item.label}
                icon={item.icon as keyof typeof Ionicons.glyphMap}
                color={item.color}
                bg={item.bg}
                onPress={() => startQuickReport(item.type, item.label === 'Fire / Smoke' ? 'Critical' : 'Medium', `${item.label} reported`)}
              />
            ))}
          </ScrollView>
        </SectionCard>

        <SectionCard>
          <SectionHead
            title="Live Situation"
            subtitle="A quick view of what needs attention."
            action="View Alerts"
            onAction={() => onNavigate('alerts')}
          />

          <View style={styles.metricsRow}>
            <MetricBox value="8" label="Active" icon="pulse-outline" color={C.red} bg="#FEF2F2" />
            <MetricBox value="3" label="Critical" icon="alert-circle-outline" color={C.red} bg="#FEF2F2" />
            <MetricBox value="12" label="Resolved" icon="checkmark-circle-outline" color="#15803D" bg="#F0FDF4" />
          </View>

          <View style={styles.alertList}>
            <MiniAlert title="Power outage around Diligence Road" meta="Power Issue • In Review" color={C.orange} icon="flash-outline" />
            <MiniAlert title="Suspicious movement near Chalet Area" meta="Security Concern • High Priority" color={C.red} icon="eye-outline" />
          </View>
        </SectionCard>

        <TouchableOpacity activeOpacity={0.9} style={styles.lostFoundBanner} onPress={() => onNavigate('lost-found')}>
          <View style={styles.lostFoundIcon}>
            <Ionicons name="file-tray-full-outline" size={27} color="#FFFFFF" />
          </View>

          <View style={styles.flex}>
            <Text style={styles.lostFoundTitle}>Lost something in camp?</Text>
            <Text style={styles.lostFoundText}>Report lost or found items. Admin verifies ownership before handover.</Text>
          </View>

          <View style={styles.whitePill}>
            <Text style={styles.whitePillText}>Open</Text>
          </View>
        </TouchableOpacity>

        <SectionCard>
          <SectionHead
            title="Recently Submitted"
            subtitle="Your latest reports and updates."
            action="View All"
            onAction={() => onNavigate('my-reports')}
          />

          {recentReports.length === 0 ? (
            <EmptyState text="Submitted incidents and Lost & Found reports will appear here." />
          ) : (
            recentReports.map((incident) => (
              <TouchableOpacity
                key={incident.id}
                activeOpacity={0.85}
                style={styles.recentRow}
                onPress={() => onOpenIncident(incident)}
              >
                <View style={styles.recentIcon}>
                  <Ionicons name="document-text-outline" size={18} color={C.green} />
                </View>

                <View style={styles.flex}>
                  <Text style={styles.recentId}>{incident.id}</Text>
                  <Text style={styles.recentMeta} numberOfLines={1}>
                    {incident.type} • {incident.location}
                  </Text>
                </View>

                <StatusBadge label={incident.status} />
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ))
          )}
        </SectionCard>

        <View style={styles.noticeCard}>
          <View style={styles.noticeIcon}>
            <Ionicons name="shield-checkmark-outline" size={23} color={C.green} />
          </View>

          <View style={styles.flex}>
            <Text style={styles.noticeTitle}>Verified routing only</Text>
            <Text style={styles.noticeText}>
              No fake office names or phone numbers are displayed. Official response units will be configured by verified admins.
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomTabs active="home" onNavigate={onNavigate} />
    </SafeAreaView>
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
  function goNext() {
    if (!draft.type) {
      Alert.alert('Incident type required', 'Please select the type of incident.');
      return;
    }

    if (!draft.title.trim()) {
      Alert.alert('Title required', 'Please enter a short title for the report.');
      return;
    }

    if (!draft.description.trim()) {
      Alert.alert('Description required', 'Please describe what happened.');
      return;
    }

    onNavigate('report-step-two');
  }

  return (
    <PremiumPage active="home" onNavigate={onNavigate}>
      <PremiumHeader
        title="Report Incident"
        subtitle="Step 1 of 2 • Incident details"
        icon="arrow-back"
        onIconPress={() => onNavigate('home')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard>
          <SectionHead title="What happened?" subtitle="Choose the closest category and describe the issue clearly." />

          <View style={styles.typeGrid}>
            {incidentOptions.map((item) => {
              const active = draft.type === item.type;

              return (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.86}
                  style={[styles.typeTile, active && styles.typeTileActive]}
                  onPress={() =>
                    setDraft((prev) => ({
                      ...prev,
                      type: toIncidentType(item.type)
                    }))
                  }
                >
                  <View style={[styles.typeIcon, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={23} color={item.color} />
                  </View>
                  <Text style={styles.typeTileText}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <FormLabel label="Incident Title" required />
          <TextInput
            value={draft.title}
            onChangeText={(title) => setDraft((prev) => ({ ...prev, title }))}
            placeholder="Example: Power outage around Diligence Road"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />

          <FormLabel label="Description" required />
          <TextInput
            value={draft.description}
            onChangeText={(description) => setDraft((prev) => ({ ...prev, description }))}
            placeholder="Describe what happened, where it happened, and the current situation..."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            style={styles.textArea}
          />

          <FormLabel label="Severity" required />
          <View style={styles.severityGrid}>
            {severityOptions.map((item) => {
              const active = draft.severity === item.label;

              return (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.86}
                  style={[styles.severityCard, active && { borderColor: item.color, backgroundColor: item.bg }]}
                  onPress={() => setDraft((prev) => ({ ...prev, severity: item.label }))}
                >
                  <View style={[styles.severityDot, { backgroundColor: item.color }]} />
                  <View style={styles.flex}>
                    <Text style={styles.severityTitle}>{item.label}</Text>
                    <Text style={styles.severityNote}>{item.note}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={goNext}>
            <Text style={styles.primaryButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </SectionCard>
      </ScrollView>
    </PremiumPage>
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
  function submit() {
    if (!draft.location.trim()) {
      Alert.alert('Location required', 'Please choose or enter the incident location.');
      return;
    }

    if (!draft.anonymous && !draft.reporterContact.trim()) {
      Alert.alert('Contact required', 'Please add your phone number or email so admin can follow up.');
      return;
    }

    onSubmit();
  }

  return (
    <PremiumPage active="home" onNavigate={onNavigate}>
      <PremiumHeader
        title="Report Incident"
        subtitle="Step 2 of 2 • Location and contact"
        icon="arrow-back"
        onIconPress={() => onNavigate('report-step-one')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard>
          <SectionHead title="Where did it happen?" subtitle="Location helps admin route the report faster." />

          <FormLabel label="Location / Zone" required />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.zoneRow}>
            {zones.map((zone) => {
              const active = draft.location === zone;

              return (
                <TouchableOpacity
                  key={zone}
                  activeOpacity={0.85}
                  style={[styles.zoneChip, active && styles.zoneChipActive]}
                  onPress={() =>
                    setDraft((prev) => ({
                      ...prev,
                      location: zone,
                      address: `${zone}, Redemption City Camp`
                    }))
                  }
                >
                  <Text style={[styles.zoneChipText, active && styles.zoneChipTextActive]}>{zone}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.mapPreviewCard}>
            <View style={styles.mapPin}>
              <Ionicons name="location" size={32} color={C.green} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.mapPreviewTitle}>{draft.location}</Text>
              <Text style={styles.mapPreviewText}>{draft.address}</Text>
            </View>
          </View>

          <FormLabel label="Reporter Contact" required={!draft.anonymous} />
          <View style={styles.inputWithIcon}>
            <Ionicons name="call-outline" size={18} color={C.muted} />
            <TextInput
              value={draft.reporterContact}
              onChangeText={(reporterContact) => setDraft((prev) => ({ ...prev, reporterContact }))}
              placeholder="Phone number or email"
              placeholderTextColor="#94A3B8"
              style={styles.inputFlex}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.switchRow}
            onPress={() => setDraft((prev) => ({ ...prev, anonymous: !prev.anonymous }))}
          >
            <View style={[styles.checkBox, draft.anonymous && styles.checkBoxActive]}>
              {draft.anonymous ? <Ionicons name="checkmark" size={15} color="#FFFFFF" /> : null}
            </View>
            <View style={styles.flex}>
              <Text style={styles.switchTitle}>Submit anonymously</Text>
              <Text style={styles.switchText}>Admin may have limited ability to follow up if anonymous.</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.uploadCard}>
            <View style={styles.uploadIcon}>
              <Ionicons name="cloud-upload-outline" size={25} color={C.green} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.uploadTitle}>Evidence attachments</Text>
              <Text style={styles.uploadText}>Photo and file upload UI is ready. Device picker will be connected later.</Text>
            </View>
          </View>

          <View style={styles.noticeCardSoft}>
            <Ionicons name="lock-closed-outline" size={21} color={C.green} />
            <Text style={styles.noticeSoftText}>
              This report goes to Admin Control Desk first. Official offices and phone numbers will only be managed by verified admins.
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={submit} disabled={isSubmitting}>
            <Text style={styles.primaryButtonText}>{isSubmitting ? 'Submitting...' : 'Submit Incident Report'}</Text>
            <Ionicons name="paper-plane-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </SectionCard>
      </ScrollView>
    </PremiumPage>
  );
}

export function LostFoundScreen({ onNavigate }: { onNavigate: (screen: ScreenName) => void }) {
  const [mode, setMode] = useState<'Lost Item' | 'Found Item'>('Lost Item');
  const [category, setCategory] = useState('Phone');
  const [zone, setZone] = useState('Main Auditorium Area');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (!itemName.trim() || !description.trim() || !contact.trim()) {
      Alert.alert('Complete required fields', 'Please enter item name, description, and contact for admin follow-up.');
      return;
    }

    setSubmitted(true);
  }

  return (
    <PremiumPage active="home" onNavigate={onNavigate}>
      <PremiumHeader
        title="Lost & Found"
        subtitle="Admin review and safe handover"
        icon="arrow-back"
        onIconPress={() => onNavigate('home')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {submitted ? (
          <SectionCard>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={35} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Submitted for admin review</Text>
            <Text style={styles.successText}>
              Your Lost & Found record has been received. Admin will review the details and verify ownership before any handover.
            </Text>
            <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={() => onNavigate('home')}>
              <Text style={styles.primaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </SectionCard>
        ) : (
          <SectionCard>
            <View style={styles.modeTabs}>
              {(['Lost Item', 'Found Item'] as const).map((item) => {
                const active = mode === item;

                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.85}
                    style={[styles.modeTab, active && styles.modeTabActive]}
                    onPress={() => setMode(item)}
                  >
                    <Text style={[styles.modeTabText, active && styles.modeTabTextActive]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <SectionHead title={`${mode} Details`} subtitle="Give admin enough information to match and verify ownership." />

            <FormLabel label="Item Name" required />
            <TextInput
              value={itemName}
              onChangeText={setItemName}
              placeholder="Example: Black Samsung phone, brown wallet, ID card"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />

            <FormLabel label="Category" required />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.zoneRow}>
              {['Phone', 'Bag', 'Wallet', 'ID Card', 'Keys', 'Bible / Book', 'Electronics', 'Other'].map((item) => {
                const active = category === item;

                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.85}
                    style={[styles.zoneChip, active && styles.zoneChipActive]}
                    onPress={() => setCategory(item)}
                  >
                    <Text style={[styles.zoneChipText, active && styles.zoneChipTextActive]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <FormLabel label={mode === 'Lost Item' ? 'Last Seen Location' : 'Found Location'} required />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.zoneRow}>
              {zones.map((item) => {
                const active = zone === item;

                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.85}
                    style={[styles.zoneChip, active && styles.zoneChipActive]}
                    onPress={() => setZone(item)}
                  >
                    <Text style={[styles.zoneChipText, active && styles.zoneChipTextActive]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.mapPreviewCard}>
              <View style={styles.mapPin}>
                <Ionicons name="location" size={32} color={C.green} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.mapPreviewTitle}>{zone}</Text>
                <Text style={styles.mapPreviewText}>Admin will use this location to compare related records.</Text>
              </View>
            </View>

            <FormLabel label="Description" required />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe color, brand, content, special mark, or exact place it was found..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              style={styles.textArea}
            />

            <FormLabel label="Contact for Admin Follow-up" required />
            <View style={styles.inputWithIcon}>
              <Ionicons name="call-outline" size={18} color={C.muted} />
              <TextInput
                value={contact}
                onChangeText={setContact}
                placeholder="Phone number or email"
                placeholderTextColor="#94A3B8"
                style={styles.inputFlex}
              />
            </View>

            <View style={styles.uploadCard}>
              <View style={styles.uploadIcon}>
                <Ionicons name="camera-outline" size={25} color={C.green} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.uploadTitle}>Add item photo</Text>
                <Text style={styles.uploadText}>Photo upload will be connected later for stronger verification.</Text>
              </View>
            </View>

            <View style={styles.noticeCardSoft}>
              <Ionicons name="lock-closed-outline" size={21} color={C.green} />
              <Text style={styles.noticeSoftText}>
                Contact details are not public. Admin controls claim verification and handover.
              </Text>
            </View>

            <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={submit}>
              <Text style={styles.primaryButtonText}>Submit to Admin Review</Text>
              <Ionicons name="paper-plane-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </SectionCard>
        )}
      </ScrollView>
    </PremiumPage>
  );
}

export function MyReportsScreen({
  incidents,
  onNavigate,
  onOpenIncident
}: {
  incidents: Incident[];
  onNavigate: (screen: ScreenName) => void;
  onOpenIncident: (incident: Incident) => void;
}) {
  const active = incidents.filter((incident) => incident.status !== 'Resolved').length;
  const resolved = incidents.filter((incident) => incident.status === 'Resolved').length;

  return (
    <PremiumPage active="reports" onNavigate={onNavigate}>
      <PremiumHeader title="My Reports" subtitle="Track submitted incidents and follow-up actions" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <ReportStat value={String(active)} label="Active" icon="time-outline" color={C.orange} bg="#FFF7E6" />
          <ReportStat value={String(resolved)} label="Resolved" icon="checkmark-circle-outline" color="#15803D" bg="#F0FDF4" />
          <ReportStat value="0" label="Drafts" icon="document-outline" color={C.blue} bg="#EFF6FF" />
        </View>

        <SectionCard>
          <SectionHead title="Report History" subtitle="Tap any report to view details." action="New Report" onAction={() => onNavigate('report-step-one')} />

          {incidents.length === 0 ? (
            <EmptyState text="No reports have been submitted yet." />
          ) : (
            incidents.map((incident) => (
              <TouchableOpacity
                key={incident.id}
                activeOpacity={0.85}
                style={styles.reportRow}
                onPress={() => onOpenIncident(incident)}
              >
                <View style={[styles.reportIcon, { backgroundColor: `${getSeverityColor(incident.severity)}14` }]}>
                  <Ionicons name="document-text-outline" size={21} color={getSeverityColor(incident.severity)} />
                </View>

                <View style={styles.flex}>
                  <Text style={styles.reportTitle}>{incident.title}</Text>
                  <Text style={styles.reportMeta}>{incident.id} • {incident.location}</Text>
                  <Text style={styles.reportDate}>{incident.reportedAt}</Text>
                </View>

                <StatusBadge label={incident.status} />
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ))
          )}
        </SectionCard>
      </ScrollView>
    </PremiumPage>
  );
}

export function AlertsScreen({ onNavigate }: { onNavigate: (screen: ScreenName) => void }) {
  const alerts = [
    { title: 'Power outage around Diligence Road', meta: 'Power Issue • In Review', severity: 'Medium', icon: 'flash-outline', color: C.orange },
    { title: 'Suspicious movement near Chalet Area', meta: 'Security Concern • High Priority', severity: 'High', icon: 'eye-outline', color: C.red },
    { title: 'Traffic obstruction near Camp Road', meta: 'Road Obstruction • Monitoring', severity: 'Medium', icon: 'car-outline', color: '#EA580C' },
    { title: 'Medical support requested near Clinic Area', meta: 'Medical • Assigned', severity: 'High', icon: 'medkit-outline', color: '#15803D' }
  ];

  return (
    <PremiumPage active="alerts" onNavigate={onNavigate}>
      <PremiumHeader title="Live Alerts" subtitle="Monitor current issues across camp" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={C.muted} />
          <Text style={styles.searchPlaceholder}>Search alerts by location or type</Text>
          <Ionicons name="options-outline" size={20} color={C.green} />
        </View>

        <View style={styles.metricsRow}>
          <MetricBox value="8" label="Active" icon="pulse-outline" color={C.red} bg="#FEF2F2" />
          <MetricBox value="3" label="Critical" icon="alert-circle-outline" color={C.red} bg="#FEF2F2" />
          <MetricBox value="12" label="Resolved" icon="checkmark-circle-outline" color="#15803D" bg="#F0FDF4" />
        </View>

        <SectionCard>
          <SectionHead title="Current Alerts" subtitle="Admin-verified reports needing attention." />

          {alerts.map((alert) => (
            <TouchableOpacity key={alert.title} activeOpacity={0.85} style={styles.alertFullRow}>
              <View style={[styles.alertFullIcon, { backgroundColor: `${alert.color}14` }]}>
                <Ionicons name={alert.icon as keyof typeof Ionicons.glyphMap} size={23} color={alert.color} />
              </View>

              <View style={styles.flex}>
                <Text style={styles.alertFullTitle}>{alert.title}</Text>
                <Text style={styles.alertFullMeta}>{alert.meta}</Text>
              </View>

              <View style={[styles.smallBadge, { backgroundColor: `${alert.color}14` }]}>
                <Text style={[styles.smallBadgeText, { color: alert.color }]}>{alert.severity}</Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </SectionCard>
      </ScrollView>
    </PremiumPage>
  );
}

export function ReportDetailsScreen({
  incident,
  onNavigate
}: {
  incident: Incident;
  onNavigate: (screen: ScreenName) => void;
}) {
  return (
    <PremiumPage active="reports" onNavigate={onNavigate}>
      <PremiumHeader
        title="Incident Details"
        subtitle={incident.id}
        icon="arrow-back"
        onIconPress={() => onNavigate('my-reports')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard>
          <View style={styles.detailTop}>
            <View style={styles.flex}>
              <Text style={styles.detailTitle}>{incident.title}</Text>
              <Text style={styles.detailMeta}>{incident.type} • {incident.location}</Text>
            </View>

            <View style={[styles.severityBadge, { backgroundColor: `${getSeverityColor(incident.severity)}14` }]}>
              <Text style={[styles.severityBadgeText, { color: getSeverityColor(incident.severity) }]}>{incident.severity}</Text>
            </View>
          </View>

          <View style={styles.statusPanel}>
            <Text style={styles.statusTitle}>Current Status</Text>
            <View style={styles.statusLine}>
              {['Submitted', 'In Review', 'Assigned', 'Resolved'].map((item, index) => {
                const done = index <= 1 || incident.status === item || incident.status === 'Resolved';

                return (
                  <View key={item} style={styles.statusStep}>
                    <View style={[styles.statusCircle, done && styles.statusCircleActive]}>
                      {done ? <Ionicons name="checkmark" size={15} color="#FFFFFF" /> : null}
                    </View>
                    <Text style={styles.statusStepText}>{item}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <InfoBlock icon="location-outline" title="Location" text={`${incident.location}\n${incident.address}`} />
          <InfoBlock icon="document-text-outline" title="Incident Summary" text={incident.description} />
          <InfoBlock icon="person-outline" title="Reporter" text={`${incident.reporterName ?? 'Reporter'}\n${incident.reporterContact ?? 'Contact not provided'}`} />

          <Text style={styles.timelineTitle}>Timeline</Text>
          {incident.timeline.map((item) => (
            <View key={item.id} style={styles.timelineRow}>
              <View style={styles.timelineDot} />
              <View style={styles.flex}>
                <Text style={styles.timelineItemTitle}>{item.title}</Text>
                <Text style={styles.timelineItemText}>{item.description}</Text>
                <Text style={styles.timelineItemTime}>{item.timestamp} • {item.actor}</Text>
              </View>
            </View>
          ))}
        </SectionCard>
      </ScrollView>
    </PremiumPage>
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
  return (
    <PremiumPage active="reports" onNavigate={onNavigate}>
      <ScrollView contentContainerStyle={styles.successPage} showsVerticalScrollIndicator={false}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={38} color="#FFFFFF" />
        </View>

        <Text style={styles.successTitle}>Report Submitted</Text>
        <Text style={styles.successText}>
          Your report has been submitted to the Admin Control Desk. It will be reviewed and routed to the appropriate verified unit.
        </Text>

        <View style={styles.successCard}>
          <Text style={styles.successIncidentId}>{incident.id}</Text>
          <Text style={styles.successIncidentTitle}>{incident.title}</Text>
          <Text style={styles.successIncidentMeta}>{incident.type} • {incident.location}</Text>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={() => onOpenIncident(incident)}>
          <Text style={styles.primaryButtonText}>View Details</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9} style={styles.secondaryButton} onPress={() => onNavigate('home')}>
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </PremiumPage>
  );
}

export function CampMapScreen({ onNavigate }: { onNavigate: (screen: ScreenName) => void }) {
  return (
    <PremiumPage active="map" onNavigate={onNavigate}>
      <PremiumHeader title="Camp Map" subtitle="Zones, incidents, and safe routing preview" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard>
          <SectionHead title="Camp Zones" subtitle="Mock preview for MVP. Real map will connect later." />

          <View style={styles.bigMap}>
            <View style={styles.mapZoneOne}>
              <Text style={styles.mapZoneText}>AUDITORIUM</Text>
            </View>
            <View style={styles.mapZoneTwo}>
              <Text style={styles.mapZoneText}>CHALET</Text>
            </View>
            <View style={styles.mapZoneThree}>
              <Text style={styles.mapZoneText}>RESIDENTIAL</Text>
            </View>

            <View style={[styles.mapAlertPin, { top: 90, right: 90 }]}>
              <Ionicons name="alert" size={18} color="#FFFFFF" />
            </View>

            <View style={[styles.mapClearPin, { bottom: 90, left: 120 }]}>
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.zoneList}>
            <ZoneItem title="Main Auditorium Area" status="Monitoring" color={C.orange} />
            <ZoneItem title="Chalet Area" status="Security Review" color={C.red} />
            <ZoneItem title="Residential Area" status="All Clear" color="#15803D" />
          </View>
        </SectionCard>
      </ScrollView>
    </PremiumPage>
  );
}

export function PlaceholderScreen({
  active,
  title,
  subtitle,
  icon,
  onNavigate
}: {
  active: 'home' | 'reports' | 'alerts' | 'map' | 'profile';
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onNavigate: (screen: ScreenName) => void;
}) {
  return (
    <PremiumPage active={active} onNavigate={onNavigate}>
      <PremiumHeader title={title} subtitle={subtitle} />

      <View style={styles.placeholderBody}>
        <View style={styles.placeholderIcon}>
          <Ionicons name={icon} size={42} color={C.green} />
        </View>
        <Text style={styles.placeholderTitle}>{title}</Text>
        <Text style={styles.placeholderText}>{subtitle}</Text>
      </View>
    </PremiumPage>
  );
}

function PremiumPage({
  children,
  active,
  onNavigate
}: {
  children: React.ReactNode;
  active: 'home' | 'reports' | 'alerts' | 'map' | 'profile';
  onNavigate: (screen: ScreenName) => void;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={C.green} barStyle="light-content" translucent={false} />
      {children}
      <BottomTabs active={active} onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function PremiumHeader({
  title,
  subtitle,
  icon,
  onIconPress
}: {
  title: string;
  subtitle: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onIconPress?: () => void;
}) {
  return (
    <View style={styles.simpleHeader}>
      <View style={styles.simpleHeaderTop}>
        <TouchableOpacity activeOpacity={0.85} style={styles.headerCircle} onPress={onIconPress}>
          <Ionicons name={icon ?? 'leaf-outline'} size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.flex}>
          <Text style={styles.simpleHeaderTitle}>{title}</Text>
          <Text style={styles.simpleHeaderSubtitle}>{subtitle}</Text>
        </View>

        <View style={styles.profileCircle}>
          <Ionicons name="person" size={18} color={C.green} />
        </View>
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
      <TabItem label="Home" icon="home-outline" active={active === 'home'} onPress={() => onNavigate('home')} />
      <TabItem label="Reports" icon="document-text-outline" active={active === 'reports'} onPress={() => onNavigate('my-reports')} />
      <TabItem label="Alerts" icon="notifications-outline" active={active === 'alerts'} showBadge onPress={() => onNavigate('alerts')} />
      <TabItem label="Map" icon="map-outline" active={active === 'map'} onPress={() => onNavigate('map')} />
      <TabItem label="Profile" icon="person-outline" active={active === 'profile'} onPress={() => onNavigate('profile')} />
    </View>
  );
}

function TabItem({
  label,
  icon,
  active,
  showBadge,
  onPress
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  showBadge?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.tabItem} onPress={onPress}>
      <View style={[styles.tabIconWrap, active && styles.tabIconWrapActive]}>
        <Ionicons name={icon} size={22} color={active ? C.green : '#7B8794'} />
        {showBadge ? (
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>3</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.sectionCard}>{children}</View>;
}

function SectionHead({
  title,
  subtitle,
  action,
  onAction
}: {
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHead}>
      <View style={styles.flex}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>

      {action ? (
        <TouchableOpacity activeOpacity={0.85} style={styles.linkButton} onPress={onAction}>
          <Text style={styles.linkText}>{action}</Text>
          <Ionicons name="chevron-forward" size={16} color={C.green} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function ActionRow({
  title,
  subtitle,
  icon,
  color,
  bg,
  onPress
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.88} style={styles.actionRow} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>

      <View style={styles.flex}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );
}

function CategoryChip({
  title,
  icon,
  color,
  bg,
  onPress
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.86} style={styles.categoryChip} onPress={onPress}>
      <View style={[styles.categoryIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.categoryText}>{title}</Text>
    </TouchableOpacity>
  );
}

function MetricBox({
  value,
  label,
  icon,
  color,
  bg
}: {
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}) {
  return (
    <View style={styles.metricBox}>
      <View style={[styles.metricIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function MiniAlert({
  title,
  meta,
  color,
  icon
}: {
  title: string;
  meta: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.miniAlert}>
      <View style={[styles.miniAlertIcon, { backgroundColor: `${color}14` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.miniAlertTitle}>{title}</Text>
        <Text style={styles.miniAlertMeta}>{meta}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </View>
  );
}

function ReportStat({
  value,
  label,
  icon,
  color,
  bg
}: {
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}) {
  return (
    <View style={styles.reportStat}>
      <View style={[styles.metricIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.reportStatValue}>{value}</Text>
      <Text style={styles.reportStatLabel}>{label}</Text>
    </View>
  );
}

function StatusBadge({ label }: { label: string }) {
  const color = getStatusColor(label);

  return (
    <View style={[styles.statusBadge, { backgroundColor: `${color}14` }]}>
      <Text style={[styles.statusBadgeText, { color }]}>{label}</Text>
    </View>
  );
}

function FormLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text style={styles.formLabel}>
      {label} {required ? <Text style={styles.required}>*</Text> : null}
    </Text>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="document-text-outline" size={26} color="#94A3B8" />
      </View>
      <Text style={styles.emptyTitle}>No record yet</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function InfoBlock({
  icon,
  title,
  text
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.infoBlock}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={21} color={C.green} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoText}>{text}</Text>
      </View>
    </View>
  );
}

function ZoneItem({ title, status, color }: { title: string; status: string; color: string }) {
  return (
    <View style={styles.zoneItem}>
      <Ionicons name="shield-outline" size={24} color={color} />
      <View style={styles.flex}>
        <Text style={styles.zoneTitle}>{title}</Text>
        <Text style={styles.zoneStatus}>{status}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg
  },
  flex: {
    flex: 1
  },
  homeHeader: {
    backgroundColor: C.green,
    paddingTop: STATUS_BAR_HEIGHT + 14,
    paddingHorizontal: 18,
    paddingBottom: 28
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  brandRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: C.gold,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  brandTextWrap: {
    flex: 1
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 1,
    lineHeight: 18
  },
  brandSubtitle: {
    color: C.gold,
    fontSize: 9.8,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 4
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8
  },
  headerCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  profileCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeBubble: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  badgeBubbleText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900'
  },
  heroArea: {
    marginTop: 26
  },
  statusPillDark: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 8
  },
  statusPillTextDark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900'
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 35,
    marginTop: 17,
    letterSpacing: -0.4
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10
  },
  simpleHeader: {
    backgroundColor: C.green,
    paddingTop: STATUS_BAR_HEIGHT + 14,
    paddingHorizontal: 18,
    paddingBottom: 20
  },
  simpleHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  simpleHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900'
  },
  simpleHeaderSubtitle: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 13,
    marginTop: 4
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30
  },
  sectionCard: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: C.line,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.055,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: 16
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  sectionTitle: {
    color: C.text,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.2
  },
  sectionSubtitle: {
    color: C.muted,
    fontSize: 12.8,
    lineHeight: 18,
    marginTop: 4
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 2
  },
  linkText: {
    color: C.green,
    fontSize: 12.5,
    fontWeight: '900'
  },
  emergencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F2D7D7',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: C.red,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 5
  },
  emergencyIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13
  },
  priorityLabel: {
    color: C.red,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6
  },
  emergencyTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3
  },
  emergencyText: {
    color: C.muted,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 4
  },
  redArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  actionStack: {
    gap: 12
  },
  actionRow: {
    minHeight: 78,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13
  },
  actionTitle: {
    color: C.text,
    fontSize: 15.5,
    fontWeight: '900'
  },
  actionSubtitle: {
    color: C.muted,
    fontSize: 12.5,
    marginTop: 3
  },
  categoryScroll: {
    paddingRight: 8
  },
  categoryChip: {
    width: 112,
    minHeight: 118,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
    padding: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryIcon: {
    width: 47,
    height: 47,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  categoryText: {
    color: C.text,
    fontSize: 12.5,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 16
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  metricBox: {
    width: '31.5%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
    paddingVertical: 13,
    alignItems: 'center'
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  metricValue: {
    color: C.text,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 7
  },
  metricLabel: {
    color: C.muted,
    fontSize: 11,
    marginTop: 2
  },
  alertList: {
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7'
  },
  miniAlert: {
    minHeight: 72,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11
  },
  miniAlertIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11
  },
  miniAlertTitle: {
    color: C.text,
    fontSize: 13.5,
    fontWeight: '900'
  },
  miniAlertMeta: {
    color: C.muted,
    fontSize: 12,
    marginTop: 4
  },
  lostFoundBanner: {
    backgroundColor: C.green,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 4
  },
  lostFoundIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13
  },
  lostFoundTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  lostFoundText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 4
  },
  whitePill: {
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginLeft: 10
  },
  whitePillText: {
    color: C.green,
    fontSize: 12,
    fontWeight: '900'
  },
  recentRow: {
    minHeight: 70,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  recentIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: C.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  recentId: {
    color: C.text,
    fontSize: 13.5,
    fontWeight: '900'
  },
  recentMeta: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3
  },
  noticeCard: {
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2
  },
  noticeIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: C.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  noticeTitle: {
    color: C.green,
    fontSize: 14,
    fontWeight: '900'
  },
  noticeText: {
    color: C.muted,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 4
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  typeTile: {
    width: '31.5%',
    minHeight: 98,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    padding: 8
  },
  typeTileActive: {
    borderColor: C.green,
    borderWidth: 2,
    backgroundColor: '#F8FCFA'
  },
  typeIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  typeTileText: {
    color: C.text,
    fontSize: 11.5,
    fontWeight: '900',
    textAlign: 'center'
  },
  formLabel: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 12,
    marginBottom: 8
  },
  required: {
    color: C.red
  },
  input: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
    paddingHorizontal: 14,
    color: C.text,
    fontSize: 14
  },
  textArea: {
    minHeight: 124,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
    paddingHorizontal: 14,
    paddingTop: 14,
    color: C.text,
    fontSize: 14
  },
  severityGrid: {
    gap: 10
  },
  severityCard: {
    minHeight: 58,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13
  },
  severityDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    marginRight: 10
  },
  severityTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900'
  },
  severityNote: {
    color: C.muted,
    fontSize: 12,
    marginTop: 2
  },
  primaryButton: {
    marginTop: 18,
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: C.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '900'
  },
  secondaryButton: {
    marginTop: 12,
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryButtonText: {
    color: C.green,
    fontSize: 15,
    fontWeight: '900'
  },
  zoneRow: {
    gap: 8,
    paddingBottom: 4
  },
  zoneChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  zoneChipActive: {
    backgroundColor: C.green,
    borderColor: C.green
  },
  zoneChipText: {
    color: C.muted,
    fontSize: 12,
    fontWeight: '900'
  },
  zoneChipTextActive: {
    color: '#FFFFFF'
  },
  mapPreviewCard: {
    borderRadius: 20,
    backgroundColor: C.greenSoft,
    borderWidth: 1,
    borderColor: '#D9EFE2',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8
  },
  mapPin: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  mapPreviewTitle: {
    color: C.green,
    fontSize: 15,
    fontWeight: '900'
  },
  mapPreviewText: {
    color: C.muted,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 3
  },
  inputWithIcon: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputFlex: {
    flex: 1,
    marginLeft: 8,
    color: C.text,
    fontSize: 14
  },
  switchRow: {
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 11,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkBoxActive: {
    backgroundColor: C.green,
    borderColor: C.green
  },
  switchTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900'
  },
  switchText: {
    color: C.muted,
    fontSize: 12,
    marginTop: 2
  },
  uploadCard: {
    minHeight: 78,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#B7C4BB',
    backgroundColor: '#FAFBFC',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: C.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  uploadTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900'
  },
  uploadText: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4
  },
  noticeCardSoft: {
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 14
  },
  noticeSoftText: {
    flex: 1,
    color: C.muted,
    fontSize: 12.5,
    lineHeight: 18
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 6,
    borderRadius: 18,
    marginBottom: 16
  },
  modeTab: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modeTabActive: {
    backgroundColor: C.green
  },
  modeTabText: {
    color: C.green,
    fontSize: 13,
    fontWeight: '900'
  },
  modeTabTextActive: {
    color: '#FFFFFF'
  },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 18
  },
  successTitle: {
    color: C.text,
    fontSize: 23,
    fontWeight: '900',
    textAlign: 'center'
  },
  successText: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8
  },
  successPage: {
    padding: 18,
    justifyContent: 'center',
    flexGrow: 1
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: C.line,
    marginTop: 20,
    marginBottom: 8
  },
  successIncidentId: {
    color: C.green,
    fontSize: 14,
    fontWeight: '900'
  },
  successIncidentTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 5
  },
  successIncidentMeta: {
    color: C.muted,
    fontSize: 13,
    marginTop: 4
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  reportStat: {
    width: '31.5%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: C.line,
    paddingVertical: 14,
    alignItems: 'center'
  },
  reportStatValue: {
    color: C.text,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8
  },
  reportStatLabel: {
    color: C.muted,
    fontSize: 12,
    marginTop: 2
  },
  reportRow: {
    minHeight: 82,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  reportTitle: {
    color: C.text,
    fontSize: 14.5,
    fontWeight: '900'
  },
  reportMeta: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3
  },
  reportDate: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 3
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginRight: 8
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '900'
  },
  searchBox: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: C.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 10
  },
  searchPlaceholder: {
    flex: 1,
    color: '#94A3B8',
    fontSize: 13
  },
  alertFullRow: {
    minHeight: 80,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12
  },
  alertFullIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  alertFullTitle: {
    color: C.text,
    fontSize: 14.5,
    fontWeight: '900'
  },
  alertFullMeta: {
    color: C.muted,
    fontSize: 12,
    marginTop: 4
  },
  smallBadge: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginRight: 8
  },
  smallBadgeText: {
    fontSize: 10,
    fontWeight: '900'
  },
  detailTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  detailTitle: {
    color: C.text,
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 27
  },
  detailMeta: {
    color: C.muted,
    fontSize: 13,
    marginTop: 5
  },
  severityBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 10
  },
  severityBadgeText: {
    fontSize: 11,
    fontWeight: '900'
  },
  statusPanel: {
    borderRadius: 20,
    backgroundColor: '#FAFBFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 14
  },
  statusTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 12
  },
  statusLine: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statusStep: {
    flex: 1,
    alignItems: 'center'
  },
  statusCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusCircleActive: {
    backgroundColor: C.green
  },
  statusStepText: {
    color: C.muted,
    fontSize: 10.5,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '800'
  },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7',
    paddingVertical: 13
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: C.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  infoTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900'
  },
  infoText: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3
  },
  timelineTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 8,
    marginBottom: 8
  },
  timelineRow: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.green,
    marginTop: 4,
    marginRight: 12
  },
  timelineItemTitle: {
    color: C.text,
    fontSize: 13.5,
    fontWeight: '900'
  },
  timelineItemText: {
    color: C.muted,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 3
  },
  timelineItemTime: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 3
  },
  bigMap: {
    height: 360,
    borderRadius: 22,
    backgroundColor: '#EAF7EF',
    borderWidth: 1,
    borderColor: '#D9EFE2',
    overflow: 'hidden',
    marginBottom: 16
  },
  mapZoneOne: {
    position: 'absolute',
    top: 38,
    left: 28,
    width: 185,
    height: 135,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: C.orange,
    backgroundColor: 'rgba(245,158,11,0.10)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapZoneTwo: {
    position: 'absolute',
    top: 70,
    right: 26,
    width: 185,
    height: 135,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: C.red,
    backgroundColor: 'rgba(220,38,38,0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapZoneThree: {
    position: 'absolute',
    bottom: 38,
    left: 76,
    width: 215,
    height: 140,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: C.green,
    backgroundColor: 'rgba(15,61,42,0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapZoneText: {
    color: C.green,
    fontSize: 12,
    fontWeight: '900'
  },
  mapAlertPin: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapClearPin: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center'
  },
  zoneList: {
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7'
  },
  zoneItem: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
    gap: 12
  },
  zoneTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900'
  },
  zoneStatus: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3
  },
  placeholderBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26
  },
  placeholderIcon: {
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor: C.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18
  },
  placeholderTitle: {
    color: C.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center'
  },
  placeholderText: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20
  },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyTitle: {
    color: C.text,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 10
  },
  emptyText: {
    color: C.muted,
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 4
  },
  tabBar: {
    minHeight: 76,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  tabItem: {
    flex: 1,
    alignItems: 'center'
  },
  tabIconWrap: {
    width: 36,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 3
  },
  tabIconWrapActive: {
    borderRadius: 999,
    backgroundColor: C.greenSoft
  },
  tabBadge: {
    position: 'absolute',
    top: -7,
    right: -7,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900'
  },
  tabLabel: {
    color: '#7B8794',
    fontSize: 11,
    fontWeight: '700'
  },
  tabLabelActive: {
    color: C.green,
    fontWeight: '900'
  }
});