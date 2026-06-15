import { Ionicons } from '@expo/vector-icons';
import { IncidentSeverity, IncidentStatus, IncidentType } from '../types/incident';
import { colors } from '../theme/colors';

export const incidentTypes: IncidentType[] = [
  'Electricity / Power Issue',
  'Theft / Security Issue',
  'Fight / Misconduct',
  'Lost Child / Missing Person',
  'Medical / First Aid',
  'Fire / Smoke',
  'Traffic / Road Obstruction',
  'Facility / Maintenance Fault'
];

export const severityLevels: IncidentSeverity[] = ['Low', 'Medium', 'High', 'Critical'];

export const redemptionZones = [
  'Main Auditorium Area',
  'Old Auditorium Area',
  'Youth Centre',
  'Chalet Area',
  'Diligence Road',
  'Comfort Street',
  'Redemption Gate',
  'Clinic Area',
  'Market Area',
  'Residential Area',
  'Camp Road',
  'Other Area'
];

export const incidentTypeMeta: Record<
  IncidentType,
  {
    label: string;
    shortLabel: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }
> = {
  'Electricity / Power Issue': {
    label: 'Electricity / Power Issue',
    shortLabel: 'Power',
    icon: 'flash-outline',
    color: colors.warning
  },
  'Theft / Security Issue': {
    label: 'Theft / Security Issue',
    shortLabel: 'Theft',
    icon: 'shield-checkmark-outline',
    color: colors.danger
  },
  'Fight / Misconduct': {
    label: 'Fight / Misconduct',
    shortLabel: 'Misconduct',
    icon: 'hand-left-outline',
    color: colors.danger
  },
  'Suspicious Activity': {
    label: 'Suspicious Activity',
    shortLabel: 'Suspicious',
    icon: 'eye-outline',
    color: colors.purple
  },
  'Lost Child / Missing Person': {
    label: 'Lost Child / Missing Person',
    shortLabel: 'Lost Person',
    icon: 'person-outline',
    color: colors.warning
  },
  'Medical / First Aid': {
    label: 'Medical / First Aid',
    shortLabel: 'Medical',
    icon: 'medkit-outline',
    color: colors.success
  },
  'Fire / Smoke': {
    label: 'Fire / Smoke',
    shortLabel: 'Fire',
    icon: 'flame-outline',
    color: colors.danger
  },
  'Traffic / Road Obstruction': {
    label: 'Traffic / Road Obstruction',
    shortLabel: 'Traffic',
    icon: 'car-outline',
    color: colors.purple
  },
  'Crowd Control Issue': {
    label: 'Crowd Control Issue',
    shortLabel: 'Crowd',
    icon: 'people-outline',
    color: colors.gold
  },
  'Water / Drainage / Flooding': {
    label: 'Water / Drainage / Flooding',
    shortLabel: 'Water',
    icon: 'water-outline',
    color: colors.cyan
  },
  'Facility / Maintenance Fault': {
    label: 'Facility / Maintenance Fault',
    shortLabel: 'Facility',
    icon: 'business-outline',
    color: colors.primary
  },
  'Sanitation / Waste Issue': {
    label: 'Sanitation / Waste Issue',
    shortLabel: 'Sanitation',
    icon: 'trash-outline',
    color: colors.success
  },
  'Noise / Disturbance': {
    label: 'Noise / Disturbance',
    shortLabel: 'Noise',
    icon: 'volume-high-outline',
    color: colors.warning
  },
  Other: {
    label: 'Other',
    shortLabel: 'Other',
    icon: 'alert-circle-outline',
    color: colors.textMuted
  }
};

export const severityColors: Record<IncidentSeverity, string> = {
  Low: colors.success,
  Medium: colors.warning,
  High: colors.danger,
  Critical: colors.danger
};

export const statusColors: Record<IncidentStatus, string> = {
  Submitted: colors.primary,
  Open: colors.warning,
  'In Review': colors.primary,
  Verified: colors.purple,
  Assigned: colors.gold,
  'Responder En Route': colors.primary,
  'In Progress': colors.primary,
  Resolved: colors.success,
  Rejected: colors.danger
};