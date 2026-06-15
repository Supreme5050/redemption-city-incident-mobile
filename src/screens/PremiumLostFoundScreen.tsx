import React, { useState } from 'react';
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
import { ScreenName } from '../types/navigation';
import { LostFoundDraft, LostFoundMode, LostFoundRecord } from '../types/lostFound';

interface LostFoundScreenProps {
  onNavigate: (screen: ScreenName) => void;
  onSubmitLostFound: (draft: LostFoundDraft) => Promise<LostFoundRecord>;
}

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 28 : 0;
const HEADER_SAFE_TOP = Platform.OS === 'android' ? STATUS_BAR_HEIGHT + 26 : 22;

const C = {
  green: '#063D28',
  greenDeep: '#042B1D',
  greenSoft: '#EAF7EF',
  gold: '#D6B45B',
  bg: '#EEF4F0',
  card: '#FFFFFF',
  text: '#101828',
  muted: '#667085',
  line: '#DDE7E1',
  red: '#E53935',
  purple: '#8B5CF6',
  purpleSoft: '#F4EEFF',
  blue: '#2563EB',
  orange: '#F59E0B'
};

const itemCategories = [
  'Phone',
  'Bag',
  'Wallet',
  'ID Card',
  'Keys',
  'Bible / Book',
  'Clothing',
  'Electronics',
  'Other'
];

const zones = [
  'Main Auditorium Area',
  'Diligence Road',
  'Chalet Area',
  'Clinic Area',
  'Market Area',
  'Camp Road',
  'Youth Centre'
];

export function LostFoundScreen({ onNavigate, onSubmitLostFound }: LostFoundScreenProps) {
  const [mode, setMode] = useState<LostFoundMode>('Lost Item');
  const [category, setCategory] = useState('Phone');
  const [zone, setZone] = useState('Main Auditorium Area');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [photoLabel, setPhotoLabel] = useState<string | undefined>();
  const [submittedRecord, setSubmittedRecord] = useState<LostFoundRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    if (!itemName.trim()) {
      Alert.alert('Item name required', 'Please enter the name of the lost or found item.');
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      Alert.alert('Description required', 'Please describe the item clearly so admin can verify it.');
      return;
    }

    if (!contact.trim()) {
      Alert.alert('Contact required', 'Please enter a phone number or email for admin follow-up.');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const record = await onSubmitLostFound({
        mode,
        itemName,
        category,
        zone,
        description,
        contact,
        photoLabel
      });

      setSubmittedRecord(record);
    } catch {
      Alert.alert('Submission failed', 'The Lost & Found record could not be saved. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={C.greenDeep} barStyle="light-content" translucent={false} />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity activeOpacity={0.85} style={styles.headerButton} onPress={() => onNavigate('home')}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Lost & Found</Text>
            <Text style={styles.headerSubtitle}>Admin review and safe handover</Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.profileCircle} onPress={() => onNavigate('profile')}>
            <Ionicons name="person" size={18} color={C.green} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerInfoCard}>
          <View style={styles.headerInfoIcon}>
            <Ionicons name="shield-checkmark-outline" size={20} color={C.gold} />
          </View>

          <View style={styles.flex}>
            <Text style={styles.headerInfoTitle}>Claims are verified first</Text>
            <Text style={styles.headerInfoText}>Admin confirms ownership before any item is released.</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {submittedRecord ? (
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={36} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>Submitted for admin review</Text>
            <Text style={styles.successText}>
              Your Lost & Found record has been saved. Tracking ID: {submittedRecord.id}
            </Text>

            <View style={styles.successInfo}>
              <Text style={styles.successInfoLabel}>Item</Text>
              <Text style={styles.successInfoValue}>{submittedRecord.itemName}</Text>

              <Text style={styles.successInfoLabel}>Status</Text>
              <Text style={styles.successInfoValue}>{submittedRecord.status}</Text>
            </View>

            <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={() => onNavigate('my-reports')}>
              <Text style={styles.primaryButtonText}>Track in My Reports</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.9} style={styles.lightButton} onPress={() => onNavigate('home')}>
              <Text style={styles.lightButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formCard}>
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

            <Text style={styles.sectionTitle}>{mode} Details</Text>
            <Text style={styles.sectionSubtitle}>Give admin enough information to match and verify ownership.</Text>

            <FormLabel label="Item Name" required />
            <TextInput
              value={itemName}
              onChangeText={setItemName}
              placeholder="Example: Black Samsung phone, brown wallet, ID card"
              placeholderTextColor="#98A2B3"
              style={styles.input}
            />

            <FormLabel label="Category" required />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {itemCategories.map((item) => {
                const active = category === item;

                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.85}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setCategory(item)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <FormLabel label={mode === 'Lost Item' ? 'Last Seen Location' : 'Found Location'} required />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {zones.map((item) => {
                const active = zone === item;

                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.85}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setZone(item)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.locationCard}>
              <View style={styles.locationIcon}>
                <Ionicons name="location" size={30} color={C.green} />
              </View>

              <View style={styles.flex}>
                <Text style={styles.locationTitle}>{zone}</Text>
                <Text style={styles.locationText}>Admin will use this location to compare related records.</Text>
              </View>
            </View>

            <FormLabel label="Description" required />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe color, brand, content, special mark, or exact place it was found..."
              placeholderTextColor="#98A2B3"
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
                placeholderTextColor="#98A2B3"
                style={styles.inputFlex}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.uploadCard, photoLabel && styles.uploadCardActive]}
              onPress={() => setPhotoLabel('Demo item photo attached')}
            >
              <View style={styles.uploadIcon}>
                <Ionicons name={photoLabel ? 'checkmark-circle-outline' : 'camera-outline'} size={24} color={C.green} />
              </View>

              <View style={styles.flex}>
                <Text style={styles.uploadTitle}>{photoLabel ? 'Demo photo attached' : 'Add item photo'}</Text>
                <Text style={styles.uploadText}>
                  {photoLabel
                    ? 'This demo attachment will appear on the saved record.'
                    : 'Tap to attach a demo photo placeholder for MVP testing.'}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#98A2B3" />
            </TouchableOpacity>

            <View style={styles.noticeCard}>
              <Ionicons name="lock-closed-outline" size={21} color={C.green} />
              <Text style={styles.noticeText}>
                Contact details are not public. Admin controls claim verification and handover.
              </Text>
            </View>

            <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={submit}>
              <Text style={styles.primaryButtonText}>{isSubmitting ? 'Saving...' : 'Submit to Admin Review'}</Text>
              <Ionicons name="paper-plane-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <BottomTabs active="reports" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function FormLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text style={styles.formLabel}>
      {label} {required ? <Text style={styles.required}>*</Text> : null}
    </Text>
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
      <View style={[styles.tabIconWrap, active && styles.tabIconActive]}>
        <Ionicons name={icon} size={22} color={active ? C.green : '#98A2B3'} />
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1 },
  header: {
    backgroundColor: C.green,
    paddingTop: HEADER_SAFE_TOP,
    paddingHorizontal: 18,
    paddingBottom: 22,
    minHeight: HEADER_SAFE_TOP + 122
  },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  headerTextWrap: { flex: 1 },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  headerSubtitle: { color: 'rgba(255,255,255,0.78)', fontSize: 13, marginTop: 4 },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerInfoCard: {
    marginTop: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerInfoIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  headerInfoTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  headerInfoText: { color: 'rgba(255,255,255,0.76)', fontSize: 12, lineHeight: 17, marginTop: 2 },
  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 28 },
  formCard: {
    backgroundColor: C.card,
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: C.line,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 6,
    borderRadius: 20,
    marginBottom: 22
  },
  modeTab: { flex: 1, minHeight: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  modeTabActive: {
    backgroundColor: C.green,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 2
  },
  modeTabText: { color: C.green, fontSize: 13, fontWeight: '900' },
  modeTabTextActive: { color: '#FFFFFF' },
  sectionTitle: { color: C.text, fontSize: 22, fontWeight: '900' },
  sectionSubtitle: { color: C.muted, fontSize: 13, lineHeight: 19, marginTop: 6, marginBottom: 18 },
  formLabel: { color: C.text, fontSize: 14, fontWeight: '900', marginTop: 14, marginBottom: 8 },
  required: { color: C.red },
  input: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#FAFBFC',
    paddingHorizontal: 15,
    color: C.text,
    fontSize: 14
  },
  inputWithIcon: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#FAFBFC',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputFlex: { flex: 1, color: C.text, fontSize: 14, marginLeft: 8 },
  textArea: {
    minHeight: 128,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#FAFBFC',
    paddingHorizontal: 15,
    paddingTop: 14,
    color: C.text,
    fontSize: 14
  },
  chipRow: { gap: 8, paddingRight: 14 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  chipActive: { backgroundColor: C.green, borderColor: C.green },
  chipText: { color: C.muted, fontSize: 12, fontWeight: '900' },
  chipTextActive: { color: '#FFFFFF' },
  locationCard: {
    marginTop: 16,
    borderRadius: 22,
    backgroundColor: C.greenSoft,
    borderWidth: 1,
    borderColor: '#D5EDE0',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  locationIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13
  },
  locationTitle: { color: C.green, fontSize: 16, fontWeight: '900' },
  locationText: { color: C.muted, fontSize: 12.5, lineHeight: 18, marginTop: 4 },
  uploadCard: {
    minHeight: 80,
    borderRadius: 22,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#B7C4BB',
    backgroundColor: '#FAFBFC',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18
  },
  uploadCardActive: {
    borderStyle: 'solid',
    borderColor: C.green,
    backgroundColor: '#F7FCFA'
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
  uploadTitle: { color: C.text, fontSize: 14, fontWeight: '900' },
  uploadText: { color: C.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  noticeCard: {
    marginTop: 18,
    borderRadius: 20,
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: '#DDE9E1',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  noticeText: { flex: 1, color: C.muted, fontSize: 12, lineHeight: 18 },
  primaryButton: {
    marginTop: 20,
    minHeight: 58,
    borderRadius: 20,
    backgroundColor: C.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
    gap: 8
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15.5, fontWeight: '900' },
  lightButton: {
    marginTop: 12,
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: C.greenSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  lightButtonText: { color: C.green, fontSize: 14, fontWeight: '900' },
  successCard: {
    backgroundColor: C.card,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4
  },
  successIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18
  },
  successTitle: { color: C.text, fontSize: 22, fontWeight: '900', textAlign: 'center' },
  successText: { color: C.muted, fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 8 },
  successInfo: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: C.line,
    padding: 14,
    marginTop: 18
  },
  successInfoLabel: { color: C.muted, fontSize: 11, fontWeight: '800', marginTop: 4 },
  successInfoValue: { color: C.text, fontSize: 14, fontWeight: '900', marginTop: 3, marginBottom: 8 },
  tabBar: {
    minHeight: 74,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: C.line,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabIconWrap: { width: 36, height: 30, alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 3 },
  tabIconActive: { borderRadius: 999, backgroundColor: C.greenSoft },
  tabBadge: {
    position: 'absolute',
    top: -7,
    right: -7,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900' },
  tabLabel: { color: '#98A2B3', fontSize: 10.5, fontWeight: '700' },
  tabLabelActive: { color: C.green, fontWeight: '900' }
});