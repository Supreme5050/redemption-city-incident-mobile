import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from './Badge';
import { colors } from '../theme/colors';
import { Incident } from '../types/incident';
import { incidentTypeMeta } from '../utils/incidentMeta';

interface IncidentListCardProps {
  incident: Incident;
  compact?: boolean;
  onPress: () => void;
}

export function IncidentListCard({ incident, compact = false, onPress }: IncidentListCardProps) {
  const meta = incidentTypeMeta[incident.type];

  return (
    <TouchableOpacity activeOpacity={0.84} onPress={onPress} style={styles.card}>
      <View style={[styles.iconBox, { borderColor: `${meta.color}55`, backgroundColor: `${meta.color}12` }]}>
        <Ionicons name={meta.icon} size={24} color={meta.color} />
      </View>

      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={compact ? 1 : 2}>
          {incident.title}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={styles.metaText} numberOfLines={1}>
            {incident.location}
          </Text>
        </View>

        <Text style={styles.dateText}>{incident.reportedAt}</Text>
      </View>

      <View style={styles.right}>
        <Badge label={incident.status} type="status" />
        <Badge label={incident.severity} type="severity" />
        {compact && <Text style={styles.distance}>{incident.distanceKm.toFixed(1)} km</Text>}
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  middle: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900'
  },
  metaRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700'
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4
  },
  right: {
    gap: 5,
    alignItems: 'flex-end'
  },
  distance: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900'
  }
});