import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IncidentSeverity, IncidentStatus } from '../types/incident';
import { severityColors, statusColors } from '../utils/incidentMeta';

interface BadgeProps {
  label: IncidentSeverity | IncidentStatus;
  type: 'severity' | 'status';
}

export function Badge({ label, type }: BadgeProps) {
  const color = type === 'severity' ? severityColors[label as IncidentSeverity] : statusColors[label as IncidentStatus];

  return (
    <View style={[styles.badge, { backgroundColor: `${color}16`, borderColor: `${color}55` }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    minHeight: 27,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 12,
    fontWeight: '900'
  }
});