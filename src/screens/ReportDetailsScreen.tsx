import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../components/Badge';
import { BottomTabBar } from '../components/BottomTabBar';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { MiniMap } from '../components/MiniMap';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { colors } from '../theme/colors';
import { Incident } from '../types/incident';
import { ScreenName } from '../types/navigation';
import { incidentTypeMeta, statusColors } from '../utils/incidentMeta';

interface ReportDetailsScreenProps {
  incident: Incident;
  onNavigate: (screen: ScreenName) => void;
}

export function ReportDetailsScreen({ incident, onNavigate }: ReportDetailsScreenProps) {
  const meta = incidentTypeMeta[incident.type];
  const statusColor = statusColors[incident.status];

  return (
    <Screen>
      <Header title="Report Details" showBack onBack={() => onNavigate('my-reports')} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.topRow}>
            <View style={[styles.typeIcon, { borderColor: meta.color, backgroundColor: `${meta.color}18` }]}>
              <Ionicons name={meta.icon} size={34} color={meta.color} />
            </View>

            <View style={styles.titleWrap}>
              <Text style={styles.title}>{incident.title}</Text>
              <Text style={styles.subtitle}>{incident.address}</Text>
            </View>
          </View>

          <View style={styles.badgeRow}>
            <Badge label={incident.severity} type="severity" />
            <Badge label={incident.type === 'Medical Emergency' ? 'Open' : incident.status} type="status" />
          </View>

          <View style={styles.idRow}>
            <Text style={styles.idText}>Report ID: {incident.id}</Text>
            <Ionicons name="copy-outline" size={18} color={colors.textMuted} />
          </View>

          <View style={styles.statusLine}>
            <Text style={styles.smallLabel}>Status</Text>
            <View style={styles.statusValue}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>{incident.status}</Text>
            </View>
          </View>
        </Card>

        <MiniMap label={incident.location} />

        <Card>
          <Text style={styles.cardTitle}>Incident Updates</Text>

          {incident.timeline.map((item, index) => {
            const color = statusColors[item.status];

            return (
              <View key={item.id} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineIcon, { backgroundColor: `${color}22`, borderColor: color }]}>
                    <Ionicons name={index === 0 ? 'document-text-outline' : 'radio-button-on'} size={18} color={color} />
                  </View>
                  {index !== incident.timeline.length - 1 && <View style={styles.timelineLine} />}
                </View>

                <View style={styles.timelineBody}>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineDescription}>{item.description}</Text>
                  <Text style={styles.timelineTime}>{item.timestamp}</Text>
                </View>

                <Text style={styles.timelineActor}>{item.actor}</Text>
              </View>
            );
          })}
        </Card>

        <Card>
          <DetailRow icon="location-outline" label="Location" value={incident.address} />
          <DetailRow icon="time-outline" label="Reported" value={incident.reportedAt} />
          <DetailRow icon="phone-portrait-outline" label="Contact Method" value={incident.reporterContact} />
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Attachments ({incident.attachments.length})</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>

          {incident.attachments.length === 0 ? (
            <Text style={styles.noAttachment}>No evidence was attached to this report.</Text>
          ) : (
            <View style={styles.attachmentRow}>
              {incident.attachments.map((attachment) => (
                <View key={attachment.id} style={styles.attachmentBox}>
                  <Ionicons
                    name={attachment.type === 'Photo' ? 'image-outline' : attachment.type === 'Video' ? 'play-circle-outline' : 'document-text-outline'}
                    size={25}
                    color={colors.primary}
                  />
                  <Text style={styles.attachmentLabel}>{attachment.thumbnailLabel ?? attachment.type}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        <Card style={styles.helpCard}>
          <View style={styles.helpLeft}>
            <View style={styles.helpIcon}>
              <Ionicons name="headset-outline" size={27} color={colors.purple} />
            </View>
            <View>
              <Text style={styles.helpTitle}>Need help?</Text>
              <Text style={styles.helpText}>Support is available 24/7.</Text>
            </View>
          </View>

          <View style={styles.helpButtons}>
            <PrimaryButton title="Message" icon="chatbubble-outline" variant="outline" onPress={() => {}} style={styles.helpButton} />
            <PrimaryButton title="Call" icon="call-outline" variant="outline" onPress={() => {}} style={styles.helpButton} />
          </View>
        </Card>
      </ScrollView>

      <BottomTabBar active="report-details" onNavigate={onNavigate} />
    </Screen>
  );
}

function DetailRow({ icon, label, value }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={22} color={colors.textMuted} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14
  },
  topRow: {
    flexDirection: 'row',
    gap: 13
  },
  typeIcon: {
    width: 62,
    height: 62,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleWrap: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4
  },
  badgeRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8
  },
  idRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  idText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '800'
  },
  statusLine: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 14,
    gap: 5
  },
  smallLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '800'
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  statusText: {
    fontSize: 17,
    fontWeight: '900'
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900'
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16
  },
  timelineLeft: {
    alignItems: 'center'
  },
  timelineIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 30,
    backgroundColor: colors.border
  },
  timelineBody: {
    flex: 1
  },
  timelineTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900'
  },
  timelineDescription: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3
  },
  timelineTime: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4
  },
  timelineActor: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    maxWidth: 86,
    textAlign: 'right'
  },
  detailRow: {
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '800',
    width: 105
  },
  detailValue: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right'
  },
  sectionHeader: {
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  viewAll: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900'
  },
  noAttachment: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700'
  },
  attachmentRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap'
  },
  attachmentBox: {
    width: 88,
    height: 72,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSoft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },
  attachmentLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800'
  },
  helpCard: {
    gap: 14
  },
  helpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  helpIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(168,85,247,0.16)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  helpTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900'
  },
  helpText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2
  },
  helpButtons: {
    flexDirection: 'row',
    gap: 10
  },
  helpButton: {
    flex: 1,
    minHeight: 48
  }
});