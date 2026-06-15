export type LostFoundMode = 'Lost Item' | 'Found Item';

export type LostFoundStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Matched'
  | 'Claim Verification'
  | 'Ready for Handover'
  | 'Closed';

export interface LostFoundDraft {
  mode: LostFoundMode;
  itemName: string;
  category: string;
  locationLabel: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  contact: string;
  imageUri?: string;
  photoLabel?: string;
}

export interface LostFoundRecord {
  id: string;
  mode: LostFoundMode;
  itemName: string;
  category: string;
  locationLabel: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  contact: string;
  imageUri?: string;
  photoLabel?: string;
  status: LostFoundStatus;
  createdAt: string;
  timeline: Array<{
    id: string;
    title: string;
    description: string;
    actor: string;
    timestamp: string;
  }>;
}