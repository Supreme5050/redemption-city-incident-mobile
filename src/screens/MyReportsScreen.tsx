import React, { useMemo, useState } from 'react';
import {
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
import { PremiumHeader } from '../components/PremiumHeader';
import { PremiumBottomTabs } from '../components/PremiumBottomTabs';

interface MyReportsScreenProps {
  incidents: Incident[];
  onNavigate: (screen: ScreenName) => void;
  onOpenIncident: (incident: Incident) => void;
}

type ReportTab = 'Active' | 'Resolved' | 'Drafts';

const tabs: ReportTab[] = ['Active', 'Resolved', 'Drafts'];

export function MyReportsScreen({ incidents, onNavigate, onOpenIncident }: MyReportsScreenProps) {
  const [activeTab, setActiveTab] = useState<ReportTab>('Active');

  const activeReports = useMemo(() => {
    if (activeTab === 'Resolved') return incidents.filter((incident) => incident.status === 'Resolved');
    if (activeTab === 'Drafts') return [];
    return incidents.filter((incident) => incident.status !== 'Resolved');
  }, [activeTab, incidents]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#1A4731" barStyle="light-content" />
      <PremiumHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>My Reports</Text>
        <Text style={styles.subtitle}>Track submitted incidents and follow-up actions.</Text>

        <View style={styles.statsCard}>
          <StatItem icon="calendar-outline" value="4" label="Active Reports" color="#1A4731" bg="#E8F5E9" />
          <View style={styles.divider} />
          <StatItem icon="checkmark-circle-outline" value="12" label="Resolved Reports" color="#2E7D32" bg="#E8F5E9" />
          <View style={styles.divider} />
          <StatItem icon="document-text-outline" value="3" label="Draft Reports" color="#F57C00" bg="#FFF3E0" />
        </View>

        <View style={styles.reportsPanel}>
          <View style={styles.tabRow}>
            {tabs.map((tab) => {
              const active = activeTab === tab;

              return (
                <TouchableOpacity
                  key={tab}
                  activeOpacity={0.84}
                  style={[styles.tabButton, active && styles.activeTabButton]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, active && styles.activeTabText]}>{tab}</Text>
                  <View style={[styles.tabCount, active && styles.activeTabCount]}>
                    <Text style={[styles.tabCountText, active && styles.activeTabCountText]}>
                      {tab === 'Active' ? '4' : tab === 'Resolved' ? '12' : '3'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {activeReports.map((incident) => (
            <ReportRow key={incident.id} incident={incident} onPress={() => onOpenIncident(incident)} />
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.newReportButton} onPress={() => onNavigate('report-step-one')}>
          <Ionicons name="add" size={26} color="#FFFFFF" />
          <Text style={styles.newReportText}>New Report</Text>
        </TouchableOpacity>
      </ScrollView>

      <PremiumBottomTabs active="reports" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function StatItem({
  icon,
  value,
  label,
  color,
  bg
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={25} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ReportRow({ incident, onPress }: { incident: Incident; onPress: () => void }) {
  const meta = getIncidentMeta(incident.type);
  const status = getStatusMeta(incident.status);

  return (
    <TouchableOpacity activeOpacity={0.86} style={styles.reportRow} onPress={onPress}>
      <View style={[styles.reportIconBox, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.icon} size={27} color={meta.color} />
      </View>

      <View style={styles.reportTextWrap}>
        <Text style={styles.reportId}>{incident.id}</Text>
        <Text style={styles.reportTitle}>{incident.type}</Text>
        <Text style={styles.reportLocation}>{incident.location}</Text>

        <View style={styles.reportDateRow}>
          <Ionicons name="calendar-outline" size={14} color="#6B7C74" />
          <Text style={styles.reportDate}>{incident.reportedAt}</Text>
        </View>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
        <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
      </View>

      <Ionicons name="chevron-forward" size={19} color="#6B7C74" />
    </TouchableOpacity>
  );
}

function getIncidentMeta(type: string): {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
} {
  if (type.includes('Medical')) return { icon: 'medkit-outline', color: '#C62828', bg: '#FFEBEE' };
  if (type.includes('Lost')) return { icon: 'person-add-outline', color: '#F57C00', bg: '#FFF3E0' };
  if (type.includes('Traffic')) return { icon: 'car-outline', color: '#6A1B9A', bg: '#F3E5F5' };
  if (type.includes('Security') || type.includes('Suspicious') || type.includes('Theft')) {
    return { icon: 'shield-checkmark-outline', color: '#1565C0', bg: '#E3F2FD' };
  }
  if (type.includes('Power')) return { icon: 'flash-outline', color: '#F57C00', bg: '#FFF3E0' };
  return { icon: 'alert-circle-outline', color: '#1A4731', bg: '#E8F5E9' };
}

function getStatusMeta(status: string) {
  if (status === 'Resolved') return { label: 'Resolved', color: '#2E7D32', bg: '#E8F5E9' };
  if (status === 'In Review') return { label: 'In Review', color: '#F57C00', bg: '#FFF3E0' };
  if (status === 'Assigned') return { label: 'Dispatched', color: '#1565C0', bg: '#E3F2FD' };
  if (status === 'Submitted') return { label: 'New', color: '#2E7D32', bg: '#E8F5E9' };
  return { label: status, color: '#1A4731', bg: '#E8F5E9' };
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F5'
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 24
  },
  title: {
    color: '#0D1F17',
    fontSize: 31,
    fontWeight: '800'
  },
  subtitle: {
    marginTop: 6,
    color: '#6B7C74',
    fontSize: 15,
    fontWeight: '400'
  },
  statsCard: {
    marginTop: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E7E3',
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800'
  },
  statLabel: {
    color: '#6B7C74',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2
  },
  divider: {
    width: 1,
    backgroundColor: '#E1E7E3',
    marginHorizontal: 8
  },
  reportsPanel: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E7E3',
    overflow: 'hidden'
  },
  tabRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E7E3',
    gap: 10
  },
  tabButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8
  },
  activeTabButton: {
    backgroundColor: '#1A4731'
  },
  tabText: {
    color: '#0D1F17',
    fontSize: 15,
    fontWeight: '700'
  },
  activeTabText: {
    color: '#FFFFFF'
  },
  tabCount: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeTabCount: {
    backgroundColor: 'rgba(255,255,255,0.18)'
  },
  tabCountText: {
    color: '#1A4731',
    fontSize: 12,
    fontWeight: '800'
  },
  activeTabCountText: {
    color: '#FFFFFF'
  },
  reportRow: {
    minHeight: 116,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EF',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  reportIconBox: {
    width: 62,
    height: 62,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reportTextWrap: {
    flex: 1
  },
  reportId: {
    color: '#0D1F17',
    fontSize: 18,
    fontWeight: '700'
  },
  reportTitle: {
    marginTop: 3,
    color: '#0D1F17',
    fontSize: 16,
    fontWeight: '600'
  },
  reportLocation: {
    marginTop: 3,
    color: '#6B7C74',
    fontSize: 13
  },
  reportDateRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  reportDate: {
    color: '#6B7C74',
    fontSize: 13
  },
  statusBadge: {
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700'
  },
  newReportButton: {
    alignSelf: 'center',
    marginTop: -2,
    width: 270,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#064D27',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    shadowColor: '#064D27',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5
  },
  newReportText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700'
  }
});