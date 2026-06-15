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
import { AppBrandLogo } from '../components/AppBrandLogo';

interface HomeScreenProps {
  incidents: Incident[];
  onNavigate: (screen: ScreenName) => void;
  onStartReport: (options?: Partial<DraftIncident>) => void;
  onOpenIncident: (incident: Incident) => void;
}

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 28 : 0;
const HEADER_TOP = Platform.OS === 'android' ? STATUS_BAR_HEIGHT + 12 : 18;

const C = {
  bg: '#020B18',
  card: '#071426',
  card2: '#0B1B31',
  border: 'rgba(255,255,255,0.09)',
  text: '#F7FAFC',
  muted: '#94A7BD',
  blue: '#2F80FF',
  blueSoft: 'rgba(47,128,255,0.15)',
  red: '#FF4D4F',
  green: '#23D160',
  orange: '#FF8A1F',
  yellow: '#FFD43B',
  purple: '#A855F7',
  white: '#FFFFFF'
};

const quickIssues: Array<{
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

function getIncidentIcon(type: IncidentType | string): keyof typeof Ionicons.glyphMap {
  if (type.includes('Fire')) return 'flame-outline';
  if (type.includes('Medical')) return 'medical-outline';
  if (type.includes('Electricity')) return 'flash-outline';
  if (type.includes('Theft') || type.includes('Security')) return 'shield-outline';
  if (type.includes('Traffic')) return 'car-outline';
  if (type.includes('Facility')) return 'business-outline';
  return 'alert-circle-outline';
}

function getIncidentColor(type: IncidentType | string) {
  if (type.includes('Fire')) return C.red;
  if (type.includes('Medical')) return C.green;
  if (type.includes('Electricity')) return C.yellow;
  if (type.includes('Theft') || type.includes('Security')) return C.blue;
  if (type.includes('Traffic')) return C.orange;
  if (type.includes('Facility')) return C.purple;
  return C.muted;
}

function getSeverityColor(severity: string) {
  if (severity === 'Critical') return C.red;
  if (severity === 'High') return C.orange;
  if (severity === 'Medium') return C.blue;
  if (severity === 'Low') return C.yellow;
  return C.green;
}

function getSmartAdvice(incidents: Incident[]) {
  const critical = incidents.filter((item) => item.severity === 'Critical').length;
  const security = incidents.filter((item) => item.type.includes('Security') || item.type.includes('Theft')).length;
  const power = incidents.filter((item) => item.type.includes('Electricity')).length;

  if (critical > 0) {
    return {
      title: 'Critical issue detected',
      text: 'Add evidence and exact location before submitting urgent reports.',
      color: C.red,
      icon: 'warning-outline' as keyof typeof Ionicons.glyphMap
    };
  }

  if (security > 0) {
    return {
      title: 'Security pattern noticed',
      text: 'Admin should verify the report and route it to the right response body.',
      color: C.blue,
      icon: 'shield-outline' as keyof typeof Ionicons.glyphMap
    };
  }

  if (power > 0) {
    return {
      title: 'Power issue trend',
      text: 'Include area name, landmark, and safe photo evidence if available.',
      color: C.yellow,
      icon: 'flash-outline' as keyof typeof Ionicons.glyphMap
    };
  }

  return {
    title: 'Smart assistant ready',
    text: 'Reports are prepared for Admin Control Desk review and routing.',
    color: C.green,
    icon: 'sparkles-outline' as keyof typeof Ionicons.glyphMap
  };
}

export function HomeScreen({ incidents, onNavigate, onStartReport, onOpenIncident }: HomeScreenProps) {
  const activeCount = incidents.filter((item) => item.status !== 'Resolved').length;
  const criticalCount = incidents.filter((item) => item.severity === 'Critical').length;
  const resolvedCount = incidents.filter((item) => item.status === 'Resolved').length + 47;
  const recentReports = useMemo(() => incidents.slice(0, 3), [incidents]);
  const smartAdvice = useMemo(() => getSmartAdvice(incidents), [incidents]);

  function startQuickReport(item: (typeof quickIssues)[number]) {
    onStartReport({
      type: item.type,
      severity: item.severity,
      title: `${item.label} report`,
      location: '',
      address: '',
      latitude: null,
      longitude: null,
      description: ''
    });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <AppBrandLogo size="medium" />

            <View style={styles.brandTextWrap}>
              <View style={styles.commandChip}>
                <View style={styles.commandDot} />
                <Text style={styles.commandChipText}>RCC SAFETY COMMAND</Text>
              </View>

              <Text style={styles.brandTitle}>Redemption City Safety</Text>
              <Text style={styles.brandSubtitle}>Incident Management System</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.bellButton} onPress={() => onNavigate('alerts')}>
            <Ionicons name="notifications-outline" size={22} color={C.white} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.statusStrip}>
          <View style={styles.statusStripLeft}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusStripText}>Admin Control Desk Online</Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.reporterChip} onPress={() => onNavigate('profile')}>
            <Ionicons name="person-outline" size={14} color={C.white} />
            <Text style={styles.reporterChipText}>Reporter</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.criticalBanner} onPress={() => recentReports[0] && onOpenIncident(recentReports[0])}>
          <View style={styles.criticalIcon}>
            <Ionicons name="warning" size={25} color={C.white} />
          </View>

          <View style={styles.flex}>
            <Text style={styles.criticalTitle}>CRITICAL ALERT</Text>
            <Text style={styles.criticalText}>Major incident reported. Avoid affected area.</Text>
          </View>

          <View style={styles.criticalDivider} />
          <Text style={styles.criticalAction}>VIEW</Text>
          <Ionicons name="chevron-forward" size={18} color={C.white} />
        </TouchableOpacity>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>LIVE STATUS</Text>
          <View style={styles.updatedRow}>
            <Text style={styles.updatedText}>Updated now</Text>
            <View style={styles.greenDot} />
          </View>
        </View>

        <View style={styles.statusRow}>
          <StatusCard title="ACTIVE" value={String(activeCount)} label="Incidents" icon="clipboard-outline" color={C.blue} />
          <StatusCard title="CRITICAL" value={String(criticalCount)} label="Incidents" icon="warning-outline" color={C.red} />
          <StatusCard title="RESOLVED" value={String(resolvedCount)} label="Incidents" icon="checkmark-circle-outline" color={C.green} />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>COMMAND ACTIONS</Text>
          <Text style={styles.sectionHint}>Core tools</Text>
        </View>

        <View style={styles.actionGrid}>
          <ActionCard title="Report Incident" text="Submit new issue" icon="document-text-outline" color={C.blue} onPress={() => onStartReport()} />
          <ActionCard title="Lost & Found" text="Item report" icon="file-tray-full-outline" color={C.purple} onPress={() => onNavigate('lost-found')} />
          <ActionCard title="Track Reports" text="Case progress" icon="analytics-outline" color={C.green} onPress={() => onNavigate('my-reports')} />
          <ActionCard title="Incident Map" text="Live overview" icon="map-outline" color={C.orange} onPress={() => onNavigate('map')} />
        </View>

        <View style={[styles.smartCard, { borderColor: `${smartAdvice.color}70` }]}>
          <View style={[styles.smartIcon, { backgroundColor: `${smartAdvice.color}20` }]}>
            <Ionicons name={smartAdvice.icon} size={22} color={smartAdvice.color} />
          </View>

          <View style={styles.flex}>
            <View style={styles.smartTop}>
              <Text style={styles.smartTitle}>{smartAdvice.title}</Text>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>SMART</Text>
              </View>
            </View>

            <Text style={styles.smartText}>{smartAdvice.text}</Text>
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>QUICK ISSUE</Text>
          <TouchableOpacity activeOpacity={0.85} onPress={() => onStartReport()}>
            <Text style={styles.viewAllText}>Full report</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickList}>
          {quickIssues.map((item) => (
            <TouchableOpacity key={item.label} activeOpacity={0.86} style={styles.quickPill} onPress={() => startQuickReport(item)}>
              <View style={[styles.quickIcon, { backgroundColor: `${item.color}18` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.quickText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.lostFoundStrip}>
          <View style={styles.lostIcon}>
            <Ionicons name="search-outline" size={22} color={C.purple} />
          </View>

          <View style={styles.flex}>
            <Text style={styles.lostTitle}>Lost something in camp?</Text>
            <Text style={styles.lostText}>Submit details, photo evidence, and pinned location.</Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.lostButton} onPress={() => onNavigate('lost-found')}>
            <Text style={styles.lostButtonText}>Open</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>LIVE ALERTS</Text>
          <TouchableOpacity activeOpacity={0.85} onPress={() => onNavigate('alerts')}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        {recentReports.map((incident) => (
          <TouchableOpacity key={incident.id} activeOpacity={0.86} style={styles.alertRow} onPress={() => onOpenIncident(incident)}>
            <View style={[styles.alertIcon, { backgroundColor: `${getIncidentColor(incident.type)}20` }]}>
              <Ionicons name={getIncidentIcon(incident.type)} size={23} color={getIncidentColor(incident.type)} />
            </View>

            <View style={styles.flex}>
              <Text style={styles.alertTitle} numberOfLines={1}>
                {incident.title}
              </Text>
              <Text style={styles.alertMeta} numberOfLines={1}>
                <Ionicons name="location-outline" size={12} color={C.muted} /> {incident.location}
              </Text>
            </View>

            <View style={styles.alertRight}>
              <View style={[styles.severityBadge, { backgroundColor: `${getSeverityColor(incident.severity)}22` }]}>
                <Text style={[styles.severityText, { color: getSeverityColor(incident.severity) }]}>
                  {incident.severity.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.timeText}>2m ago</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color={C.muted} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomTabs active="home" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function StatusCard({
  title,
  value,
  label,
  icon,
  color
}: {
  title: string;
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  return (
    <View style={[styles.statusCard, { borderColor: `${color}70` }]}>
      <View style={[styles.statusIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={19} color={color} />
      </View>

      <Text style={[styles.statusTitle, { color }]}>{title}</Text>
      <Text style={styles.statusValue}>{value}</Text>
      <Text style={styles.statusLabel}>{label}</Text>
      <View style={[styles.statusLine, { backgroundColor: color }]} />
    </View>
  );
}

function ActionCard({
  title,
  text,
  icon,
  color,
  onPress
}: {
  title: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.86} style={styles.actionCard} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>

      <Text style={styles.actionTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.actionText} numberOfLines={1}>
        {text}
      </Text>
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
        <Ionicons name={icon} size={24} color={active ? C.blue : C.muted} />
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1 },
  content: { paddingTop: HEADER_TOP, paddingHorizontal: 16, paddingBottom: 104 },
  header: {
    minHeight: 88,
    borderRadius: 22,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  brandTextWrap: { flex: 1, marginLeft: 12 },
  commandChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: 'rgba(35,209,96,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  commandDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green, marginRight: 6 },
  commandChipText: { color: C.green, fontSize: 8.5, fontWeight: '900', letterSpacing: 1 },
  brandTitle: { color: C.text, fontSize: 18, fontWeight: '900', letterSpacing: -0.4 },
  brandSubtitle: { color: C.muted, fontSize: 12, fontWeight: '700', marginTop: 2 },
  bellButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.red,
    borderWidth: 2,
    borderColor: C.card,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationBadgeText: { color: C.white, fontSize: 10, fontWeight: '900' },
  statusStrip: {
    minHeight: 48,
    borderRadius: 18,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  statusStripLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.green, marginRight: 8 },
  statusStripText: { color: C.text, fontSize: 12, fontWeight: '800' },
  reporterChip: {
    borderRadius: 999,
    backgroundColor: C.blueSoft,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8
  },
  reporterChipText: { color: C.text, fontSize: 11, fontWeight: '800', marginLeft: 5 },
  criticalBanner: {
    minHeight: 68,
    borderRadius: 17,
    backgroundColor: '#690B12',
    borderWidth: 1,
    borderColor: '#991B24',
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18
  },
  criticalIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.red, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  criticalTitle: { color: C.white, fontSize: 14, fontWeight: '900' },
  criticalText: { color: '#F6D1D5', fontSize: 12, lineHeight: 16, marginTop: 2 },
  criticalDivider: { width: 1, height: 38, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 9 },
  criticalAction: { color: C.white, fontSize: 10.5, fontWeight: '900' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { color: '#B8C8DE', fontSize: 13, fontWeight: '900', letterSpacing: 1.8 },
  sectionHint: { color: C.muted, fontSize: 11, fontWeight: '800' },
  updatedRow: { flexDirection: 'row', alignItems: 'center' },
  updatedText: { color: C.muted, fontSize: 11, fontWeight: '700', marginRight: 7 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.green },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statusCard: { width: '31.5%', minHeight: 108, borderRadius: 15, backgroundColor: C.card, borderWidth: 1.2, padding: 9 },
  statusIcon: { width: 31, height: 31, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statusTitle: { fontSize: 10, fontWeight: '900' },
  statusValue: { color: C.white, fontSize: 23, fontWeight: '900', marginTop: 2 },
  statusLabel: { color: C.muted, fontSize: 10, marginTop: 1 },
  statusLine: { height: 3, borderRadius: 999, marginTop: 'auto', width: '100%' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10, marginBottom: 16 },
  actionCard: { width: '48.5%', minHeight: 92, borderRadius: 17, backgroundColor: C.card2, borderWidth: 1, borderColor: C.border, padding: 12 },
  actionIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionTitle: { color: C.text, fontSize: 13.5, fontWeight: '900' },
  actionText: { color: C.muted, fontSize: 11.5, marginTop: 2 },
  smartCard: { borderRadius: 16, backgroundColor: C.card, borderWidth: 1, padding: 12, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 18 },
  smartIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  smartTop: { flexDirection: 'row', alignItems: 'center' },
  smartTitle: { color: C.text, fontSize: 13.5, fontWeight: '900', flex: 1 },
  smartText: { color: C.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  aiBadge: { borderRadius: 999, backgroundColor: C.blueSoft, paddingHorizontal: 7, paddingVertical: 3 },
  aiBadgeText: { color: C.blue, fontSize: 8.5, fontWeight: '900' },
  viewAllText: { color: C.blue, fontSize: 12, fontWeight: '900' },
  quickList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  quickPill: {
    minHeight: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.card,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  quickIcon: { width: 27, height: 27, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 7 },
  quickText: { color: C.text, fontSize: 11.5, fontWeight: '900' },
  lostFoundStrip: {
    minHeight: 66,
    borderRadius: 17,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: `${C.purple}55`,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18
  },
  lostIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(168,85,247,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  lostTitle: { color: C.text, fontSize: 13.5, fontWeight: '900' },
  lostText: { color: C.muted, fontSize: 11, marginTop: 2 },
  lostButton: { borderRadius: 999, backgroundColor: 'rgba(168,85,247,0.15)', paddingHorizontal: 11, paddingVertical: 8, marginLeft: 8 },
  lostButtonText: { color: C.purple, fontSize: 10.5, fontWeight: '900' },
  alertRow: {
    minHeight: 63,
    borderRadius: 15,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 8
  },
  alertIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  alertTitle: { color: C.text, fontSize: 13, fontWeight: '900' },
  alertMeta: { color: C.muted, fontSize: 11, marginTop: 3 },
  alertRight: { alignItems: 'flex-end', marginLeft: 8 },
  severityBadge: { borderRadius: 7, paddingHorizontal: 7, paddingVertical: 4 },
  severityText: { fontSize: 9, fontWeight: '900' },
  timeText: { color: C.muted, fontSize: 10, marginTop: 4 },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 76,
    backgroundColor: '#06111E',
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 7
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabBadge: { position: 'absolute', top: -9, right: -13, width: 21, height: 21, borderRadius: 11, backgroundColor: C.red, alignItems: 'center', justifyContent: 'center' },
  tabBadgeText: { color: C.white, fontSize: 10, fontWeight: '900' },
  tabLabel: { color: C.muted, fontSize: 11.5, fontWeight: '700', marginTop: 3 },
  tabLabelActive: { color: C.blue }
});