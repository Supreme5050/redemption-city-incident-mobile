import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface RedemptionLogoProps {
  compact?: boolean;
}

export function RedemptionLogo({ compact = false }: RedemptionLogoProps) {
  return (
    <View style={[styles.logoWrap, compact && styles.logoWrapCompact]}>
      <View style={[styles.shield, compact && styles.shieldCompact]}>
        <View style={styles.doveBody} />
        <View style={styles.doveWingLeft} />
        <View style={styles.doveWingRight} />
        <View style={styles.doveTail} />
      </View>

      {!compact && (
        <View>
          <Text style={styles.title}>REDEMPTION</Text>
          <Text style={styles.title}>CITY CAMP</Text>
          <Text style={styles.subtitle}>INCIDENT MANAGEMENT</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  logoWrapCompact: {
    gap: 0
  },
  shield: {
    width: 50,
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.headerGreen,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shieldCompact: {
    width: 44,
    height: 50,
    borderRadius: 14
  },
  doveBody: {
    width: 9,
    height: 20,
    borderRadius: 999,
    backgroundColor: colors.white,
    transform: [{ rotate: '-8deg' }]
  },
  doveWingLeft: {
    position: 'absolute',
    left: 14,
    top: 17,
    width: 16,
    height: 8,
    borderTopLeftRadius: 14,
    borderBottomRightRadius: 14,
    backgroundColor: colors.white,
    transform: [{ rotate: '-28deg' }]
  },
  doveWingRight: {
    position: 'absolute',
    right: 13,
    top: 17,
    width: 16,
    height: 8,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 14,
    backgroundColor: colors.white,
    transform: [{ rotate: '28deg' }]
  },
  doveTail: {
    position: 'absolute',
    bottom: 14,
    width: 13,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.gold
  },
  title: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
    letterSpacing: 1.6
  },
  subtitle: {
    marginTop: 3,
    color: colors.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5
  }
});