import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar } from '../components/BottomTabBar';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { MiniMap } from '../components/MiniMap';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressSteps } from '../components/ProgressSteps';
import { Screen } from '../components/Screen';
import { colors } from '../theme/colors';
import { DraftIncident, EvidenceAttachment } from '../types/incident';
import { ScreenName } from '../types/navigation';

interface ReportStepTwoScreenProps {
  draft: DraftIncident;
  setDraft: (draft: DraftIncident) => void;
  onNavigate: (screen: ScreenName) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const demoAttachments: EvidenceAttachment[] = [
  { id: 'photo-1', type: 'Photo', name: 'redemption-report-photo.jpg', size: '2.1 MB', thumbnailLabel: 'Photo' },
  { id: 'video-1', type: 'Video', name: 'short-report-clip.mp4', size: '8.4 MB', thumbnailLabel: 'Video' },
  { id: 'doc-1', type: 'Document', name: 'report-note.pdf', size: '1.2 MB', thumbnailLabel: 'PDF' }
];

const redemptionAreas = [
  'Main Auditorium Area',
  'Old Auditorium Area',
  'Youth Centre',
  'Chalet Area',
  'Diligence Road',
  'Comfort Street',
  'Redemption Gate',
  'Clinic Area'
];

export function ReportStepTwoScreen({
  draft,
  setDraft,
  onNavigate,
  onSubmit,
  isSubmitting = false
}: ReportStepTwoScreenProps) {
  function update<K extends keyof DraftIncident>(key: K, value: DraftIncident[K]) {
    setDraft({ ...draft, [key]: value });
  }

  function toggleDemoEvidence() {
    update('attachments', draft.attachments.length > 0 ? [] : demoAttachments);
  }

  function selectArea(area: string) {
    update('location', area);
    update('address', `${area}, Redemption City`);
  }

  return (
    <Screen>
      <Header title="Location & Evidence" showBack onBack={() => onNavigate('report-step-one')} />
      <ProgressSteps step={2} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.stepTitle}>Where is this happening?</Text>
          <Text style={styles.stepSubtitle}>Choose the closest Redemption City area and add evidence if available.</Text>
        </View>

        <MiniMap label={draft.location || 'Redemption City'} />

        <Card>
          <Text style={styles.sectionTitle}>Select Area</Text>

          <View style={styles.areaGrid}>
            {redemptionAreas.map((area) => {
              const selected = draft.location === area;

              return (
                <TouchableOpacity
                  key={area}
                  activeOpacity={0.84}
                  onPress={() => selectArea(area)}
                  style={[styles.areaPill, selected && styles.areaPillSelected]}
                >
                  <Text style={[styles.areaText, selected && styles.areaTextSelected]}>{area}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <View style={styles.mapActions}>
          <PrimaryButton
            title="Use Current Area"
            icon="navigate-outline"
            onPress={() => selectArea('Current Redemption City Area')}
            style={styles.mapButton}
          />

          <PrimaryButton
            title="Adjust Area"
            icon="locate-outline"
            variant="outline"
            onPress={() => selectArea('Main Auditorium Area')}
            style={styles.mapButton}
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>
            Add Evidence <Text style={styles.optional}>(Optional)</Text>
          </Text>

          <EvidenceRow
            icon="camera-outline"
            color={colors.primary}
            title="Photo"
            subtitle="Add a photo of the issue"
            count={draft.attachments.some((attachment) => attachment.type === 'Photo') ? '1/10' : '0/10'}
            onPress={toggleDemoEvidence}
          />

          <EvidenceRow
            icon="videocam-outline"
            color={colors.purple}
            title="Video"
            subtitle="Add a short video"
            count={draft.attachments.some((attachment) => attachment.type === 'Video') ? '1/3' : '0/3'}
            onPress={toggleDemoEvidence}
          />

          <EvidenceRow
            icon="document-text-outline"
            color={colors.cyan}
            title="Note / Document"
            subtitle="Attach extra details"
            count={draft.attachments.some((attachment) => attachment.type === 'Document') ? '1/5' : '0/5'}
            onPress={toggleDemoEvidence}
          />
        </View>

        <Card style={styles.optionCard}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: 'rgba(168,85,247,0.16)' }]}>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.purple} />
            </View>

            <View>
              <Text style={styles.optionTitle}>Anonymous Report</Text>
              <Text style={styles.optionText}>Hide your identity from public view</Text>
            </View>
          </View>

          <Switch
            value={draft.anonymous}
            onValueChange={(value) => update('anonymous', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </Card>

        <Card style={styles.contactCard}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: 'rgba(6,182,212,0.16)' }]}>
              <Ionicons name="person-outline" size={24} color={colors.cyan} />
            </View>

            <View style={styles.contactTextWrap}>
              <Text style={styles.optionTitle}>
                Your Contact <Text style={styles.optional}>(Optional)</Text>
              </Text>
              <Text style={styles.optionText}>Phone number for follow-up if needed</Text>
            </View>
          </View>

          <TextInput
            value={draft.reporterContact}
            onChangeText={(text) => update('reporterContact', text)}
            placeholder="phone or email"
            placeholderTextColor={colors.textDim}
            style={styles.contactInput}
          />
        </Card>

        <PrimaryButton
          title={draft.attachments.length > 0 ? 'Submit Report with Evidence' : 'Submit Safety Report'}
          icon="paper-plane-outline"
          onPress={onSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </ScrollView>

      <BottomTabBar active="report-step-two" onNavigate={onNavigate} />
    </Screen>
  );
}

function EvidenceRow({
  icon,
  color,
  title,
  subtitle,
  count,
  onPress
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  subtitle: string;
  count: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.evidenceRow} onPress={onPress} activeOpacity={0.82}>
      <View style={[styles.evidenceIcon, { borderColor: color, backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={27} color={color} />
      </View>

      <View style={styles.evidenceTextWrap}>
        <Text style={styles.evidenceTitle}>{title}</Text>
        <Text style={styles.evidenceSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.thumbnail}>
        <Ionicons name="add" size={26} color={colors.textMuted} />
      </View>

      <Text style={styles.count}>{count}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14
  },
  stepTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900'
  },
  stepSubtitle: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12
  },
  areaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9
  },
  areaPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSoft,
    paddingHorizontal: 13,
    paddingVertical: 10
  },
  areaPillSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(47,140,255,0.18)'
  },
  areaText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900'
  },
  areaTextSelected: {
    color: colors.primary
  },
  mapActions: {
    flexDirection: 'row',
    gap: 12
  },
  mapButton: {
    flex: 1,
    minHeight: 54
  },
  optional: {
    color: colors.textMuted,
    fontWeight: '700'
  },
  evidenceRow: {
    minHeight: 78,
    borderRadius: 17,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10
  },
  evidenceIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  evidenceTextWrap: {
    flex: 1
  },
  evidenceTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900'
  },
  evidenceSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2
  },
  thumbnail: {
    width: 50,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.textDim,
    alignItems: 'center',
    justifyContent: 'center'
  },
  count: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '800'
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  contactCard: {
    gap: 12
  },
  optionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900'
  },
  optionText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2
  },
  contactTextWrap: {
    flex: 1
  },
  contactInput: {
    minHeight: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSoft,
    color: colors.text,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '700'
  }
});