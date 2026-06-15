import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface ProgressStepsProps {
  step: 1 | 2;
}

export function ProgressSteps({ step }: ProgressStepsProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Text style={styles.stepText}>Step {step} of 2</Text>
        <Text style={styles.percent}>{step === 1 ? '50%' : '100%'}</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: step === 1 ? '50%' : '100%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    marginBottom: 12
  },
  topRow: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stepText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900'
  },
  percent: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '900'
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: 'hidden'
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary
  }
});