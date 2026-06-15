import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface MiniMapProps {
  label: string;
}

export function MiniMap({ label }: MiniMapProps) {
  return (
    <View style={styles.map}>
      <Text style={[styles.mapLabel, styles.labelOne]}>Main Auditorium</Text>
      <Text style={[styles.mapLabel, styles.labelTwo]}>Diligence Road</Text>
      <Text style={[styles.mapLabel, styles.labelThree]}>Clinic Area</Text>

      <View style={styles.roadOne} />
      <View style={styles.roadTwo} />
      <View style={styles.roadThree} />

      <View style={styles.pin}>
        <Ionicons name="location" size={38} color={colors.primary} />
      </View>

      <View style={styles.addressCard}>
        <Ionicons name="location-outline" size={23} color={colors.primary} />
        <View style={styles.addressTextWrap}>
          <Text style={styles.addressTitle}>{label}</Text>
          <Text style={styles.addressSubtitle}>Redemption City Camp</Text>
        </View>
        <Ionicons name="chevron-forward" size={17} color={colors.textMuted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 174,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSoft,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  roadOne: {
    position: 'absolute',
    width: '130%',
    height: 3,
    backgroundColor: '#CEDCCD',
    transform: [{ rotate: '-14deg' }]
  },
  roadTwo: {
    position: 'absolute',
    width: 3,
    height: '135%',
    backgroundColor: '#D8E4D8',
    transform: [{ rotate: '7deg' }]
  },
  roadThree: {
    position: 'absolute',
    width: '130%',
    height: 3,
    backgroundColor: '#CFE0D1',
    transform: [{ rotate: '20deg' }]
  },
  mapLabel: {
    position: 'absolute',
    color: '#6C7C6C',
    fontSize: 10,
    fontWeight: '800'
  },
  labelOne: {
    top: 24,
    left: 22
  },
  labelTwo: {
    top: 56,
    right: 22
  },
  labelThree: {
    bottom: 82,
    left: 38
  },
  pin: {
    marginBottom: 34
  },
  addressCard: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,
    minHeight: 58,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9
  },
  addressTextWrap: {
    flex: 1
  },
  addressTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900'
  },
  addressSubtitle: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600'
  }
});