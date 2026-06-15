import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { ScreenName } from '../types/navigation';

interface BottomTabBarProps {
  active: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const tabs: Array<{
  label: string;
  screen: ScreenName;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { label: 'Home', screen: 'home', icon: 'home-outline' },
  { label: 'Report', screen: 'report-step-one', icon: 'add-circle-outline' },
  { label: 'Alerts', screen: 'alerts', icon: 'notifications-outline' },
  { label: 'My Reports', screen: 'my-reports', icon: 'clipboard-outline' },
  { label: 'Profile', screen: 'profile', icon: 'person-outline' }
];

export function BottomTabBar({ active, onNavigate }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive =
          active === tab.screen ||
          (tab.screen === 'report-step-one' && active === 'report-step-two') ||
          (tab.screen === 'my-reports' && active === 'report-details');

        return (
          <TouchableOpacity
            key={tab.label}
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => onNavigate(tab.screen)}
          >
            <View>
              <Ionicons name={tab.icon} size={24} color={isActive ? colors.primary : colors.textMuted} />

              {tab.screen === 'alerts' && (
                <View style={styles.alertBadge}>
                  <Text style={styles.alertBadgeText}>3</Text>
                </View>
              )}
            </View>

            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 74,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 8
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700'
  },
  activeLabel: {
    color: colors.primary
  },
  alertBadge: {
    position: 'absolute',
    top: -8,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  alertBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900'
  }
});