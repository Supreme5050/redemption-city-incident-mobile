import React, { useMemo, useState } from 'react';
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
import { Incident } from '../types/incident';
import { ScreenName } from '../types/navigation';
import { LostFoundRecord } from '../types/lostFound';

interface MyReportsScreenProps {
  incidents: Incident[];
  lostFoundRecords: LostFoundRecord[];
  onNavigate: (screen: ScreenName) => void;
  onOpenIncident: (incident: Incident) => void;
}

type FilterType = 'All' | 'Incidents' | 'Lost & Found';

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
  redSoft: '#FFF1F1',
  orange: '#F59E0B',
  orangeSoft: '#FFF7E7',
  blue: '#2563EB',
  blueSoft: '#EEF4FF',
  purple: '#8B5CF6',
  purpleSoft: '#F4EEFF',
  teal: '#0F766E'
};

export function MyReportsScreen({
  incidents,
  lostFoundRecords,
  onNavigate,
  onOpenIncident
}: MyReportsScreenProps) {
  const [filter, setFilter] = useState<FilterType>('All');

  const activeIncidents = useMemo(
    () => incidents.filter((incident) => incident.status !== 'Resolved' && incident.status !== 'Rejected'),
    [incidents]
  );

  const activeLostFound = useMemo(
    () => lostFoundRecords.filter((record) => record.status !== 'Closed'),
    [lostFoundRecords]
  );

  const showIncidents = filter === 'All' || filter === 'Incidents';
  const showLostFound = filter === 'All' || filter === 'Lost & Found';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={C.greenDeep} barStyle="light-content" translucent={false} />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity activeOpacity={0.85} style={styles.headerButton} onPress={() => onNavigate('home')}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>My Reports</Text>
            <Text style={styles.headerSubtitle}>Track incident and lost/found submissions</Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.profileCircle} onPress={() => onNavigate('profile')}>
            <Ionicons name="person" size={18} color={C.green} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.metricsRow}>
          <MetricCard label="Incidents" value={String(incidents.length)} icon="alert-circle-outline" color={C.red} bg={C.redSoft} />
          <MetricCard label="Lost/Found" value={String(lostFoundRecords.length)} icon="file-tray-full-outline" color={C.purple} bg={C.purpleSoft} />
          <MetricCard label="Active" value={String(activeIncidents.length + activeLostFound.length)} icon="pulse-outline" color={C.orange} bg={C.orangeSoft} />
        </View>

        <View style={styles.filterWrap}>
          {(['All', 'Incidents', 'Lost & Found'] as const).map((item) => {
            const active = filter === item;

            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.85}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setFilter(item)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showIncidents ? (
          <View style={styles.panel}>
            <SectionHeader
              title="Incident Reports"
              subtitle="Reports submitted to Admin Control Desk."
              action="New"
              onAction={() => onNavigate('report-step-one')}
            />

            {incidents.length === 0 ? (
              <EmptyState title="No incident reports yet" text="Your incident reports will appear here." />
            ) : (
              incidents.map((incident) => (
                <TouchableOpacity
                  key={incident.id}
                  activeOpacity={0.86}
                  style={styles.reportCard}
                  onPress={() => onOpenIncident(incident)}
                >
                  <View style={[styles.cardIcon, { backgroundColor: getSeverityBg(incident.severity) }]}>
                    <Ionicons name={getIncidentIcon(incident.type)} size={22} color={getSeverityColor(incident.severity)} />
                  </View>

                  <View style={styles.flex}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {incident.title}
                      </Text>
                      <StatusPill label={incident.status} />
                    </View>

                    <Text style={styles.cardMeta} numberOfLines={1}>
                      {incident.id} • {incident.location}
                    </Text>

                    <Text style={styles.cardDescription} numberOfLines={2}>
                      {incident.description}
                    </Text>

                    <View style={styles.cardFooter}>
                      <Text style={styles.footerText}>{incident.reportedAt}</Text>
                      <Text style={styles.footerAction}>View details</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : null}

        {showLostFound ? (
          <View style={styles.panel}>
            <SectionHeader
              title="Lost & Found Records"
              subtitle="Items submitted for verification."
              action="New"
              onAction={() => onNavigate('lost-found')}
            />

            {lostFoundRecords.length === 0 ? (
              <EmptyState title="No Lost & Found records yet" text="Lost or found items will appear here." />
            ) : (
              lostFoundRecords.map((record) => (
                <View key={record.id} style={styles.reportCard}>
                  <View style={[styles.cardIcon, { backgroundColor: record.mode === 'Lost Item' ? C.orangeSoft : C.purpleSoft }]}>
                    <Ionicons
                      name={record.mode === 'Lost Item' ? 'search-outline' : 'file-tray-full-outline'}
                      size={22}
                      color={record.mode === 'Lost Item' ? C.orange : C.purple}
                    />
                  </View>

                  <View style={styles.flex}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {record.itemName}
                      </Text>
                      <StatusPill label={record.status} />
                    </View>

                    <Text style={styles.cardMeta} numberOfLines={1}>
                      {record.id} • {record.mode} • {record.zone}
                    </Text>

                    <Text style={styles.cardDescription} numberOfLines={2}>
                      {record.description}
                    </Text>

                    {record.photoLabel ? (
                      <View style={styles.attachmentPill}>
                        <Ionicons name="image-outline" size={14} color={C.green} />
                        <Text style={styles.attachmentText}>{record.photoLabel}</Text>
                      </View>
                    ) : null}

                    <View style={styles.cardFooter}>
                      <Text style={styles.footerText}>{record.createdAt}</Text>
                      <Text style={styles.footerAction}>Admin review</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : null}
      </ScrollView>

      <BottomTabs active="reports" onNavigate={onNavigate} />
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
        <TouchableOpacity activeOpacity={0.85} style={styles.sectionActionButton} onPress={onAction}>
          <Text style={styles.sectionActionText}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
  bg
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={19} color={color} />
      </View>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={32} color="#98A2B3" />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function StatusPill({ label }: { label: string }) {
  const color =
    label === 'Resolved' || label === 'Closed'
      ? C.green
      : label === 'Assigned' || label === 'Responder En Route' || label === 'Matched'
        ? C.blue
        : label === 'Submitted' || label === 'Under Review'
          ? C.orange
          : C.red;

  return (
    <View style={[styles.statusPill, { backgroundColor: `${color}16` }]}>
      <Text style={[styles.statusPillText, { color }]}>{label}</Text>
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

function getSeverityColor(severity: string) {
  if (severity === 'Critical' || severity === 'High') return C.red;
  if (severity === 'Medium') return C.orange;
  return C.green;
}

function getSeverityBg(severity: string) {
  if (severity === 'Critical' || severity === 'High') return C.redSoft;
  if (severity === 'Medium') return C.orangeSoft;
  return C.greenSoft;
}

function getIncidentIcon(type: string): keyof typeof Ionicons.glyphMap {
  if (type.includes('Fire')) return 'flame-outline';
  if (type.includes('Medical')) return 'medkit-outline';
  if (type.includes('Electricity')) return 'flash-outline';
  if (type.includes('Theft') || type.includes('Security')) return 'shield-checkmark-outline';
  if (type.includes('Misconduct')) return 'hand-left-outline';
  if (type.includes('Traffic')) return 'car-outline';
  if (type.includes('Facility')) return 'business-outline';
  if (type.includes('Sanitation')) return 'trash-outline';
  return 'alert-circle-outline';
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1 },
  header: {
    backgroundColor: C.green,
    paddingTop: HEADER_SAFE_TOP,
    paddingHorizontal: 18,
    paddingBottom: 22
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
  headerText: { flex: 1 },
  headerTitle: { color: '#FFFFFF', fontSize: 23, fontWeight: '900' },
  headerSubtitle: { color: 'rgba(255,255,255,0.78)', fontSize: 13, marginTop: 4 },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  metricCard: {
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
  metricIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  metricValue: { fontSize: 16, fontWeight: '900', marginTop: 8 },
  metricLabel: { color: C.muted, fontSize: 10.5, fontWeight: '700', marginTop: 2 },
  filterWrap: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 6,
    borderWidth: 1,
    borderColor: C.line,
    marginBottom: 16
  },
  filterChip: { flex: 1, minHeight: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  filterChipActive: { backgroundColor: C.green },
  filterText: { color: C.green, fontSize: 12, fontWeight: '900' },
  filterTextActive: { color: '#FFFFFF' },
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
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  sectionTitle: { color: C.text, fontSize: 18, fontWeight: '900' },
  sectionSubtitle: { color: C.muted, fontSize: 12.5, marginTop: 4, lineHeight: 18 },
  sectionActionButton: {
    borderRadius: 999,
    backgroundColor: C.greenSoft,
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginLeft: 10
  },
  sectionActionText: { color: C.green, fontSize: 12, fontWeight: '900' },
  reportCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#FAFBFC',
    padding: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  cardIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardTitle: { flex: 1, color: C.text, fontSize: 14.5, fontWeight: '900' },
  cardMeta: { color: C.green, fontSize: 11.5, fontWeight: '800', marginTop: 4 },
  cardDescription: { color: C.muted, fontSize: 12.2, lineHeight: 17, marginTop: 6 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  footerText: { color: C.muted, fontSize: 11, fontWeight: '700' },
  footerAction: { color: C.green, fontSize: 11.5, fontWeight: '900' },
  attachmentPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: C.greenSoft,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 8,
    gap: 5
  },
  attachmentText: { color: C.green, fontSize: 10.5, fontWeight: '900' },
  statusPill: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 5 },
  statusPillText: { fontSize: 9.5, fontWeight: '900' },
  emptyState: { alignItems: 'center', paddingVertical: 20 },
  emptyTitle: { color: C.text, fontSize: 15, fontWeight: '900', marginTop: 8 },
  emptyText: { color: C.muted, fontSize: 12, marginTop: 4 },
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