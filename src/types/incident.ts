export type IncidentType =
  | 'Electricity / Power Issue'
  | 'Theft / Security Issue'
  | 'Fight / Misconduct'
  | 'Suspicious Activity'
  | 'Lost Child / Missing Person'
  | 'Medical / First Aid'
  | 'Fire / Smoke'
  | 'Traffic / Road Obstruction'
  | 'Crowd Control Issue'
  | 'Water / Drainage / Flooding'
  | 'Facility / Maintenance Fault'
  | 'Sanitation / Waste Issue'
  | 'Noise / Disturbance'
  | 'Other';

export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentStatus =
  | 'Submitted'
  | 'Open'
  | 'In Review'
  | 'Verified'
  | 'Assigned'
  | 'Responder En Route'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export type EvidenceType = 'Photo' | 'Video' | 'Document';

export interface EvidenceAttachment {
  id: string;
  type: EvidenceType;
  name: string;
  size: string;
  uri?: string;
  thumbnailLabel?: string;
}

export interface IncidentTimelineItem {
  id: string;
  status: IncidentStatus;
  title: string;
  description: string;
  actor: string;
  timestamp: string;
}

export interface Incident {
  id: string;
  title: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  distanceKm?: number;
  reportedAt: string;
  reporterName?: string;
  reporterContact?: string;
  description: string;
  anonymous: boolean;
  attachments: EvidenceAttachment[];
  timeline: IncidentTimelineItem[];

  assignedUnitId?: string;
  assignedUnitName?: string;
  routingNote?: string;
  responseEta?: string;
}

export interface DraftIncident {
  title: string;
  type: IncidentType | null;
  severity: IncidentSeverity;
  dateTime: string;
  description: string;
  location: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  anonymous: boolean;
  reporterContact: string;
  attachments: EvidenceAttachment[];
}