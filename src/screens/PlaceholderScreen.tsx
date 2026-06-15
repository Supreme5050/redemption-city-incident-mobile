import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar } from '../components/BottomTabBar';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { Screen } from '../components/Screen';
import { colors } from '../theme/colors';
import { ScreenName } from '../types/navigation';

interface PlaceholderScreenProps {
  active: ScreenName;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onNavigate: (screen: ScreenName) => void;
}

export function PlaceholderScreen({ active, title, subtitle, icon, onNavigate }: PlaceholderScreenProps) {
  return (
    <Screen>
      <Header />

      <View style={styles.content}>
        <Card style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name={icon} size={48} color={colors.primary} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Card>
      </View>

      <BottomTabBar active={active} onNavigate={onNavigate} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  card: {
    alignItems: 'center',
    paddingVertical: 44
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(47,140,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '900',
    textAlign: 'center'
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8
  }
});