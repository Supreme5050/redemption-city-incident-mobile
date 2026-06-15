import React, { useMemo } from 'react';
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
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Incident } from '../types/incident';
import { ScreenName } from '../types/navigation';

interface RouteNavigationScreenProps {
  incident: Incident;
  onNavigate: (screen: ScreenName) => void;
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
  white: '#FFFFFF'
};

const FALLBACK_USER_LOCATION = {
  latitude: 6.8129,
  longitude: 3.4866
};

function getSeverityColor(severity: string) {
  if (severity === 'Critical') return C.red;
  if (severity === 'High') return C.orange;
  if (severity === 'Medium') return C.blue;
  return C.green;
}

function getDistanceKm(start: { latitude: number; longitude: number }, end: { latitude: number; longitude: number }) {
  const earthRadiusKm = 6371;
  const dLat = ((end.latitude - start.latitude) * Math.PI) / 180;
  const dLon = ((end.longitude - start.longitude) * Math.PI) / 180;
  const lat1 = (start.latitude * Math.PI) / 180;
  const lat2 = (end.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

export function RouteNavigationScreen({ incident, onNavigate }: RouteNavigationScreenProps) {
  const incidentCoordinate = {
    latitude: incident.latitude ?? 6.8152,
    longitude: incident.longitude ?? 3.4894
  };

  const routeCoordinates = [FALLBACK_USER_LOCATION, incidentCoordinate];

  const distance = useMemo(() => getDistanceKm(FALLBACK_USER_LOCATION, incidentCoordinate), [incidentCoordinate.latitude, incidentCoordinate.longitude]);

  const eta = Math.max(3, Math.round(distance * 8));

  const region: Region = {
    latitude: (FALLBACK_USER_LOCATION.latitude + incidentCoordinate.latitude) / 2,
    longitude: (FALLBACK_USER_LOCATION.longitude + incidentCoordinate.longitude) / 2,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02
  };

  const severityColor = getSeverityColor(incident.severity);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} style={styles.headerButton} onPress={() => onNavigate('report-details')}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>Route to Incident</Text>
          <Text style={styles.subtitle}>{incident.location}</Text>
        </View>
      </View>

      <View style={styles.mapWrap}>
        <MapView
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={region}
          customMapStyle={darkMapStyle as any}
        >
          <Marker coordinate={FALLBACK_USER_LOCATION} title="Your current position">
            <View style={styles.userMarker}>
              <Ionicons name="navigate" size={19} color={C.white} />
            </View>
          </Marker>

          <Marker coordinate={incidentCoordinate} title={incident.title} description={incident.location}>
            <View style={[styles.incidentMarker, { backgroundColor: severityColor }]}>
              <Ionicons name="warning" size={20} color={C.white} />
            </View>
          </Marker>

          <Polyline coordinates={routeCoordinates} strokeColor={C.blue} strokeWidth={5} />
        </MapView>

        <View style={styles.topPill}>
          <Ionicons name="radio-outline" size={18} color={C.green} />
          <Text style={styles.topPillText}>Route preview active</Text>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.sheetHandle} />

          <View style={styles.routeHeader}>
            <View style={[styles.routeIcon, { backgroundColor: `${severityColor}22` }]}>
              <Ionicons name="warning-outline" size={28} color={severityColor} />
            </View>

            <View style={styles.flex}>
              <Text style={styles.incidentTitle}>{incident.title}</Text>
              <Text style={styles.incidentMeta}>{incident.location}</Text>
            </View>

            <View style={[styles.severityBadge, { backgroundColor: `${severityColor}22` }]}>
              <Text style={[styles.severityText, { color: severityColor }]}>{incident.severity.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.routeStats}>
            <RouteStat icon="time-outline" label="ETA" value={`${eta} min`} />
            <RouteStat icon="map-outline" label="Distance" value={`${distance.toFixed(1)} km`} />
            <RouteStat icon="navigate-outline" label="Status" value="Ready" />
          </View>

          <TouchableOpacity activeOpacity={0.9} style={styles.startButton}>
            <Ionicons name="navigate" size={22} color={C.white} />
            <Text style={styles.startButtonText}>Start Navigation</Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            MVP note: route line is a preview. Real turn-by-turn routing can be connected later with a routing API.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function RouteStat({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.routeStat}>
      <Ionicons name={icon} size={20} color={C.blue} />
      <Text style={styles.routeStatLabel}>{label}</Text>
      <Text style={styles.routeStatValue}>{value}</Text>
    </View>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#071524' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8FA7BF' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#020B18' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1E3448' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0B2540' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#0B1A2A' }] }
];

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg
  },
  flex: {
    flex: 1
  },
  header: {
    paddingTop: STATUS_BAR_HEIGHT + 12,
    paddingHorizontal: 18,
    paddingBottom: 14,
    backgroundColor: C.bg,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  headerText: {
    flex: 1
  },
  title: {
    color: C.text,
    fontSize: 22,
    fontWeight: '900'
  },
  subtitle: {
    color: C.muted,
    fontSize: 13,
    marginTop: 3
  },
  mapWrap: {
    flex: 1
  },
  map: {
    flex: 1
  },
  userMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.blue,
    borderWidth: 2,
    borderColor: C.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  incidentMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: C.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topPill: {
    position: 'absolute',
    top: 16,
    left: 18,
    borderRadius: 999,
    backgroundColor: 'rgba(2,11,24,0.88)',
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  topPillText: {
    color: C.text,
    fontSize: 12,
    fontWeight: '800'
  },
  routeCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(7,20,38,0.97)',
    borderWidth: 1,
    borderColor: C.border,
    padding: 16
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 52,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    marginBottom: 16
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  routeIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  incidentTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: '900'
  },
  incidentMeta: {
    color: C.muted,
    fontSize: 13,
    marginTop: 3
  },
  severityBadge: {
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6
  },
  severityText: {
    fontSize: 10.5,
    fontWeight: '900'
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  routeStat: {
    width: '31.5%',
    borderRadius: 16,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 12,
    alignItems: 'center'
  },
  routeStatLabel: {
    color: C.muted,
    fontSize: 11,
    marginTop: 5
  },
  routeStatValue: {
    color: C.text,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 3
  },
  startButton: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: C.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  startButtonText: {
    color: C.white,
    fontSize: 16,
    fontWeight: '900'
  },
  note: {
    color: C.muted,
    fontSize: 11.5,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 12
  }
});