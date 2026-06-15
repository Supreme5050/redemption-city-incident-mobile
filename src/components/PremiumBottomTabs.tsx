import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenName } from '../types/navigation';

interface PremiumBottomTabsProps {
  active: 'home' | 'reports' | 'alerts' | 'map' | 'profile';
  onNavigate: (screen: ScreenName) => void;
}

const tabs: Array<{
  key: 'home' | 'reports' | 'alerts' | 'map' | 'profile';
  label: string;
  screen: ScreenName;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { key: 'home', label: 'Home', screen: 'home', icon: 'home-outline' },
  { key: 'reports', label: 'Reports', screen: 'my-reports', icon: 'document-text-outline' },
  { key: 'alerts', label: 'Alerts', screen: 'alerts', icon: 'notifications-outline' },
  { key: 'map', label: 'Map', screen: 'map', icon: 'map-outline' },
  { key: 'profile', label: 'Profile', screen: 'profile', icon: 'person-outline' }
];

export function PremiumBottomTabs({ active, onNavigate }: PremiumBottomTabsProps) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = active === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            style={styles.tab}
            onPress={() => onNavigate(tab.screen)}
          >
            <View>
              <Ionicons name={tab.icon} size={24} color={isActive ? '#1A4731' : '#7D8A84'} />

              {tab.key === 'alerts' && (
                <View style={styles.alertBadge}>
                  <Text style={styles.alertBadgeText}>3</Text>
                </View>
              )}
            </View>

            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    minHeight: 74,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E1E7E3',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4
  },
  tabLabel: {
    color: '#7D8A84',
    fontSize: 11,
    fontWeight: '500'
  },
  activeTabLabel: {
    color: '#1A4731',
    fontWeight: '700'
  },
  alertBadge: {
    position: 'absolute',
    top: -7,
    right: -10,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  alertBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  }
});