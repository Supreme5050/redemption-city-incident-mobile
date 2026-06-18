import { EvidenceAttachment } from './incident';

export type LostFoundMode = 'Lost Item' | 'Found Item';
export type LostFoundReportType = LostFoundMode;

export type LostFoundStatus =
  | 'Open'
  | 'Under Review'
  | 'Matched'
  | 'Claimed'
  | 'Closed'
  | 'Rejected';

export interface LostFoundDraft {
  mode?: LostFoundMode;
  reportType?: LostFoundReportType;
  itemName: string;
  category: string;
  description: string;
  locationLabel?: string;
  location?: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  contact?: string;
  reporterContact?: string;
  anonymous?: boolean;
  imageUri?: string;
  photoLabel?: string;
  attachments?: EvidenceAttachment[];
}

export interface LostFoundRecord {
  id: string;
  mode: LostFoundMode;
  reportType: LostFoundReportType;
  itemName: string;
  category: string;
  description: string;
  locationLabel: string;
  location: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  status: LostFoundStatus;
  reporterName: string;
  contact: string;
  reporterContact: string;
  anonymous: boolean;
  imageUri?: string;
  photoLabel?: string;
  attachments: EvidenceAttachment[];
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export type LostFoundReport = LostFoundRecord;
