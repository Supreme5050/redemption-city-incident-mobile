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

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 28 : 0;
const HEADER_SAFE_TOP = Platform.OS === 'android' ? STATUS_BAR_HEIGHT + 26 : 22;

const C = {
  green: '#063D28',
  greenDeep: '#042B1D',
  greenSoft: '#EAF7EF',
  greenCard: '#F1FBF5',
  gold: '#D6B45B',
  bg: '#EEF4F0',
  card: '#FFFFFF',
  text: '#101828',
  muted: '#667085',
  line: '#DDE7E1',
  red: '#E53935',
  redSoft: '#FFF1F1',
  orange: '#F59E0B',
  orangeSoft: '#FFF7E7',
  blue: '#2563EB',
  blueSoft: '#EEF4FF',
  purple: '#8B5CF6',
  purpleSoft: '#F4EEFF',
  teal: '#0F766E',
  tealSoft: '#EDFCF8'
};

const shortcuts: Array<{
  label: string;
  type: IncidentType;
  severity: IncidentSeverity;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}> = [
  {
    label: 'Fire',
    type: 'Fire / Smoke',
    severity: 'Critical',
    icon: 'flame-outline',
    color: '#E11D48',
    bg: '#FFF1F2'
  },
  {
    label: 'Security',
    type: 'Theft / Security Issue',
    severity: 'High',
    icon: 'shield-checkmark-outline',
    color: C.blue,
    bg: '#EFF6FF'
  },
  {
    label: 'Misconduct',
    type: 'Fight / Misconduct',
    severity: 'High',
    icon: 'hand-left-outline',
    color: '#DC2626',
    bg: '#FEF2F2'
  },
  {
    label: 'Medical',
    type: 'Medical / First Aid',
    severity: 'High',
    icon: 'medkit-outline',
    color: '#16A34A',
    bg: '#F0FDF4'
  },
  {
    label: 'Power',
    type: 'Electricity / Power Issue',
    severity: 'Medium',
    icon: 'flash-outline',
    color: '#F59E0B',
    bg: '#FFF8E8'
  },
  {
    label: 'Traffic',
    type: 'Traffic / Road Obstruction',
    severity: 'Medium',
    icon: 'car-outline',
    color: '#EA580C',
    bg: '#FFF7ED'
  },
  {
    label: 'Facility',
    type: 'Facility / Maintenance Fault',
    severity: 'Medium',
    icon: 'business-outline',
    color: '#0F766E',
    bg: '#ECFDF5'
  },
  {
    label: 'Other',
    type: 'Other',
    severity: 'Medium',
    icon: 'ellipsis-horizontal-circle-outline',
    color: '#475569',
    bg: '#F8FAFC'
  }
];

export function HomeScreen({ incidents, onNavigate, onStartReport, onOpenIncident }: HomeScreenProps) {
  const recentReports = useMemo(() => incidents.slice(0, 3), [incidents]);

  function startQuickReport(type: IncidentType, severity: IncidentSeverity, title: string) {
    onStartReport({
      type,
      severity,
      title,
      location: 'Main Auditorium Area',
      address: 'Main Auditorium Area, Redemption City Camp',
      description: ''
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={C.greenDeep} barStyle="light-content" translucent={false} />

      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <View style={styles.logoBox}>
              <Ionicons name="leaf-outline" size={24} color={C.gold} />
            </View>

            <View style={styles.brandTextWrap}>
              <Text style={styles.brandTitle}>REDEMPTION CITY CAMP</Text>
              <Text style={styles.brandSubtitle}>SAFETY & INCIDENT MANAGEMENT</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity activeOpacity={0.85} style={styles.iconCircle} onPress={() => onNavigate('alerts')}>
              <Ionicons name="notifications-outline" size={21} color="#FFFFFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} style={styles.profileCircle} onPress={() => onNavigate('profile')}>
              <Ionicons name="person" size={18} color={C.green} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.onlinePill}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Admin Control Desk Online</Text>
          </View>

          <Text style={styles.heroTitle}>Good afternoon, Admin 👋</Text>
          <Text style={styles.heroText}>
            Manage camp reports, urgent alerts, lost items, and verified response routing.
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.emergencyCard}
          onPress={() => startQuickReport('Medical / First Aid', 'Critical', 'Emergency assistance needed')}
        >
          <View style={styles.emergencyLeft}>
            <View style={styles.emergencyIcon}>
              <Ionicons name="warning-outline" size={24} color="#FFFFFF" />
            </View>

            <View style={styles.flex}>
              <Text style={styles.emergencyTitle}>Emergency Report</Text>
              <Text style={styles.emergencyText}>
                Use only for danger, fire outbreak, injury, or urgent threat.
              </Text>
            </View>
          </View>

          <View style={styles.emergencyArrow}>
            <Ionicons name="arrow-forward" size={18} color={C.red} />
          </View>
        </TouchableOpacity>

        <View style={styles.panel}>
          <SectionHeader title="Main Services" subtitle="Core workflows for the camp." />

          <View style={styles.mainServiceRow}>
            <MainServiceCard
              title="Report Incident"
              text="Submit a new camp issue for admin review and routing."
              icon="document-text-outline"
              color={C.green}
              bg={C.greenCard}
              onPress={() => onStartReport()}
            />

            <MainServiceCard
              title="Lost & Found"
              text="Report a lost or found item for proper verification."
              icon="file-tray-full-outline"
              color={C.purple}
              bg={C.purpleSoft}
              onPress={() => onNavigate('lost-found')}
            />
          </View>
        </View>

        <View style={styles.operationsRow}>
          <OperationCard
            title="My Reports"
            value={String(incidents.length)}
            icon="folder-open-outline"
            color={C.teal}
            bg={C.tealSoft}
            onPress={() => onNavigate('my-reports')}
          />

          <OperationCard
            title="Live Alerts"
            value="8"
            icon="notifications-outline"
            color={C.red}
            bg={C.redSoft}
            onPress={() => onNavigate('alerts')}
          />

          <OperationCard
            title="Map View"
            value="Zones"
            icon="map-outline"
            color={C.blue}
            bg={C.blueSoft}
            onPress={() => onNavigate('map')}
          />
        </View>

        <View style={styles.panel}>
          <SectionHeader title="Quick Issue Shortcuts" subtitle="Start a report with one tap." />

          <View style={styles.shortcutWrap}>
            {shortcuts.map((item) => (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.86}
                style={styles.shortcutPill}
                onPress={() => startQuickReport(item.type, item.severity, `${item.label} issue reported`)}
              >
                <View style={[styles.shortcutIcon, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon} size={17} color={item.color} />
                </View>
                <Text style={styles.shortcutText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.liveCard}>
          <View style={styles.liveHeaderRow}>
            <View>
              <Text style={styles.liveTitle}>Live Situation</Text>
              <Text style={styles.liveSubtitle}>Current items needing attention.</Text>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={() => onNavigate('alerts')}>
              <Text style={styles.liveAction}>View alerts</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusSummary}>
            <SituationMetric value="8" label="Active" color={C.orange} bg={C.orangeSoft} />
            <SituationMetric value="3" label="Critical" color={C.red} bg={C.redSoft} />
            <SituationMetric value="12" label="Resolved" color={C.green} bg={C.greenSoft} />
          </View>

          <View style={styles.compactList}>
            <MiniIncident
              title="Power outage around Diligence Road"
              meta="Power Issue • In Review"
              color={C.orange}
              icon="flash-outline"
              badgeLabel="Medium"
              badgeBg={C.orangeSoft}
              badgeColor={C.orange}
            />
            <MiniIncident
              title="Suspicious movement near Chalet Area"
              meta="Security Concern • High"
              color={C.red}
              icon="eye-outline"
              badgeLabel="High"
              badgeBg={C.redSoft}
              badgeColor={C.red}
            />
          </View>
        </View>

        <View style={styles.panel}>
          <SectionHeader
            title="Recent Activity"
            subtitle="Latest submitted reports."
            action="View all"
            onAction={() => onNavigate('my-reports')}
          />

          {recentReports.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={28} color="#98A2B3" />
              <Text style={styles.emptyTitle}>No reports yet</Text>
              <Text style={styles.emptyText}>Your submitted reports will appear here.</Text>
            </View>
          ) : (
            recentReports.map((incident, index) => (
              <TouchableOpacity
                key={incident.id}
                activeOpacity={0.85}
                style={[styles.reportRow, index === 0 && styles.reportRowFirst]}
                onPress={() => onOpenIncident(incident)}
              >
                <View style={styles.reportIcon}>
                  <Ionicons name="document-text-outline" size={18} color={C.green} />
                </View>

                <View style={styles.flex}>
                  <Text style={styles.reportTitle} numberOfLines={1}>
                    {incident.title}
                  </Text>
                  <Text style={styles.reportMeta} numberOfLines={1}>
                    {incident.id} • {incident.location}
                  </Text>
                </View>

                <View style={styles.reportChevronWrap}>
                  <Ionicons name="chevron-forward" size={18} color="#98A2B3" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.noticeCard}>
          <View style={styles.noticeIcon}>
            <Ionicons name="shield-checkmark-outline" size={21} color={C.green} />
          </View>
          <Text style={styles.noticeText}>
            Reports go to Admin Control Desk first. Verified admins will later configure real offices and official phone numbers.
          </Text>
        </View>
      </ScrollView>

      <BottomTabs active="home" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function SectionHeader({
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
    <View style={styles.sectionHeader}>
      <View style={styles.flex}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>

      {action ? (
        <TouchableOpacity activeOpacity={0.85} onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function MainServiceCard({
  title,
  text,
  icon,
  color,
  bg,
  onPress
}: {
  title: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.88} style={[styles.mainServiceCard, { backgroundColor: bg }]} onPress={onPress}>
      <View style={styles.mainServiceIcon}>
        <Ionicons name={icon} size={23} color={color} />
      </View>
      <Text style={styles.mainServiceTitle}>{title}</Text>
      <Text style={styles.mainServiceText}>{text}</Text>
    </TouchableOpacity>
  );
}

function OperationCard({
  title,
  value,
  icon,
  color,
  bg,
  onPress
}: {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.88} style={styles.operationCard} onPress={onPress}>
      <View style={[styles.operationIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.operationValue, { color }]}>{value}</Text>
      <Text style={styles.operationTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

function SituationMetric({
  value,
  label,
  color,
  bg
}: {
  value: string;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <View style={styles.situationMetric}>
      <View style={[styles.situationBadge, { backgroundColor: bg }]}>
        <Text style={[styles.situationValue, { color }]}>{value}</Text>
      </View>
      <Text style={styles.situationLabel}>{label}</Text>
    </View>
  );
}

function MiniIncident({
  title,
  meta,
  color,
  icon,
  badgeLabel,
  badgeBg,
  badgeColor
}: {
  title: string;
  meta: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  badgeLabel: string;
  badgeBg: string;
  badgeColor: string;
}) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.miniIncident}>
      <View style={[styles.miniIcon, { backgroundColor: `${color}14` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>

      <View style={styles.flex}>
        <Text style={styles.miniTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.miniMeta} numberOfLines={1}>
          {meta}
        </Text>
      </View>

      <View style={styles.miniRight}>
        <View style={[styles.miniBadge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.miniBadgeText, { color: badgeColor }]}>{badgeLabel}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#98A2B3" />
      </View>
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
  safeArea: {
    flex: 1,
    backgroundColor: C.bg
  },
  flex: {
    flex: 1
  },
  header: {
    backgroundColor: C.green,
    paddingTop: HEADER_SAFE_TOP,
    paddingHorizontal: 18,
    paddingBottom: 26,
    minHeight: HEADER_SAFE_TOP + 205
  },
  topRow: {
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
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  brandTextWrap: {
    flex: 1
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  brandSubtitle: {
    color: C.gold,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 4
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.12)',
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
  badge: {
    position: 'absolute',
    top: -3,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900'
  },
  hero: {
    marginTop: 28
  },
  onlinePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 8
  },
  onlineText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 31,
    marginTop: 16
  },
  heroText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28
  },
  emergencyCard: {
    minHeight: 88,
    borderRadius: 26,
    backgroundColor: C.red,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: C.red,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 6
  },
  emergencyLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  emergencyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  emergencyText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 11.5,
    lineHeight: 16,
    marginTop: 3
  },
  emergencyArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12
  },
  panel: {
    backgroundColor: C.card,
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: C.line,
    marginBottom: 16,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  sectionTitle: {
    color: C.text,
    fontSize: 17,
    fontWeight: '900'
  },
  sectionSubtitle: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3
  },
  sectionAction: {
    color: C.green,
    fontSize: 12,
    fontWeight: '900'
  },
  mainServiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mainServiceCard: {
    width: '48.5%',
    minHeight: 140,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.line,
    padding: 15,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  mainServiceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1
  },
  mainServiceTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900'
  },
  mainServiceText: {
    color: C.muted,
    fontSize: 11.5,
    lineHeight: 16,
    marginTop: 5
  },
  operationsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  operationCard: {
    width: '31.5%',
    minHeight: 104,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.045,
    shadowRadius: 10,
    elevation: 2
  },
  operationIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  operationValue: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 8
  },
  operationTitle: {
    color: C.muted,
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center'
  },
  shortcutWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  shortcutPill: {
    minHeight: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center'
  },
  shortcutIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7
  },
  shortcutText: {
    color: C.text,
    fontSize: 11.8,
    fontWeight: '900'
  },
  liveCard: {
    backgroundColor: '#F8FBF9',
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DCEEE4',
    marginBottom: 16,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3
  },
  liveHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  liveTitle: {
    color: C.text,
    fontSize: 17,
    fontWeight: '900'
  },
  liveSubtitle: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3
  },
  liveAction: {
    color: C.green,
    fontSize: 12,
    fontWeight: '900'
  },
  statusSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  situationMetric: {
    width: '31.5%',
    minHeight: 82,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  situationBadge: {
    minWidth: 44,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  situationValue: {
    fontSize: 16,
    fontWeight: '900'
  },
  situationLabel: {
    color: C.muted,
    fontSize: 10.5,
    marginTop: 8
  },
  compactList: {
    borderTopWidth: 1,
    borderTopColor: '#E6EFEA'
  },
  miniIncident: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EFEA',
    paddingVertical: 10
  },
  miniIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  miniTitle: {
    color: C.text,
    fontSize: 12.5,
    fontWeight: '900'
  },
  miniMeta: {
    color: C.muted,
    fontSize: 11,
    marginTop: 2
  },
  miniRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10
  },
  miniBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 5
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '900'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 18
  },
  emptyTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 6
  },
  emptyText: {
    color: C.muted,
    fontSize: 11.5,
    marginTop: 2
  },
  reportRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
    paddingVertical: 10
  },
  reportRowFirst: {
    borderTopWidth: 0
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: C.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  reportTitle: {
    color: C.text,
    fontSize: 12.8,
    fontWeight: '900'
  },
  reportMeta: {
    color: C.muted,
    fontSize: 11,
    marginTop: 2
  },
  reportChevronWrap: {
    width: 28,
    alignItems: 'flex-end'
  },
  noticeCard: {
    borderRadius: 20,
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: '#DDE9E1',
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 2
  },
  noticeIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.greenSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noticeText: {
    flex: 1,
    color: C.muted,
    fontSize: 11.8,
    lineHeight: 17
  },
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
  tabIconActive: {
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
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900'
  },
  tabLabel: {
    color: '#98A2B3',
    fontSize: 10.5,
    fontWeight: '700'
  },
  tabLabelActive: {
    color: C.green,
    fontWeight: '900'
  }
});