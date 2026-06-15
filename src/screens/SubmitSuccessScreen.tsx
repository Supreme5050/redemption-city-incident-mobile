import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../components/Badge';
import { BottomTabBar } from '../components/BottomTabBar';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { colors } from '../theme/colors';
import { Incident } from '../types/incident';
import { ScreenName } from '../types/navigation';
import { incidentTypeMeta } from '../utils/incidentMeta';

interface SubmitSuccessScreenProps {
  incident: Incident;
  onNavigate: (screen: ScreenName) => void;
  onOpenIncident: (incident: Incident) => void;
}

export function SubmitSuccessScreen({ incident, onNavigate, onOpenIncident }: SubmitSuccessScreenProps) {
  const meta = incidentTypeMeta[incident.type];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header />

        <View style={styles.successWrap}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={54} color={colors.success} />
          </View>

          <Text style={styles.title}>Incident Submitted</Text>
          <Text style={styles.subtitle}>Thank you for helping keep your community safe.</Text>

          <TouchableOpacity style={styles.idPill} activeOpacity={0.85}>
            <Text style={styles.incidentId}>{incident.id}</Text>
            <Ionicons name="copy-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Card>
          <Text style={styles.cardTitle}>Submission Progress</Text>

          <View style={styles.progressRow}>
            <ProgressDot active done label="Submitted" subLabel={incident.reportedAt} />
            <View style={styles.line} />
            <ProgressDot active label="In Review" subLabel="Current" />
            <View style={styles.lineDashed} />
            <ProgressDot label="Verified" subLabel="Pending" />
            <View style={styles.lineDashed} />
            <ProgressDot label="Assigned" subLabel="Pending" />
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Incident Summary</Text>

          <View style={styles.summaryRow}>
            <View style={[styles.typeIcon, { backgroundColor: `${meta.color}18`, borderColor: meta.color }]}>
              <Ionicons name={meta.icon} size={28} color={meta.color} />
            </View>

            <View style={styles.summaryText}>
              <Text style={styles.summaryLabel}>Type</Text>
              <Text style={styles.summaryValue}>{incident.type}</Text>
            </View>

            <Badge label={incident.severity} type="severity" />
          </View>

          <View style={styles.detailLine}>
            <Ionicons name="location-outline" size={22} color={colors.primary} />
            <View style={styles.detailTextWrap}>
              <Text style={styles.summaryLabel}>Location</Text>
              <Text style={styles.summaryValue}>{incident.location}</Text>
              <Text style={styles.summarySub}>{incident.address}</Text>
            </View>
          </View>

          <View style={styles.detailLine}>
            <Ionicons name="time-outline" size={22} color={colors.warning} />
            <View style={styles.detailTextWrap}>
              <Text style={styles.summaryLabel}>Submitted</Text>
              <Text style={styles.summaryValue}>{incident.reportedAt}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.statusCard}>
          <Ionicons name="shield-checkmark-outline" size={34} color={colors.purple} />
          <View style={styles.statusTextWrap}>
            <Text style={styles.summaryLabel}>Current Status</Text>
            <Text style={styles.statusTitle}>{incident.status}</Text>
            <Text style={styles.statusText}>Our team is reviewing your report.</Text>
          </View>
        </Card>

        <View style={styles.actionRow}>
          <PrimaryButton
            title="View Full Report"
            icon="document-text-outline"
            onPress={() => onOpenIncident(incident)}
            style={styles.halfButton}
          />

          <PrimaryButton
            title="Share Reference"
            icon="share-outline"
            variant="outline"
            onPress={() => {}}
            style={styles.halfButton}
          />
        </View>

        <PrimaryButton
          title="Back Home"
          icon="home-outline"
          variant="outline"
          onPress={() => onNavigate('home')}
        />
      </ScrollView>

      <BottomTabBar active="my-reports" onNavigate={onNavigate} />
    </Screen>
  );
}

function ProgressDot({ active = false, done = false, label, subLabel }: {
  active?: boolean;
  done?: boolean;
  label: string;
  subLabel: string;
}) {
  return (
    <View style={styles.progressItem}>
      <View style={[styles.progressCircle, active && styles.activeCircle, done && styles.doneCircle]}>
        <Ionicons
          name={done ? 'checkmark' : active ? 'time-outline' : 'ellipse-outline'}
          size={18}
          color={active || done ? colors.white : colors.textMuted}
        />
      </View>
      <Text style={[styles.progressLabel, active && styles.activeText]}>{label}</Text>
      <Text style={styles.progressSub}>{subLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14
  },
  successWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8
  },
  checkCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.7,
    shadowRadius: 24
  },
  title: {
    marginTop: 20,
    color: colors.text,
    fontSize: 31,
    fontWeight: '900',
    textAlign: 'center'
  },
  subtitle: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center'
  },
  idPill: {
    marginTop: 18,
    minHeight: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  incidentId: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900'
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 16
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  progressItem: {
    width: 72,
    alignItems: 'center'
  },
  progressCircle: {
    width: 39,
    height: 39,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeCircle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  doneCircle: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  progressLabel: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center'
  },
  activeText: {
    color: colors.primary
  },
  progressSub: {
    marginTop: 3,
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center'
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.success,
    marginTop: 19
  },
  lineDashed: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginTop: 19
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14
  },
  typeIcon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  summaryText: {
    flex: 1
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '800'
  },
  summaryValue: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 2
  },
  summarySub: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2
  },
  detailLine: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 14,
    marginTop: 12,
    flexDirection: 'row',
    gap: 12
  },
  detailTextWrap: {
    flex: 1
  },
  statusCard: {
    flexDirection: 'row',
    gap: 13,
    borderColor: colors.purple
  },
  statusTextWrap: {
    flex: 1
  },
  statusTitle: {
    color: colors.purple,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2
  },
  statusText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12
  },
  halfButton: {
    flex: 1
  }
});