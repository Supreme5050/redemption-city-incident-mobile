import React, { useState } from 'react';
import {
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
import { Incident } from '../types/incident';
import { PremiumHeader } from '../components/PremiumHeader';
import { PremiumBottomTabs } from '../components/PremiumBottomTabs';

interface AlertsScreenProps {
  onNavigate: (screen: ScreenName) => void;
  onOpenIncident: (incident: Incident) => void;
}

type AlertFilter = 'All' | 'Critical' | 'High' | 'New' | 'Resolved';

const filters: AlertFilter[] = ['All', 'Critical', 'High', 'New', 'Resolved'];

const alertItems = [
  {
    title: 'Medical Emergency',
    location: 'Clinic Area • First Aid Point',
    time: '10:10 AM',
    severity: 'Critical',
    status: 'Dispatched',
    icon: 'medkit-outline' as keyof typeof Ionicons.glyphMap,
    color: '#C62828',
    bg: '#FFEBEE'
  },
  {
    title: 'Lost Child',
    location: 'Main Auditorium • Entrance',
    time: '10:12 AM',
    severity: 'High',
    status: 'In Review',
    icon: 'person-add-outline' as keyof typeof Ionicons.glyphMap,
    color: '#F57C00',
    bg: '#FFF3E0'
  },
  {
    title: 'Power Fault',
    location: 'Diligence Road • Residential Axis',
    time: '09:41 AM',
    severity: 'Medium',
    status: 'New',
    icon: 'flash-outline' as keyof typeof Ionicons.glyphMap,
    color: '#F57C00',
    bg: '#FFF3E0'
  },
  {
    title: 'Security Concern',
    location: 'Chalet Area • Parking Side',
    time: '09:03 AM',
    severity: 'High',
    status: 'Open',
    icon: 'shield-checkmark-outline' as keyof typeof Ionicons.glyphMap,
    color: '#1565C0',
    bg: '#E3F2FD'
  }
];

export function AlertsScreen({ onNavigate }: AlertsScreenProps) {
  const [activeFilter, setActiveFilter] = useState<AlertFilter>('All');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#1A4731" barStyle="light-content" />
      <PremiumHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Live Alerts</Text>
        <Text style={styles.subtitle}>Monitor current incidents across Redemption City Camp.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((filter) => {
            const active = activeFilter === filter;

            return (
              <TouchableOpacity
                key={filter}
                activeOpacity={0.85}
                onPress={() => setActiveFilter(filter)}
                style={[styles.filterPill, active && styles.activeFilterPill]}
              >
                <Text style={[styles.filterText, active && styles.activeFilterText]}>{filter}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={22} color="#6B7C74" />
            <TextInput
              placeholder="Search alerts by type, area, or keyword"
              placeholderTextColor="#8D9993"
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.filterButton}>
            <Ionicons name="options-outline" size={23} color="#0D1F17" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <AlertStat icon="pulse-outline" value="8" label="Active Alerts" caption="Across camp zones" color="#C62828" bg="#FFEBEE" />
          <View style={styles.divider} />
          <AlertStat icon="alert-circle-outline" value="3" label="Critical" caption="Need attention" color="#C62828" bg="#FFEBEE" />
          <View style={styles.divider} />
          <AlertStat icon="checkmark-circle-outline" value="32" label="Resolved" caption="Today" color="#2E7D32" bg="#E8F5E9" />
        </View>

        <View style={styles.alertList}>
          {alertItems.map((item) => (
            <AlertRow key={`${item.title}-${item.time}`} item={item} />
          ))}
        </View>

        <View style={styles.safetyCard}>
          <View style={styles.safetyIcon}>
            <Ionicons name="shield-checkmark-outline" size={34} color="#FFFFFF" />
          </View>

          <View style={styles.safetyTextWrap}>
            <Text style={styles.safetyTitle}>Your safety is our priority</Text>
            <Text style={styles.safetyText}>
              The admin control desk monitors reports and routes verified incidents to the right unit.
            </Text>
          </View>
        </View>
      </ScrollView>

      <PremiumBottomTabs active="alerts" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function AlertStat({
  icon,
  value,
  label,
  caption,
  color,
  bg
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  caption: string;
  color: string;
  bg: string;
}) {
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={25} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statCaption}>{caption}</Text>
    </View>
  );
}

function AlertRow({ item }: { item: typeof alertItems[number] }) {
  return (
    <TouchableOpacity activeOpacity={0.86} style={styles.alertRow}>
      <View style={[styles.alertIconBox, { backgroundColor: item.bg }]}>
        <Ionicons name={item.icon} size={26} color={item.color} />
      </View>

      <View style={styles.alertMain}>
        <Text style={styles.alertTitle}>{item.title}</Text>
        <Text style={styles.alertLocation}>{item.location}</Text>
      </View>

      <View style={styles.alertRight}>
        <Text style={styles.alertTime}>{item.time}</Text>

        <View style={styles.badgeRow}>
          <SmallBadge label={item.severity} color={item.color} />
          <SmallBadge label={item.status} color={item.status === 'Resolved' ? '#2E7D32' : '#1565C0'} />
        </View>
      </View>

      <Ionicons name="chevron-forward" size={19} color="#6B7C74" />
    </TouchableOpacity>
  );
}

function SmallBadge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.smallBadge, { backgroundColor: `${color}12` }]}>
      <Text style={[styles.smallBadgeText, { color }]}>{label}</Text>
    </View>
  );
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
    fontSize: 30,
    fontWeight: '800'
  },
  subtitle: {
    marginTop: 5,
    color: '#6B7C74',
    fontSize: 15
  },
  filterRow: {
    paddingTop: 22,
    gap: 12
  },
  filterPill: {
    minWidth: 104,
    height: 43,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E0DC',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18
  },
  activeFilterPill: {
    backgroundColor: '#1A4731',
    borderColor: '#1A4731'
  },
  filterText: {
    color: '#0D1F17',
    fontSize: 15,
    fontWeight: '600'
  },
  activeFilterText: {
    color: '#FFFFFF'
  },
  searchRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 12
  },
  searchBox: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE5E0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  searchInput: {
    flex: 1,
    color: '#0D1F17',
    fontSize: 14
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE5E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statsCard: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E7E3',
    padding: 16,
    flexDirection: 'row',
    elevation: 3
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statValue: {
    color: '#0D1F17',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 8
  },
  statLabel: {
    color: '#0D1F17',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
    textAlign: 'center'
  },
  statCaption: {
    color: '#6B7C74',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center'
  },
  divider: {
    width: 1,
    backgroundColor: '#E1E7E3',
    marginHorizontal: 8
  },
  alertList: {
    marginTop: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E7E3',
    overflow: 'hidden'
  },
  alertRow: {
    minHeight: 90,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  alertIconBox: {
    width: 52,
    height: 52,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  alertMain: {
    flex: 1
  },
  alertTitle: {
    color: '#0D1F17',
    fontSize: 17,
    fontWeight: '700'
  },
  alertLocation: {
    color: '#6B7C74',
    fontSize: 13,
    marginTop: 5
  },
  alertRight: {
    alignItems: 'flex-end',
    gap: 8
  },
  alertTime: {
    color: '#6B7C74',
    fontSize: 13
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6
  },
  smallBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  smallBadgeText: {
    fontSize: 12,
    fontWeight: '700'
  },
  safetyCard: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E7E3',
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center'
  },
  safetyIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#1A4731',
    alignItems: 'center',
    justifyContent: 'center'
  },
  safetyTextWrap: {
    flex: 1
  },
  safetyTitle: {
    color: '#0D1F17',
    fontSize: 17,
    fontWeight: '800'
  },
  safetyText: {
    color: '#6B7C74',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5
  }
});