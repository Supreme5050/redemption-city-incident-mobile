import React, { useMemo } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DraftIncident, Incident, IncidentSeverity, IncidentType } from '../types/incident';
import { ScreenName } from '../types/navigation';

interface HomeScreenProps {
  incidents: Incident[];
  onNavigate: (screen: ScreenName) => void;
  onStartReport: (options?: Partial<DraftIncident>) => void;
  onOpenIncident: (incident: Incident) => void;
}

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

export function HomeScreen({ incidents, onNavigate, onStartReport, onOpenIncident }: HomeScreenProps) {
  const recentReports = useMemo(() => incidents.slice(0, 3), [incidents]);

  function startQuickReport(type: IncidentType, severity: IncidentSeverity, title: string) {
    onStartReport({
      type,
      severity,
      title,
      description: '',
      location: 'Main Auditorium Area',
      address: 'Main Auditorium Area, Redemption City Camp'
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#123F2B" barStyle="light-content" translucent={false} />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.brandRow}>
            <View style={styles.logoBox}>
              <Ionicons name="leaf-outline" size={24} color="#FFFFFF" />
            </View>

            <View style={styles.brandTextWrap}>
              <Text style={styles.brandTitle}>REDEMPTION CITY CAMP</Text>
              <Text style={styles.brandSubtitle}>SAFETY & INCIDENT MANAGEMENT</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity activeOpacity={0.85} style={styles.headerIconButton} onPress={() => onNavigate('alerts')}>
              <Ionicons name="notifications-outline" size={23} color="#FFFFFF" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} style={styles.avatar} onPress={() => onNavigate('profile')}>
              <Ionicons name="person" size={18} color="#123F2B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroBlock}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusPillText}>Admin Control Desk Online</Text>
          </View>

          <Text style={styles.heroTitle}>Report, track, and escalate camp issues safely.</Text>
          <Text style={styles.heroSubtitle}>
            Every report goes to admin control first, then gets routed to the appropriate verified unit.
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.commandCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <Text style={styles.sectionSubtitle}>Choose what you want to report or track.</Text>
            </View>
            <TouchableOpacity activeOpacity={0.85} onPress={() => onNavigate('my-reports')}>
              <Text style={styles.sectionLink}>My Reports</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.primaryGrid}>
            <PrimaryActionCard
              title="Emergency"
              subtitle="Urgent threat or danger"
              icon="warning-outline"
              color="#DC2626"
              bg="#FEF2F2"
              onPress={() => startQuickReport('Medical / First Aid', 'Critical', 'Emergency assistance needed')}
            />

            <PrimaryActionCard
              title="Report Incident"
              subtitle="General issue report"
              icon="document-text-outline"
              color="#123F2B"
              bg="#ECFDF5"
              onPress={() => onStartReport()}
            />

            <PrimaryActionCard
              title="Lost & Found"
              subtitle="Lost or found property"
              icon="file-tray-full-outline"
              color="#7C3AED"
              bg="#F5F3FF"
              onPress={() => onNavigate('lost-found')}
            />

            <PrimaryActionCard
              title="Track Reports"
              subtitle="Follow submitted cases"
              icon="analytics-outline"
              color="#2563EB"
              bg="#EFF6FF"
              onPress={() => onNavigate('my-reports')}
            />
          </View>
        </View>

        <View style={styles.categoryCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Incident Categories</Text>
              <Text style={styles.sectionSubtitle}>Fast reporting for common camp issues.</Text>
            </View>
          </View>

          <View style={styles.categoryGrid}>
            <CategoryTile
              title="Fire / Smoke"
              icon="flame-outline"
              color="#E11D48"
              bg="#FFF1F2"
              onPress={() => startQuickReport('Fire / Smoke', 'Critical', 'Fire or smoke alert')}
            />

            <CategoryTile
              title="Theft / Security"
              icon="shield-checkmark-outline"
              color="#2563EB"
              bg="#EFF6FF"
              onPress={() => startQuickReport('Theft / Security Issue', 'High', 'Security concern reported')}
            />

            <CategoryTile
              title="Fight / Misconduct"
              icon="hand-left-outline"
              color="#DC2626"
              bg="#FEF2F2"
              onPress={() => startQuickReport('Fight / Misconduct', 'High', 'Misconduct report')}
            />

            <CategoryTile
              title="Medical"
              icon="medkit-outline"
              color="#15803D"
              bg="#F0FDF4"
              onPress={() => startQuickReport('Medical / First Aid', 'High', 'Medical assistance needed')}
            />

            <CategoryTile
              title="Power Issue"
              icon="flash-outline"
              color="#F59E0B"
              bg="#FFF7E6"
              onPress={() => startQuickReport('Electricity / Power Issue', 'Medium', 'Power issue reported')}
            />

            <CategoryTile
              title="Traffic / Road"
              icon="car-outline"
              color="#EA580C"
              bg="#FFF7ED"
              onPress={() => startQuickReport('Traffic / Road Obstruction', 'Medium', 'Traffic or road obstruction')}
            />

            <CategoryTile
              title="Facility Fault"
              icon="business-outline"
              color="#0F766E"
              bg="#F0FDFA"
              onPress={() => startQuickReport('Facility / Maintenance Fault', 'Medium', 'Facility fault reported')}
            />

            <CategoryTile
              title="Other Issue"
              icon="ellipsis-horizontal-circle-outline"
              color="#475569"
              bg="#F8FAFC"
              onPress={() => startQuickReport('Other', 'Medium', 'Other issue reported')}
            />
          </View>
        </View>

        <View style={styles.livePanel}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Live Camp Situation</Text>
              <Text style={styles.sectionSubtitle}>Overview of active reports and alerts.</Text>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={() => onNavigate('alerts')}>
              <Text style={styles.sectionLink}>View alerts</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricsRow}>
            <MetricBox value="8" label="Active Alerts" icon="pulse-outline" color="#DC2626" bg="#FEF2F2" />
            <MetricBox value="3" label="Critical" icon="alert-circle-outline" color="#DC2626" bg="#FEF2F2" />
            <MetricBox value="12" label="Resolved" icon="checkmark-circle-outline" color="#15803D" bg="#F0FDF4" />
          </View>

          <View style={styles.alertPreviewList}>
            <AlertPreview
              title="Power outage around Diligence Road"
              meta="Power Issue • In Review"
              distance="0.6 km"
              color="#F59E0B"
              icon="flash-outline"
            />
            <AlertPreview
              title="Suspicious movement near Chalet Area"
              meta="Security Concern • High"
              distance="0.9 km"
              color="#DC2626"
              icon="eye-outline"
            />
          </View>
        </View>

        <View style={styles.lostFoundPanel}>
          <View style={styles.lostFoundIcon}>
            <Ionicons name="file-tray-full-outline" size={26} color="#FFFFFF" />
          </View>

          <View style={styles.lostFoundTextWrap}>
            <Text style={styles.lostFoundTitle}>Lost something in camp?</Text>
            <Text style={styles.lostFoundText}>
              Report lost or found items. Admin will review claims before any handover.
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.lostFoundButton} onPress={() => onNavigate('lost-found')}>
            <Text style={styles.lostFoundButtonText}>Open</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recently Submitted</Text>
              <Text style={styles.sectionSubtitle}>Your latest reports and updates.</Text>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={() => onNavigate('my-reports')}>
              <Text style={styles.sectionLink}>View all</Text>
            </TouchableOpacity>
          </View>

          {recentReports.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={28} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No reports yet</Text>
              <Text style={styles.emptyText}>Your submitted reports will appear here.</Text>
            </View>
          ) : (
            recentReports.map((incident) => (
              <TouchableOpacity
                key={incident.id}
                activeOpacity={0.85}
                style={styles.recentRow}
                onPress={() => onOpenIncident(incident)}
              >
                <View style={styles.recentIcon}>
                  <Ionicons name="document-text-outline" size={18} color="#123F2B" />
                </View>

                <View style={styles.recentDetails}>
                  <Text style={styles.recentId}>{incident.id}</Text>
                  <Text style={styles.recentMeta} numberOfLines={1}>
                    {incident.type} • {incident.location}
                  </Text>
                </View>

                <View style={styles.recentBadge}>
                  <Text style={styles.recentBadgeText}>{incident.status}</Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#64748B" />
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.noticeCard}>
          <View style={styles.noticeIconWrap}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#123F2B" />
          </View>

          <View style={styles.noticeTextWrap}>
            <Text style={styles.noticeTitle}>No assumed offices or fake numbers.</Text>
            <Text style={styles.noticeText}>
              Official units and phone numbers will be configured by verified admins only.
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomTabs active="home" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function PrimaryActionCard({
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
    <TouchableOpacity activeOpacity={0.88} style={styles.primaryActionCard} onPress={onPress}>
      <View style={[styles.primaryIconWrap, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={25} color={color} />
      </View>
      <Text style={styles.primaryTitle}>{title}</Text>
      <Text style={styles.primarySubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

function CategoryTile({
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
    <TouchableOpacity activeOpacity={0.86} style={styles.categoryTile} onPress={onPress}>
      <View style={[styles.categoryIconWrap, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.categoryTitle}>{title}</Text>
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
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function AlertPreview({
  title,
  meta,
  distance,
  color,
  icon
}: {
  title: string;
  meta: string;
  distance: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.alertPreview}>
      <View style={[styles.alertPreviewIcon, { backgroundColor: `${color}14` }]}>
        <Ionicons name={icon} size={21} color={color} />
      </View>

      <View style={styles.alertPreviewText}>
        <Text style={styles.alertPreviewTitle}>{title}</Text>
        <Text style={styles.alertPreviewMeta}>{meta}</Text>
      </View>

      <Text style={styles.alertDistance}>{distance}</Text>
      <Ionicons name="chevron-forward" size={17} color="#64748B" />
    </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  brandRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D4AF5A',
    backgroundColor: 'rgba(255,255,255,0.09)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  brandTextWrap: {
    flex: 1
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    lineHeight: 17
  },
  brandSubtitle: {
    marginTop: 4,
    color: '#D4AF5A',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  },
  headerIconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  notificationBadge: {
    position: 'absolute',
    top: 1,
    right: 0,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900'
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ECFDF5',
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 8
  },
  statusPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  heroTitle: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 33
  },
  heroSubtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.78)',
    fontSize: 14,
    lineHeight: 21
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28
  },
  commandCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4EAE6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4
  },
  categoryCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4EAE6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3
  },
  livePanel: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4EAE6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900'
  },
  sectionSubtitle: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 12.5,
    lineHeight: 18
  },
  sectionLink: {
    color: '#123F2B',
    fontSize: 13,
    fontWeight: '900'
  },
  primaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  primaryActionCard: {
    width: '48%',
    minHeight: 142,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
    padding: 14,
    marginBottom: 12
  },
  primaryIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13
  },
  primaryTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900'
  },
  primarySubtitle: {
    marginTop: 5,
    color: '#64748B',
    fontSize: 12,
    lineHeight: 17
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  categoryTile: {
    width: '23.5%',
    minHeight: 92,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginBottom: 10
  },
  categoryIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  categoryTitle: {
    color: '#0F172A',
    fontSize: 10.5,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 14
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  metricBox: {
    width: '31.5%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
    padding: 12,
    alignItems: 'center'
  },
  metricIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  metricValue: {
    marginTop: 8,
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '900'
  },
  metricLabel: {
    marginTop: 2,
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center'
  },
  alertPreviewList: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7'
  },
  alertPreview: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
    paddingVertical: 12
  },
  alertPreviewIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  alertPreviewText: {
    flex: 1
  },
  alertPreviewTitle: {
    color: '#0F172A',
    fontSize: 13.5,
    fontWeight: '800'
  },
  alertPreviewMeta: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 12
  },
  alertDistance: {
    color: '#123F2B',
    fontSize: 12,
    fontWeight: '900',
    marginRight: 8
  },
  lostFoundPanel: {
    marginTop: 16,
    backgroundColor: '#123F2B',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  lostFoundIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13
  },
  lostFoundTextWrap: {
    flex: 1
  },
  lostFoundTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  lostFoundText: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12.5,
    lineHeight: 18
  },
  lostFoundButton: {
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 9
  },
  lostFoundButtonText: {
    color: '#123F2B',
    fontSize: 12,
    fontWeight: '900'
  },
  recentCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4EAE6'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 18
  },
  emptyTitle: {
    marginTop: 8,
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900'
  },
  emptyText: {
    marginTop: 3,
    color: '#64748B',
    fontSize: 12
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
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  recentDetails: {
    flex: 1
  },
  recentId: {
    color: '#0F172A',
    fontSize: 13.5,
    fontWeight: '900'
  },
  recentMeta: {
    marginTop: 3,
    color: '#64748B',
    fontSize: 12
  },
  recentBadge: {
    borderRadius: 999,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginRight: 8
  },
  recentBadgeText: {
    color: '#123F2B',
    fontSize: 10,
    fontWeight: '900'
  },
  noticeCard: {
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  noticeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  noticeTextWrap: {
    flex: 1
  },
  noticeTitle: {
    color: '#123F2B',
    fontSize: 14,
    fontWeight: '900'
  },
  noticeText: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 12.5,
    lineHeight: 18
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