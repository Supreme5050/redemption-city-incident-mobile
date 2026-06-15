import AsyncStorage from '@react-native-async-storage/async-storage';
import { LostFoundDraft, LostFoundRecord } from '../types/lostFound';

const LOST_FOUND_STORAGE_KEY = 'redemption-city-incident-management:lost-found:command-v1';

const demoLostFoundRecords: LostFoundRecord[] = [
  {
    id: 'LF-2026-0104',
    mode: 'Found Item',
    itemName: 'Black leather wallet',
    category: 'Wallet',
    locationLabel: 'Main Auditorium Area',
    address: 'Main Auditorium Area, Redemption City Camp',
    latitude: 6.8144,
    longitude: 3.4912,
    description: 'A black wallet was found close to the main auditorium entrance after service.',
    contact: 'Admin Desk',
    status: 'Under Review',
    createdAt: 'Today, 9:15 AM',
    timeline: [
      {
        id: 'lf-demo-1',
        title: 'Record submitted',
        description: 'Found item submitted for admin review.',
        actor: 'Mobile App',
        timestamp: 'Today, 9:15 AM'
      },
      {
        id: 'lf-demo-2',
        title: 'Admin review started',
        description: 'Admin is checking ownership details before public matching.',
        actor: 'Admin Control Desk',
        timestamp: 'Current'
      }
    ]
  }
];

function createLostFoundId(): string {
  const year = new Date().getFullYear();
  const timestampPart = Date.now().toString().slice(-5);
  const randomPart = Math.floor(100 + Math.random() * 900);

  return `LF-${year}-${timestampPart}${randomPart}`;
}

function formatNow(): string {
  const now = new Date();

  return now.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

async function persistLostFoundRecords(records: LostFoundRecord[]): Promise<void> {
  await AsyncStorage.setItem(LOST_FOUND_STORAGE_KEY, JSON.stringify(records));
}

export async function loadLostFoundRecords(): Promise<LostFoundRecord[]> {
  const stored = await AsyncStorage.getItem(LOST_FOUND_STORAGE_KEY);

  if (!stored) {
    await persistLostFoundRecords(demoLostFoundRecords);
    return [...demoLostFoundRecords];
  }

  try {
    return JSON.parse(stored) as LostFoundRecord[];
  } catch {
    await persistLostFoundRecords(demoLostFoundRecords);
    return [...demoLostFoundRecords];
  }
}

export async function createLostFoundRecord(draft: LostFoundDraft): Promise<LostFoundRecord> {
  const now = formatNow();
  const id = createLostFoundId();

  const record: LostFoundRecord = {
    id,
    mode: draft.mode,
    itemName: draft.itemName.trim(),
    category: draft.category,
    locationLabel: draft.locationLabel,
    address: draft.address,
    latitude: draft.latitude,
    longitude: draft.longitude,
    description: draft.description.trim(),
    contact: draft.contact.trim(),
    imageUri: draft.imageUri,
    photoLabel: draft.imageUri ? 'Photo attached' : undefined,
    status: 'Submitted',
    createdAt: now,
    timeline: [
      {
        id: `${id}-submitted`,
        title: `${draft.mode} submitted`,
        description:
          draft.mode === 'Lost Item'
            ? 'Lost item report submitted to Admin Control Desk for review and matching.'
            : 'Found item submitted to Admin Control Desk for verification and safe handover.',
        actor: 'Mobile App',
        timestamp: now
      },
      {
        id: `${id}-review`,
        title: 'Awaiting admin review',
        description: 'Admin will verify the details before matching or handover.',
        actor: 'Admin Control Desk',
        timestamp: 'Pending'
      }
    ]
  };

  const existing = await loadLostFoundRecords();
  const updatedRecords = [record, ...existing];

  await persistLostFoundRecords(updatedRecords);

  return record;
}

export async function resetLostFoundDemoData(): Promise<LostFoundRecord[]> {
  await persistLostFoundRecords(demoLostFoundRecords);
  return [...demoLostFoundRecords];
}