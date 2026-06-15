import AsyncStorage from '@react-native-async-storage/async-storage';
import { DraftIncident, Incident } from '../types/incident';
import { mockIncidents } from '../data/mockIncidents';

const INCIDENTS_STORAGE_KEY = 'redemption-city-incident-management:mobile-incidents:command-v1';

let incidentCache: Incident[] = [...mockIncidents];

function createIncidentId(): string {
  const year = new Date().getFullYear();
  const timestampPart = Date.now().toString().slice(-5);
  const randomPart = Math.floor(100 + Math.random() * 900);
  return `RCC-${year}-${timestampPart}${randomPart}`;
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

async function persistIncidents(incidents: Incident[]): Promise<void> {
  incidentCache = incidents;
  await AsyncStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(incidents));
}

export async function loadMyIncidents(): Promise<Incident[]> {
  const stored = await AsyncStorage.getItem(INCIDENTS_STORAGE_KEY);

  if (!stored) {
    await persistIncidents(mockIncidents);
    return [...mockIncidents];
  }

  try {
    const parsed = JSON.parse(stored) as Incident[];
    incidentCache = parsed;
    return parsed;
  } catch {
    await persistIncidents(mockIncidents);
    return [...mockIncidents];
  }
}

export function getCachedIncidents(): Incident[] {
  return incidentCache;
}

export async function createIncidentFromDraft(draft: DraftIncident): Promise<Incident> {
  const now = formatNow();
  const nextId = createIncidentId();

  const incident: Incident = {
    id: nextId,
    title: draft.title.trim() || `${draft.type ?? 'Incident'} reported`,
    type: draft.type ?? 'Other',
    severity: draft.severity ?? 'Medium',
    status: 'Submitted',
    location: draft.location.trim() || 'Pinned location',
    address: draft.address.trim() || 'Location captured from device',
    latitude: draft.latitude,
    longitude: draft.longitude,
    distanceKm: 0,
    reportedAt: now,
    reporterName: draft.anonymous ? 'Anonymous' : 'Mobile Reporter',
    reporterContact: draft.reporterContact.trim() || 'Mobile App',
    description: draft.description.trim() || 'No description provided.',
    anonymous: draft.anonymous,
    attachments: draft.attachments,
    timeline: [
      {
        id: `${nextId}-submitted`,
        status: 'Submitted',
        title: 'Report received',
        description: 'Incident report submitted to Admin Control Desk.',
        actor: 'Mobile App',
        timestamp: now
      },
      {
        id: `${nextId}-control-desk`,
        status: 'In Review',
        title: 'Awaiting admin routing',
        description:
          'Admin Control Desk will review this report and route it to the appropriate verified response body.',
        actor: 'Admin Control Desk',
        timestamp: 'Pending'
      }
    ]
  };

  const existing = await loadMyIncidents();
  await persistIncidents([incident, ...existing]);

  return incident;
}

export async function resetIncidentsToDemoData(): Promise<Incident[]> {
  await persistIncidents(mockIncidents);
  return [...mockIncidents];
}