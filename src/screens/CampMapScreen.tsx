import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenName } from '../types/navigation';
import { PremiumHeader } from '../components/PremiumHeader';
import { PremiumBottomTabs } from '../components/PremiumBottomTabs';

interface CampMapScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type MapFilter = 'Incidents' | 'Response Teams' | 'Assets' | 'Safe Routes';

const filters: Array<{ label: MapFilter; icon: keyof typeof Ionicons.glyphMap }> = [
  { label: 'Incidents', icon: 'alert-circle-outline' },
  { label: 'Response Teams', icon: 'people-outline' },
  { label: 'Assets', icon: 'bus-outline' },
  { label: 'Safe Routes', icon: 'git-branch-outline' }
];

export function CampMapScreen({ onNavigate }: CampMapScreenProps) {
  const [activeFilter, setActiveFilter] = useState<MapFilter>('Incidents');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#1A4731" barStyle="light-content" />
      <PremiumHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Camp Map & Zones</Text>
        <Text style={styles.subtitle}>View zones, live incidents, teams, assets and safe routes.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((filter) => {
            const active = activeFilter === filter.label;

            return (
              <TouchableOpacity
                key={filter.label}
                activeOpacity={0.85}
                onPress={() => setActiveFilter(filter.label)}
                style={[styles.filterPill, active && styles.activeFilterPill]}
              >
                <Ionicons name={filter.icon} size={18} color={active ? '#FFFFFF' : '#0D1F17'} />
                <Text style={[styles.filterText, active && styles.activeFilterText]}>{filter.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.mapCard}>
          <View style={styles.mapControlsLeft}>
            <MapControl icon="add" />
            <MapControl icon="remove" />
            <MapControl icon="locate-outline" />
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.layersButton}>
            <Ionicons name="layers-outline" size={24} color="#0D1F17" />
          </TouchableOpacity>

          <View style={styles.zoneA}>
            <Text style={styles.zoneLabel}>PIONEER ZONE</Text>
            <View style={[styles.zonePin, { backgroundColor: '#F57C00' }]}>
              <Text style={styles.zonePinText}>2</Text>
            </View>
          </View>

          <View style={styles.zoneB}>
            <Text style={[styles.zoneLabel, { backgroundColor: '#1565C0' }]}>LAKEVIEW ZONE</Text>
            <Ionicons name="location" size={40} color="#C62828" />
          </View>

          <View style={styles.zoneC}>
            <Text style={[styles.zoneLabel, { backgroundColor: '#C62828' }]}>PINE RIDGE ZONE</Text>
            <Ionicons name="location" size={40} color="#C62828" />
          </View>

          <View style={styles.zoneD}>
            <Text style={[styles.zoneLabel, { backgroundColor: '#1A4731' }]}>RIVERSIDE ZONE</Text>
            <Ionicons name="shield-checkmark" size={40} color="#1A4731" />
          </View>
        </View>

        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Incident Legend</Text>

          <View style={styles.legendRow}>
            <LegendItem color="#C62828" label="Critical" />
            <LegendItem color="#F57C00" label="High" />
            <LegendItem color="#E6A400" label="Medium" />
            <LegendItem color="#1565C0" label="Low" />
            <LegendItem color="#1A4731" label="All Clear" />
          </View>
        </View>

        <View style={styles.zoneOverviewCard}>
          <Text style={styles.sectionTitle}>Zone Overview</Text>

          <ZoneRow color="#1565C0" title="Lakeview Zone" subtitle="1 active incident" status="High" statusColor="#C62828" />
          <ZoneRow color="#F57C00" title="Pioneer Zone" subtitle="2 active incidents" status="Medium" statusColor="#F57C00" />
          <ZoneRow color="#C62828" title="Pine Ridge Zone" subtitle="1 critical alert" status="Critical" statusColor="#C62828" />
          <ZoneRow color="#1A4731" title="Riverside Zone" subtitle="All clear" status="All Clear" statusColor="#2E7D32" />
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.openMapButton}>
          <Ionicons name="map-outline" size={23} color="#FFFFFF" />
          <Text style={styles.openMapText}>Open Full Map</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>

      <PremiumBottomTabs active="map" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function MapControl({ icon }: { icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.mapControl}>
      <Ionicons name={icon} size={22} color="#0D1F17" />
    </TouchableOpacity>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <Ionicons name="location" size={18} color={color} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function ZoneRow({
  color,
  title,
  subtitle,
  status,
  statusColor
}: {
  color: string;
  title: string;
  subtitle: string;
  status: string;
  statusColor: string;
}) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.zoneRow}>
      <Ionicons name="shield-outline" size={31} color={color} />

      <View style={styles.zoneTextWrap}>
        <Text style={styles.zoneTitle}>{title}</Text>
        <Text style={styles.zoneSubtitle}>{subtitle}</Text>
      </View>

      <View style={[styles.zoneStatus, { backgroundColor: `${statusColor}12` }]}>
        <Text style={[styles.zoneStatusText, { color: statusColor }]}>{status}</Text>
      </View>

      <Ionicons name="chevron-forward" size={19} color="#6B7C74" />
    </TouchableOpacity>
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
    color: '#6B7C74',
    fontSize: 15,
    marginTop: 5
  },
  filterRow: {
    paddingTop: 22,
    gap: 12
  },
  filterPill: {
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D8E0DC',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  activeFilterPill: {
    backgroundColor: '#1A4731',
    borderColor: '#1A4731'
  },
  filterText: {
    color: '#0D1F17',
    fontSize: 14,
    fontWeight: '700'
  },
  activeFilterText: {
    color: '#FFFFFF'
  },
  mapCard: {
    marginTop: 22,
    height: 390,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#DDEBDC',
    borderWidth: 1,
    borderColor: '#D8E0DC'
  },
  mapControlsLeft: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden'
  },
  mapControl: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EF'
  },
  layersButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 5,
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  zoneA: {
    position: 'absolute',
    top: 70,
    left: 86,
    width: 190,
    height: 145,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#F57C00',
    backgroundColor: 'rgba(245,124,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  zoneB: {
    position: 'absolute',
    top: 58,
    right: 45,
    width: 210,
    height: 155,
    borderRadius: 95,
    borderWidth: 2,
    borderColor: '#1565C0',
    backgroundColor: 'rgba(21,101,192,0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  zoneC: {
    position: 'absolute',
    bottom: 86,
    left: 45,
    width: 220,
    height: 150,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#C62828',
    backgroundColor: 'rgba(198,40,40,0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  zoneD: {
    position: 'absolute',
    bottom: 80,
    right: 54,
    width: 220,
    height: 150,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#1A4731',
    backgroundColor: 'rgba(26,71,49,0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  zoneLabel: {
    color: '#FFFFFF',
    backgroundColor: '#F57C00',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden'
  },
  zonePin: {
    marginTop: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  zonePinText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800'
  },
  legendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E1E7E3',
    padding: 14,
    marginTop: -4
  },
  legendTitle: {
    color: '#0D1F17',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  legendText: {
    color: '#0D1F17',
    fontSize: 12,
    fontWeight: '600'
  },
  zoneOverviewCard: {
    marginTop: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E7E3',
    padding: 14
  },
  sectionTitle: {
    color: '#0D1F17',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12
  },
  zoneRow: {
    minHeight: 72,
    borderTopWidth: 1,
    borderTopColor: '#EEF1EF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  zoneTextWrap: {
    flex: 1
  },
  zoneTitle: {
    color: '#0D1F17',
    fontSize: 15,
    fontWeight: '800'
  },
  zoneSubtitle: {
    color: '#6B7C74',
    fontSize: 13,
    marginTop: 3
  },
  zoneStatus: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  zoneStatusText: {
    fontSize: 12,
    fontWeight: '800'
  },
  openMapButton: {
    marginTop: 18,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#064D27',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14
  },
  openMapText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800'
  }
});