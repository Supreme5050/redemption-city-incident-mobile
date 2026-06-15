import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PremiumHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

export function PremiumHeader({ showBack = false, onBack, title }: PremiumHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.leftArea}>
        {showBack ? (
          <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={onBack}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoBox}>
            <Ionicons name="leaf" size={21} color="#FFFFFF" />
          </View>
        )}

        <View>
          <Text style={styles.brandTitle}>{title ?? 'REDEMPTION CITY CAMP'}</Text>
          <Text style={styles.brandSubtitle}>INCIDENT MANAGEMENT</Text>
        </View>
      </View>

      <View style={styles.rightArea}>
        <TouchableOpacity activeOpacity={0.8} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={23} color="#FFFFFF" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color="#1A4731" />
        </View>

        <Ionicons name="chevron-down" size={18} color="rgba(255,255,255,0.75)" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1A4731',
    paddingTop: (StatusBar.currentHeight ?? 0) + 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leftArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  brandSubtitle: {
    marginTop: 2,
    color: '#D2B45A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1
  },
  rightArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center'
  }
});