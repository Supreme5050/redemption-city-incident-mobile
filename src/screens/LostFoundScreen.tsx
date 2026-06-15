import React, { useState } from 'react';
import {
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

interface LostFoundScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type LostFoundMode = 'Lost Item' | 'Found Item';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

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

export function LostFoundScreen({ onNavigate }: LostFoundScreenProps) {
  const [mode, setMode] = useState<LostFoundMode>('Lost Item');
  const [category, setCategory] = useState('Phone');
  const [zone, setZone] = useState('Main Auditorium Area');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#123F2B" barStyle="light-content" translucent={false} />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity activeOpacity={0.85} style={styles.backButton} onPress={() => onNavigate('home')}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.brandWrap}>
            <Text style={styles.brandTitle}>LOST & FOUND</Text>
            <Text style={styles.brandSubtitle}>ADMIN REVIEW REQUIRED</Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.headerIconButton} onPress={() => onNavigate('alerts')}>
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroBlock}>
          <View style={styles.statusPill}>
            <Ionicons name="shield-checkmark-outline" size={15} color="#FFFFFF" />
            <Text style={styles.statusText}>Claims are verified before handover</Text>
          </View>

          <Text style={styles.heroTitle}>Report lost or found property safely.</Text>
          <Text style={styles.heroSubtitle}>
            Admin will review the record, compare possible matches, and verify ownership before release.
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {submitted ? (
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={34} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>Submitted for admin review</Text>
            <Text style={styles.successText}>
              Your Lost & Found record has been received. Admin will review and manage any possible match safely.
            </Text>

            <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={() => onNavigate('home')}>
              <Text style={styles.primaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.modeCard}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.modeButton, mode === 'Lost Item' && styles.modeButtonActive]}
                onPress={() => setMode('Lost Item')}
              >
                <Ionicons
                  name="search-outline"
                  size={21}
                  color={mode === 'Lost Item' ? '#FFFFFF' : '#123F2B'}
                />
                <Text style={[styles.modeText, mode === 'Lost Item' && styles.modeTextActive]}>I Lost an Item</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.modeButton, mode === 'Found Item' && styles.modeButtonActive]}
                onPress={() => setMode('Found Item')}
              >
                <Ionicons
                  name="file-tray-full-outline"
                  size={21}
                  color={mode === 'Found Item' ? '#FFFFFF' : '#123F2B'}
                />
                <Text style={[styles.modeText, mode === 'Found Item' && styles.modeTextActive]}>I Found an Item</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{mode} Details</Text>
                <Text style={styles.sectionSubtitle}>
                  Provide enough details for admin to review and match properly.
                </Text>
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>
                  Item Name <Text style={styles.required}>*</Text>
                </Text>

                <TextInput
                  value={itemName}
                  onChangeText={setItemName}
                  placeholder="Example: Black Samsung phone, brown wallet, ID card"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>
                  Category <Text style={styles.required}>*</Text>
                </Text>

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
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>
                  {mode === 'Lost Item' ? 'Last Seen Location' : 'Found Location'}{' '}
                  <Text style={styles.required}>*</Text>
                </Text>

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
              </View>

              <View style={styles.mapCard}>
                <View style={styles.mapIcon}>
                  <Ionicons name="location" size={30} color="#123F2B" />
                </View>

                <View style={styles.mapTextWrap}>
                  <Text style={styles.mapTitle}>{zone}</Text>
                  <Text style={styles.mapText}>
                    Location helps admin compare related lost and found records.
                  </Text>
                </View>
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>
                  Description <Text style={styles.required}>*</Text>
                </Text>

                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe color, brand, content, special marks, or where it was found..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  textAlignVertical="top"
                  style={styles.textArea}
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>
                  Contact for Admin Follow-up <Text style={styles.required}>*</Text>
                </Text>

                <View style={styles.inputWithIcon}>
                  <Ionicons name="call-outline" size={18} color="#64748B" />
                  <TextInput
                    value={contact}
                    onChangeText={setContact}
                    placeholder="Phone number or email"
                    placeholderTextColor="#94A3B8"
                    style={styles.inputFlex}
                  />
                </View>
              </View>

              <View style={styles.uploadCard}>
                <View style={styles.uploadIcon}>
                  <Ionicons name="camera-outline" size={24} color="#123F2B" />
                </View>

                <View style={styles.uploadTextWrap}>
                  <Text style={styles.uploadTitle}>Add item photo</Text>
                  <Text style={styles.uploadText}>Photo upload will be connected later for stronger verification.</Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#64748B" />
              </View>

              <View style={styles.noticeCard}>
                <Ionicons name="lock-closed-outline" size={22} color="#123F2B" />
                <Text style={styles.noticeText}>
                  Contact details are not shown publicly. Admin controls claim verification and handover.
                </Text>
              </View>

              <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={() => setSubmitted(true)}>
                <Ionicons name="paper-plane-outline" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Submit to Admin Review</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <BottomTabs active="home" onNavigate={onNavigate} />
    </SafeAreaView>
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
      <View style={styles.tabIconWrap}>
        <Ionicons name={icon} size={23} color={active ? '#123F2B' : '#7B8794'} />
        {showBadge ? (
          <View style={styles.tabIconBadge}>
            <Text style={styles.tabIconBadgeText}>3</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F6F4'
  },
  header: {
    backgroundColor: '#123F2B',
    paddingTop: STATUS_BAR_HEIGHT + 16,
    paddingHorizontal: 18,
    paddingBottom: 22
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  brandWrap: {
    flex: 1
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1
  },
  brandSubtitle: {
    marginTop: 4,
    color: '#D4AF5A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1
  },
  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroBlock: {
    marginTop: 22
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 7
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  heroTitle: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 32
  },
  heroSubtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.78)',
    fontSize: 14,
    lineHeight: 21
  },
  content: {
    padding: 16,
    paddingBottom: 28
  },
  modeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E4EAE6',
    marginBottom: 16
  },
  modeButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8
  },
  modeButtonActive: {
    backgroundColor: '#123F2B'
  },
  modeText: {
    color: '#123F2B',
    fontSize: 13,
    fontWeight: '900'
  },
  modeTextActive: {
    color: '#FFFFFF'
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4EAE6'
  },
  sectionHeader: {
    marginBottom: 18
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '900'
  },
  sectionSubtitle: {
    marginTop: 5,
    color: '#64748B',
    fontSize: 13,
    lineHeight: 19
  },
  fieldBlock: {
    marginBottom: 18
  },
  label: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8
  },
  required: {
    color: '#DC2626'
  },
  input: {
    minHeight: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
    paddingHorizontal: 14,
    color: '#0F172A',
    fontSize: 14
  },
  inputWithIcon: {
    minHeight: 52,
    borderRadius: 15,
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
    color: '#0F172A',
    fontSize: 14
  },
  textArea: {
    minHeight: 120,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
    paddingHorizontal: 14,
    paddingTop: 14,
    color: '#0F172A',
    fontSize: 14
  },
  chipRow: {
    gap: 8
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  chipActive: {
    backgroundColor: '#123F2B',
    borderColor: '#123F2B'
  },
  chipText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800'
  },
  chipTextActive: {
    color: '#FFFFFF'
  },
  mapCard: {
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#D9EFE2',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18
  },
  mapIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  mapTextWrap: {
    flex: 1
  },
  mapTitle: {
    color: '#123F2B',
    fontSize: 15,
    fontWeight: '900'
  },
  mapText: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 12.5,
    lineHeight: 18
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
    marginBottom: 18
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  uploadTextWrap: {
    flex: 1
  },
  uploadTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900'
  },
  uploadText: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 12,
    lineHeight: 17
  },
  noticeCard: {
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 18
  },
  noticeText: {
    flex: 1,
    color: '#64748B',
    fontSize: 12.5,
    lineHeight: 18
  },
  primaryButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: '#123F2B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 8
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E4EAE6',
    alignItems: 'center'
  },
  successIcon: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#123F2B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18
  },
  successTitle: {
    color: '#0F172A',
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center'
  },
  successText: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 22
  },
  tabBar: {
    minHeight: 74,
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
    position: 'relative',
    marginBottom: 4
  },
  tabIconBadge: {
    position: 'absolute',
    top: -7,
    right: -10,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  tabIconBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900'
  },
  tabLabel: {
    color: '#7B8794',
    fontSize: 11,
    fontWeight: '600'
  },
  tabLabelActive: {
    color: '#123F2B',
    fontWeight: '900'
  }
});