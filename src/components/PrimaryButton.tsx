import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'danger' | 'outline' | 'gold';
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
}

export function PrimaryButton({
  title,
  onPress,
  icon,
  variant = 'primary',
  style,
  disabled = false,
  loading = false
}: PrimaryButtonProps) {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isGold = variant === 'gold';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        isOutline && styles.outline,
        isDanger && styles.danger,
        isGold && styles.gold,
        isDisabled && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isOutline ? colors.primary : colors.white} />
      ) : (
        icon && <Ionicons name={icon} size={22} color={isOutline ? colors.primary : colors.white} />
      )}

      <Text style={[styles.text, isOutline && styles.outlineText]}>
        {loading ? 'Please wait...' : title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10
  },
  outline: {
    backgroundColor: colors.white,
    borderColor: colors.border
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger
  },
  gold: {
    backgroundColor: colors.gold,
    borderColor: colors.gold
  },
  disabled: {
    opacity: 0.62
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900'
  },
  outlineText: {
    color: colors.primary
  }
});