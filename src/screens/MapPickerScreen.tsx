import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import * as Location from 'expo-location';
import { DraftIncident } from '../types/incident';
import { ScreenName } from '../types/navigation';

interface MapPickerScreenProps {
  draft: DraftIncident;
  setDraft: React.Dispatch<React.SetStateAction<DraftIncident>>;
  onNavigate: (screen: ScreenName) => void;
}

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 28 : 0;

const DEFAULT_REGION: Region = {
  latitude: 6.8152,
  longitude: 3.4894,
  latitudeDelta: 0.018,
  longitudeDelta: 0.018
};

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
  white: '#FFFFFF'
};

async function reverseAddress(latitude: number, longitude: number) {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    const first = results[0];

    if (!first) return 'Pinned location, Redemption City Camp';

    const parts = [first.name, first.street, first.district, first.city].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Pinned location, Redemption City Camp';
  } catch {
    return 'Pinned location, Redemption City Camp';
  }
}

export function MapPickerScreen({ draft, setDraft, onNavigate }: MapPickerScreenProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [region, setRegion] = useState<Region>({
    ...DEFAULT_REGION,
    latitude: draft.latitude ?? DEFAULT_REGION.latitude,
    longitude: draft.longitude ?? DEFAULT_REGION.longitude
  });

  async function useCurrentLocation() {
    setIsLocating(true);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert('Location permission needed', 'Please allow location access to pick your current location.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const { latitude, longitude } = position.coords;
      const address = await reverseAddress(latitude, longitude);

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });

      setDraft((current) => ({
        ...current,
        location: 'Current pinned location',
        address,
        latitude,
        longitude
      }));
    } finally {
      setIsLocating(false);
    }
  }

  async function dropPin(latitude: number, longitude: number) {
    const address = await reverseAddress(latitude, longitude);

    setDraft((current) => ({
      ...current,
      location: 'Dropped pin location',
      address,
      latitude,
      longitude
    }));
  }

  function confirmLocation() {
    if (!draft.latitude || !draft.longitude) {
      Alert.alert('No location selected', 'Use current location or tap the map to drop a pin.');
      return;
    }

    onNavigate('report-step-two');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} style={styles.headerButton} onPress={() => onNavigate('report-step-two')}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>Pick Incident Location</Text>
          <Text style={styles.subtitle}>Drop a pin exactly where the incident happened.</Text>
        </View>
      </View>

      <View style={styles.mapWrap}>
        <MapView
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={region}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={(event: any) => {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            dropPin(latitude, longitude);
          }}
          customMapStyle={darkMapStyle as any}
        >
          {draft.latitude && draft.longitude ? (
            <Marker
              coordinate={{
                latitude: draft.latitude,
                longitude: draft.longitude
              }}
              title="Incident location"
              description={draft.address}
            />
          ) : null}
        </MapView>

        <View style={styles.mapHint}>
          <Ionicons name="map-outline" size={17} color={C.blue} />
          <Text style={styles.mapHintText}>Tap map to drop pin</Text>
        </View>

        <TouchableOpacity activeOpacity={0.88} style={styles.locateButton} onPress={useCurrentLocation}>
          {isLocating ? <ActivityIndicator color={C.white} /> : <Ionicons name="locate" size={24} color={C.white} />}
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        <View style={styles.locationRow}>
          <View style={styles.locationIcon}>
            <Ionicons name="location" size={28} color={C.blue} />
          </View>

          <View style={styles.flex}>
            <Text style={styles.locationTitle}>{draft.location || 'No pin selected yet'}</Text>
            <Text style={styles.locationText}>{draft.address || 'Use current location or tap the map.'}</Text>

            {draft.latitude && draft.longitude ? (
              <Text style={styles.coordinateText}>
                {draft.latitude.toFixed(5)} N, {draft.longitude.toFixed(5)} E
              </Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.confirmButton} onPress={confirmLocation}>
          <Ionicons name="checkmark-circle-outline" size={22} color={C.white} />
          <Text style={styles.confirmText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#071524' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8FA7BF' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#020B14' }] },
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
  mapHint: {
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
  mapHintText: {
    color: C.text,
    fontSize: 12,
    fontWeight: '800'
  },
  locateButton: {
    position: 'absolute',
    right: 18,
    top: 16,
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: C.blue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomSheet: {
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  locationIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(47,128,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  locationTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: '900'
  },
  locationText: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3
  },
  coordinateText: {
    color: C.muted,
    fontSize: 12,
    marginTop: 4
  },
  confirmButton: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: C.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  confirmText: {
    color: C.white,
    fontSize: 16,
    fontWeight: '900'
  }
});