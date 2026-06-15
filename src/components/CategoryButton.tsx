import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { IncidentType } from '../types/incident';
import { incidentTypeMeta } from '../utils/incidentMeta';

interface CategoryButtonProps {
  type: IncidentType;
  selected?: boolean;
  onPress: () => void;
}

export function CategoryButton({ type, selected = false, onPress }: CategoryButtonProps) {
  const meta = incidentTypeMeta[type];

  return (
    <TouchableOpacity
      activeOpacity={0.84}
      onPress={onPress}
      style={[
        styles.button,
        {
          borderColor: selected ? meta.color : colors.border,
          backgroundColor: selected ? `${meta.color}12` : colors.white
        }
      ]}
    >
      <Ionicons name={meta.icon} size={25} color={meta.color} />
      <Text style={styles.label} numberOfLines={2}>
        {meta.shortLabel}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 96,
    minHeight: 82,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 6
  },
  label: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    textAlign: 'center'
  }
});