import React, { useMemo, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Incident } from '../types/incident';
import { ScreenName } from '../types/navigation';
import { AppBrandLogo } from '../components/AppBrandLogo';

interface CommandMapScreenProps {
  incidents: Incident[];
  onNavigate: (screen: ScreenName) => void;
  onOpenIncident: (incident: Incident) => void;
}

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 28 : 0;

const C = {
  bg: '#020B18',
  card: '#071426',
  card2: '#0B1B31',
  border: 'rgba(255,255,255,0.1)',
  text: '#F7FAFC',
  muted: '#94A7BD',
  blue: '#2F80FF',
  red: '#FF4D4F',
  green: '#23D160',
  orange: '#FF8A1F',
  yellow: '#FFD43B',
  purple: '#A855F7',
  white: '#FFFFFF'
};

const REDEMPTION_CITY_REGION: Region = {
  latitude: 6.8165,
  longitude: 3.45974,
  latitudeDelta: 0.008,
  longitudeDelta: 0.008
};

function getFallbackIncidentCoordinate(index: number) {
  const points = [
    { latitude: 6.8165, longitude: 3.45974 },
    { latitude: 6.8171, longitude: 3.46035 },
    { latitude: 6.8158, longitude: 3.45908 },
    { latitude: 6.8161, longitude: 3.46112 },
    { latitude: 6.8176, longitude: 3.45872 }
  ];

  return points[index % points.length];
}

function getIncidentDisplay(type: string) {
  if (type.includes('Fire')) return { label: 'Fire', icon: 'flame-outline' as const, color: C.red };
  if (type.includes('Security') || type.includes('Theft')) return { label: 'Security', icon: 'shield-outline' as const, color: C.blue };
  if (type.includes('Medical')) return { label: 'Medical', icon: 'medical-outline' as const, color: C.green };
  if (type.includes('Electricity') || type.includes('Power')) return { label: 'Power', icon: 'flash-outline' as const, color: C.yellow };
  if (type.includes('Traffic')) return { label: 'Traffic', icon: 'car-outline' as const, color: C.orange };
  if (type.includes('Facility')) return { label: 'Facility', icon: 'business-outline' as const, color: C.purple };
  return { label: 'Other', icon: 'alert-circle-outline' as const, color: C.muted };
}

function getSeverityColor(severity: string) {
  if (severity === 'Critical') return C.red;
  if (severity === 'High') return C.orange;
  if (severity === 'Medium') return C.blue;
  if (severity === 'Low') return C.yellow;
  return C.green;
}

export function CommandMapScreen({ incidents, onNavigate, onOpenIncident }: CommandMapScreenProps) {
  const firstIncident = incidents[0] ?? null;
  const [selected, setSelected] = useState<Incident | null>(firstIncident);

  const selectedCoordinate = useMemo(() => {
    if (selected?.latitude && selected?.longitude) {
      return {
        latitude: selected.latitude,
        longitude: selected.longitude
      };
    }

    return REDEMPTION_CITY_REGION;
  }, [selected]);

  const mapRegion: Region = {
    latitude: selectedCoordinate.latitude,
    longitude: selectedCoordinate.longitude,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008
  };

  const selectedDisplay = selected ? getIncidentDisplay(String(selected.type)) : null;
  const selectedSeverityColor = selected ? getSeverityColor(selected.severity) : C.blue;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <View style={styles.header}>
        <AppBrandLogo size="small" />

        <View style={styles.headerText}>
          <Text style={styles.title}>Map View</Text>
          <Text style={styles.subtitle}>Live incident location overview</Text>
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.bellButton} onPress={() => onNavigate('alerts')}>
          <Ionicons name="notifications-outline" size={23} color={C.white} />
          <View style={styles.redDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapWrap}>
        <MapView
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={mapRegion}
          region={mapRegion}
          customMapStyle={darkMapStyle as any}
        >
          {incidents.map((incident, index) => {
            const coordinate =
              incident.latitude && incident.longitude
                ? { latitude: incident.latitude, longitude: incident.longitude }
                : getFallbackIncidentCoordinate(index);

            const display = getIncidentDisplay(String(incident.type));

            return (
              <Marker key={incident.id} coordinate={coordinate} onPress={() => setSelected(incident)}>
                <View style={[styles.markerOuter, { borderColor: display.color }]}>
                  <View style={[styles.markerInner, { backgroundColor: display.color }]}>
                    <Ionicons name={display.icon} size={17} color={C.white} />
                  </View>
                </View>
              </Marker>
            );
          })}
        </MapView>

        <View style={styles.livePill}>
          <Ionicons name="radio-outline" size={16} color={C.green} />
          <Text style={styles.livePillText}>Live map</Text>
          <View style={styles.greenDot} />
        </View>

        {selected && selectedDisplay ? (
          <View style={styles.bottomCard}>
            <View style={styles.cardTop}>
              <View style={[styles.cardIcon, { backgroundColor: `${selectedDisplay.color}22` }]}>
                <Ionicons name={selectedDisplay.icon} size={24} color={selectedDisplay.color} />
              </View>

              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {selected.title}
                </Text>

                <Text style={styles.cardMeta} numberOfLines={1}>
                  <Ionicons name="location-outline" size={12} color={C.muted} />{' '}
                  {selected.location || 'Pinned location'}
                </Text>
              </View>

              <View
                style={[
                  styles.severityPill,
                  {
                    backgroundColor: `${selectedSeverityColor}22`,
                    borderColor: `${selectedSeverityColor}55`
                  }
                ]}
              >
                <Text style={[styles.severityText, { color: selectedSeverityColor }]}>
                  {selected.severity.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.description} numberOfLines={2}>
              {selected.description || 'No description added yet.'}
            </Text>

            <View style={styles.cardBottom}>
              <View style={styles.miniStat}>
                <Text style={styles.miniStatLabel}>ETA</Text>
                <Text style={styles.miniStatValue}>{selected.responseEta || '8–15 mins'}</Text>
              </View>

              <View style={styles.miniStat}>
                <Text style={styles.miniStatLabel}>Status</Text>
                <Text style={styles.miniStatValue} numberOfLines={1}>
                  {selected.status}
                </Text>
              </View>

              <TouchableOpacity activeOpacity={0.9} style={styles.detailsButton} onPress={() => onOpenIncident(selected)}>
                <Text style={styles.detailsText}>Details</Text>
                <Ionicons name="chevron-forward" size={17} color={C.blue} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>

      <BottomTabs active="map" onNavigate={onNavigate} />
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

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#071524' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8FA7BF' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#020B18' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1E3448' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#243B52' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0B2540' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#0B1A2A' }] }
];

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg
  },
  header: {
    paddingTop: STATUS_BAR_HEIGHT + 12,
    paddingHorizontal: 18,
    paddingBottom: 14,
    backgroundColor: C.bg,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerText: {
    flex: 1,
    marginLeft: 12
  },
  title: {
    color: C.text,
    fontSize: 22,
    fontWeight: '900'
  },
  subtitle: {
    color: C.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2
  },
  bellButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  redDot: {
    position: 'absolute',
    right: 8,
    top: 7,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.red
  },
  mapWrap: {
    flex: 1
  },
  map: {
    flex: 1
  },
  livePill: {
    position: 'absolute',
    top: 14,
    left: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(2,11,24,0.9)',
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 11,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  livePillText: {
    color: C.text,
    fontSize: 12,
    fontWeight: '900',
    marginHorizontal: 7
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.green
  },
  markerOuter: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  markerInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomCard: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 88,
    borderRadius: 20,
    backgroundColor: 'rgba(7,20,38,0.97)',
    borderWidth: 1,
    borderColor: C.border,
    padding: 12
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  cardIcon: {
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  cardTextWrap: {
    flex: 1,
    marginRight: 8
  },
  cardTitle: {
    color: C.text,
    fontSize: 15,
    fontWeight: '900'
  },
  cardMeta: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3
  },
  severityPill: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  severityText: {
    fontSize: 9.5,
    fontWeight: '900'
  },
  description: {
    color: C.muted,
    fontSize: 12.5,
    lineHeight: 17,
    marginBottom: 10
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  miniStat: {
    flex: 1,
    minHeight: 42,
    borderRadius: 13,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'center',
    paddingHorizontal: 9
  },
  miniStatLabel: {
    color: C.muted,
    fontSize: 9.5,
    fontWeight: '800'
  },
  miniStatValue: {
    color: C.text,
    fontSize: 11.5,
    fontWeight: '900',
    marginTop: 2
  },
  detailsButton: {
    minHeight: 42,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: C.blue,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailsText: {
    color: C.blue,
    fontWeight: '900',
    fontSize: 12,
    marginRight: 4
  },
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
  tabItem: {
    flex: 1,
    alignItems: 'center'
  },
  tabBadge: {
    position: 'absolute',
    top: -9,
    right: -13,
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabBadgeText: {
    color: C.white,
    fontSize: 10,
    fontWeight: '900'
  },
  tabLabel: {
    color: C.muted,
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 3
  },
  tabLabelActive: {
    color: C.blue
  }
});