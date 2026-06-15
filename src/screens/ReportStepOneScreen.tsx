import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DraftIncident, IncidentSeverity, IncidentType } from '../types/incident';
import { ScreenName } from '../types/navigation';

interface ReportStepOneScreenProps {
  draft: DraftIncident;
  setDraft: (draft: DraftIncident) => void;
  onNavigate: (screen: ScreenName) => void;
}

interface ReportTypeOption {
  label: string;
  value: IncidentType;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface UrgencyOption {
  label: IncidentSeverity;
  descriptor: string;
  icon: keyof typeof Ionicons.glyphMap;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

const REPORT_TYPES: ReportTypeOption[] = [
  {
    label: 'Power',
    value: 'Electricity / Power Issue',
    icon: 'flash-outline',
    color: '#F57C00'
  },
  {
    label: 'Theft',
    value: 'Theft / Security Issue',
    icon: 'shield-checkmark-outline',
    color: '#1565C0'
  },
  {
    label: 'Misconduct',
    value: 'Fight / Misconduct',
    icon: 'hand-left-outline',
    color: '#C62828'
  },
  {
    label: 'Medical',
    value: 'Medical / First Aid',
    icon: 'medkit-outline',
    color: '#2E7D32'
  },
  {
    label: 'Fire',
    value: 'Fire / Smoke',
    icon: 'flame-outline',
    color: '#C62828'
  },
  {
    label: 'Crowd',
    value: 'Crowd Control Issue',
    icon: 'people-outline',
    color: '#6A1B9A'
  }
];

const URGENCY_LEVELS: UrgencyOption[] = [
  {
    label: 'Low',
    descriptor: 'Non-urgent',
    icon: 'information-circle-outline',
    textColor: '#2E7D32',
    bgColor: '#E8F5E9',
    borderColor: '#2E7D32'
  },
  {
    label: 'Medium',
    descriptor: 'Monitor closely',
    icon: 'remove-circle-outline',
    textColor: '#F57C00',
    bgColor: '#FFF3E0',
    borderColor: '#F57C00'
  },
  {
    label: 'High',
    descriptor: 'Needs attention',
    icon: 'warning-outline',
    textColor: '#C62828',
    bgColor: '#FFEBEE',
    borderColor: '#C62828'
  },
  {
    label: 'Critical',
    descriptor: 'Act immediately',
    icon: 'alert-circle-outline',
    textColor: '#6A1B9A',
    bgColor: '#F3E5F5',
    borderColor: '#6A1B9A'
  }
];

export function ReportStepOneScreen({ draft, setDraft, onNavigate }: ReportStepOneScreenProps) {
  const [selectedReportType, setSelectedReportType] = useState<IncidentType>(
    draft.type ?? 'Electricity / Power Issue'
  );
  const [selectedUrgency, setSelectedUrgency] = useState<IncidentSeverity>(
    draft.severity ?? 'Medium'
  );
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  function updateDraft<K extends keyof DraftIncident>(key: K, value: DraftIncident[K]) {
    setDraft({
      ...draft,
      [key]: value
    });
  }

  function handleSelectReportType(type: IncidentType) {
    setSelectedReportType(type);
    updateDraft('type', type);
  }

  function handleSelectUrgency(level: IncidentSeverity) {
    setSelectedUrgency(level);
    updateDraft('severity', level);
  }

  function handleNext() {
    setDraft({
      ...draft,
      type: selectedReportType,
      severity: selectedUrgency
    });

    onNavigate('report-step-two');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#1A4731" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backButton}
          onPress={() => onNavigate('home')}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Report Safety Issue</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Step 1 of 2</Text>
          <Text style={styles.progressPercent}>50%</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.instructionCard}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#1A4731" />

          <View style={styles.instructionTextWrap}>
            <Text style={styles.instructionTitle}>Tell the Safety Desk what happened.</Text>
            <Text style={styles.instructionBody}>
              Be clear. Include the area, what you saw, and how urgent it is.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Report Title</Text>

          <TextInput
            value={draft.title}
            onChangeText={(text) => updateDraft('title', text)}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
            maxLength={80}
            placeholder="e.g., Crowd pressure near Main Auditorium"
            placeholderTextColor="#9E9E9E"
            style={[styles.textInput, titleFocused && styles.textInputFocused]}
          />

          <Text style={styles.characterCount}>{draft.title.length} / 80</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Report Type</Text>
          <Text style={styles.inputSubtitle}>Choose the issue that best matches.</Text>

          <View style={styles.reportTypeGrid}>
            {REPORT_TYPES.map((type) => {
              const selected = selectedReportType === type.value;

              return (
                <TouchableOpacity
                  key={type.value}
                  activeOpacity={0.84}
                  onPress={() => handleSelectReportType(type.value)}
                  style={[styles.reportTypeTile, selected && styles.reportTypeTileSelected]}
                >
                  <Ionicons name={type.icon} size={28} color={type.color} />
                  <Text style={styles.reportTypeLabel}>{type.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Urgency Level</Text>
          <Text style={styles.inputSubtitle}>How quickly should the safety desk respond?</Text>

          <View style={styles.urgencyGrid}>
            {URGENCY_LEVELS.map((level) => {
              const selected = selectedUrgency === level.label;

              return (
                <TouchableOpacity
                  key={level.label}
                  activeOpacity={0.84}
                  onPress={() => handleSelectUrgency(level.label)}
                  style={[
                    styles.urgencyTile,
                    selected && {
                      borderColor: level.borderColor,
                      borderWidth: 2,
                      backgroundColor: level.bgColor
                    }
                  ]}
                >
                  <Ionicons name={level.icon} size={22} color={level.textColor} />

                  <View style={styles.urgencyTextWrap}>
                    <Text style={styles.urgencyTitle}>{level.label}</Text>
                    <Text style={styles.urgencyDescriptor}>{level.descriptor}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Date & Time</Text>

          <TouchableOpacity activeOpacity={0.84} style={styles.selectorRow}>
            <Ionicons name="calendar-outline" size={20} color="#6B7C74" />
            <Text style={styles.selectorText}>Saturday, Jun 6, 2026 · 10:53 AM</Text>
            <Ionicons name="chevron-down" size={18} color="#6B7C74" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Describe what happened</Text>

          <TextInput
            value={draft.description}
            onChangeText={(text) => updateDraft('description', text)}
            onFocus={() => setDescriptionFocused(true)}
            onBlur={() => setDescriptionFocused(false)}
            maxLength={500}
            multiline
            textAlignVertical="top"
            placeholder={
              'Describe what you observed in simple words. Include location, people involved, and what is currently happening...'
            }
            placeholderTextColor="#9E9E9E"
            style={[
              styles.textInput,
              styles.descriptionInput,
              descriptionFocused && styles.textInputFocused
            ]}
          />

          <Text style={styles.characterCount}>{draft.description.length} / 500</Text>

          <View style={styles.tipCard}>
            <Ionicons name="information-circle-outline" size={20} color="#1A4731" />
            <Text style={styles.tipText}>
              Clear reports help our team respond faster and reach the right place.
            </Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.ctaButton} onPress={handleNext}>
          <Text style={styles.ctaText}>Next: Location & Evidence →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F5'
  },
  header: {
    backgroundColor: '#1A4731',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center'
  },
  headerSpacer: {
    width: 38,
    height: 38
  },
  progressSection: {
    backgroundColor: '#FFFFFF',
    padding: 16
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  progressLabel: {
    color: '#1A4731',
    fontSize: 13,
    fontWeight: '600'
  },
  progressPercent: {
    color: '#1A4731',
    fontSize: 13,
    fontWeight: '400'
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden'
  },
  progressFill: {
    width: '50%',
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#1A4731'
  },
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28
  },
  instructionCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1A4731',
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12
  },
  instructionTextWrap: {
    flex: 1
  },
  instructionTitle: {
    color: '#1A4731',
    fontSize: 16,
    fontWeight: '700'
  },
  instructionBody: {
    color: '#6B7C74',
    fontSize: 13,
    fontWeight: '400',
    marginTop: 4,
    lineHeight: 19
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3
  },
  inputLabel: {
    color: '#0D1F17',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  inputSubtitle: {
    color: '#6B7C74',
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 12
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    color: '#0D1F17',
    fontSize: 14,
    fontWeight: '400',
    backgroundColor: '#FFFFFF'
  },
  textInputFocused: {
    borderColor: '#1A4731'
  },
  characterCount: {
    marginTop: 8,
    color: '#6B7C74',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'right'
  },
  reportTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  reportTypeTile: {
    width: '30%',
    margin: '1.5%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 7
  },
  reportTypeTileSelected: {
    borderColor: '#1A4731',
    borderWidth: 2,
    backgroundColor: '#E8F5E9'
  },
  reportTypeLabel: {
    color: '#0D1F17',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  urgencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4
  },
  urgencyTile: {
    width: '48%',
    margin: 4,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  urgencyTextWrap: {
    flex: 1
  },
  urgencyTitle: {
    color: '#0D1F17',
    fontSize: 13,
    fontWeight: '700'
  },
  urgencyDescriptor: {
    marginTop: 2,
    color: '#6B7C74',
    fontSize: 11,
    fontWeight: '400'
  },
  selectorRow: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  selectorText: {
    flex: 1,
    color: '#0D1F17',
    fontSize: 14,
    fontWeight: '400'
  },
  descriptionInput: {
    minHeight: 120
  },
  tipCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    marginTop: 12
  },
  tipText: {
    flex: 1,
    color: '#1A4731',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19
  },
  ctaButton: {
    backgroundColor: '#1A4731',
    borderRadius: 14,
    paddingVertical: 18,
    width: '100%',
    shadowColor: '#1A4731',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  }
});