import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.logo, compact && styles.logoCompact]}>
        <Ionicons name="alert" size={compact ? 18 : 28} color={colors.white} />
      </View>
      {!compact && (
        <Text style={styles.title}>
          Incident Management{`\n`}Platform
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#7F1118',
    borderColor: colors.danger,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }]
  },
  logoCompact: {
    width: 42,
    height: 42,
    borderRadius: 14
  },
  title: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800'
  }
});
