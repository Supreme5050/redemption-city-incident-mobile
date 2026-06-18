import {
  DraftIncident,
  EvidenceAttachment,
  Incident,
  IncidentStatus,
  IncidentTimelineItem
} from '../types/incident';
import { supabase } from '../lib/supabase';
import { uploadEvidenceAttachments } from './evidenceUploadService';

type SupabaseIncidentRow = {
  id: string;
  public_id: string;
  reporter_id: string;
  title: string;
  type: string;
  severity: string;
  status: string;
  location: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string;
  anonymous: boolean;
  reporter_name: string | null;
  reporter_contact: string | null;
  assigned_body: string | null;
  priority_score: number;
  response_eta: string | null;
  attachments: EvidenceAttachment[] | null;
  timeline: IncidentTimelineItem[] | null;
  created_at: string;
  updated_at: string;
};

type SupabaseStatusUpdateRow = {
  id: string;
  incident_id: string;
  status: string;
  title: string;
  note: string | null;
  actor_name: string | null;
  created_at: string;
};

const incidentCache: {
  items: Incident[];
} = {
  items: []
};

const INCIDENT_SELECT_COLUMNS = `
  id,
  public_id,
  reporter_id,
  title,
  type,
  severity,
  status,
  location,
  address,
  latitude,
  longitude,
  description,
  anonymous,
  reporter_name,
  reporter_contact,
  assigned_body,
  priority_score,
  response_eta,
  attachments,
  timeline,
  created_at,
  updated_at
`;

const STATUS_UPDATE_SELECT_COLUMNS = `
  id,
  incident_id,
  status,
  title,
  note,
  actor_name,
  created_at
`;

function createIncidentId(): string {
  const year = new Date().getFullYear();
  const timestampPart = Date.now().toString().slice(-6);
  const randomPart = Math.floor(100 + Math.random() * 900);

  return `INC-${year}-${timestampPart}${randomPart}`;
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function formatNow(): string {
  return formatDateTime(new Date().toISOString());
}

function safeText(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();

  if (!trimmed) {
    return fallback;
  }

  return trimmed;
}

function getDraftLatitude(draft: DraftIncident): number | null {
  const value = (draft as unknown as { latitude?: number | null }).latitude;

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  return null;
}

function getDraftLongitude(draft: DraftIncident): number | null {
  const value = (draft as unknown as { longitude?: number | null }).longitude;

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  return null;
}

async function getCurrentSupabaseUserId(): Promise<string> {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error('Please sign in before submitting an incident report.');
  }

  return user.id;
}

function mapStatusUpdateToTimelineItem(row: SupabaseStatusUpdateRow): IncidentTimelineItem {
  return {
    id: row.id,
    status: row.status as IncidentStatus,
    title: row.title || row.status,
    description: row.note || `Status updated to ${row.status}.`,
    actor: row.actor_name || 'Operations Team',
    timestamp: formatDateTime(row.created_at)
  };
}

function getFallbackTimeline(row: SupabaseIncidentRow): IncidentTimelineItem[] {
  if (Array.isArray(row.timeline) && row.timeline.length > 0) {
    return row.timeline;
  }

  return [
    {
      id: `${row.public_id}-submitted`,
      status: 'Submitted',
      title: 'Submitted',
      description: 'Incident report submitted from the mobile app.',
      actor: 'Reporter',
      timestamp: formatDateTime(row.created_at)
    }
  ];
}

function mapRowToIncident(
  row: SupabaseIncidentRow,
  realTimeline?: IncidentTimelineItem[]
): Incident {
  const reportedAt = formatDateTime(row.created_at);
  const timeline = realTimeline && realTimeline.length > 0 ? realTimeline : getFallbackTimeline(row);

  const incident = {
    id: row.public_id,
    title: row.title,
    type: row.type,
    severity: row.severity,
    status: row.status,
    location: row.location,
    address: row.address ?? row.location,
    distanceKm: 0,
    reportedAt,
    reporterName: row.reporter_name ?? 'You',
    reporterContact: row.reporter_contact ?? 'Mobile App',
    description: row.description,
    anonymous: row.anonymous,
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    timeline,

    assignedBody: row.assigned_body ?? undefined,
    assignedUnitName: row.assigned_body ?? undefined,
    responseEta: row.response_eta ?? undefined,
    priorityScore: row.priority_score,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  } as unknown as Incident;

  return incident;
}

function createInitialTimeline(publicId: string): IncidentTimelineItem[] {
  const now = formatNow();

  return [
    {
      id: `${publicId}-submitted`,
      status: 'Submitted' as IncidentStatus,
      title: 'Submitted',
      description: 'Incident report submitted from the mobile app.',
      actor: 'Reporter',
      timestamp: now
    }
  ];
}

async function createStatusUpdateRow(
  internalIncidentId: string,
  status: IncidentStatus,
  title: string,
  note: string,
  actorName = 'Reporter'
): Promise<void> {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { error } = await supabase.from('incident_status_updates').insert({
    incident_id: internalIncidentId,
    status,
    title,
    note,
    actor_id: user?.id ?? null,
    actor_name: actorName
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function loadTimelinesForIncidentRows(
  rows: SupabaseIncidentRow[]
): Promise<Record<string, IncidentTimelineItem[]>> {
  const internalIds = rows.map((row) => row.id);

  if (!internalIds.length) {
    return {};
  }

  const { data, error } = await supabase
    .from('incident_status_updates')
    .select(STATUS_UPDATE_SELECT_COLUMNS)
    .in('incident_id', internalIds)
    .order('created_at', { ascending: true });

  if (error) {
    return {};
  }

  return (data ?? []).reduce<Record<string, IncidentTimelineItem[]>>((result, item) => {
    const row = item as SupabaseStatusUpdateRow;
    const timelineItem = mapStatusUpdateToTimelineItem(row);

    if (!result[row.incident_id]) {
      result[row.incident_id] = [];
    }

    result[row.incident_id].push(timelineItem);

    return result;
  }, {});
}

export async function loadMyIncidents(): Promise<Incident[]> {
  const userId = await getCurrentSupabaseUserId();

  const { data, error } = await supabase
    .from('incidents')
    .select(INCIDENT_SELECT_COLUMNS)
    .eq('reporter_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as SupabaseIncidentRow[];
  const timelinesByIncidentId = await loadTimelinesForIncidentRows(rows);
  const incidents = rows.map((row) => mapRowToIncident(row, timelinesByIncidentId[row.id]));

  incidentCache.items = incidents;

  return incidents;
}

export function getCachedIncidents(): Incident[] {
  return incidentCache.items;
}

export async function getIncidentById(id: string): Promise<Incident | undefined> {
  const userId = await getCurrentSupabaseUserId();

  const { data, error } = await supabase
    .from('incidents')
    .select(INCIDENT_SELECT_COLUMNS)
    .eq('reporter_id', userId)
    .eq('public_id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return undefined;
  }

  const row = data as SupabaseIncidentRow;
  const timelinesByIncidentId = await loadTimelinesForIncidentRows([row]);

  return mapRowToIncident(row, timelinesByIncidentId[row.id]);
}

export async function createIncidentFromDraft(draft: DraftIncident): Promise<Incident> {
  const userId = await getCurrentSupabaseUserId();
  const publicId = createIncidentId();

  const title = safeText(draft.title, 'Untitled Incident');
  const type = draft.type ?? 'Other';
  const severity = draft.severity ?? 'Low';
  const location = safeText(draft.location, 'Current Location');
  const address = safeText(draft.address, 'Location captured from device');
  const description = safeText(draft.description, 'No description provided.');
  const reporterContact = safeText(draft.reporterContact, 'Mobile App');
  const rawAttachments = Array.isArray(draft.attachments) ? draft.attachments : [];
  const uploadedAttachments = await uploadEvidenceAttachments(userId, publicId, rawAttachments);
  const timeline = createInitialTimeline(publicId);

  const priorityScore =
    severity === 'Critical'
      ? 100
      : severity === 'High'
        ? 80
        : severity === 'Medium'
          ? 50
          : 20;

  const payload = {
    public_id: publicId,
    reporter_id: userId,

    title,
    type,
    severity,
    status: 'Submitted',

    location,
    address,
    latitude: getDraftLatitude(draft),
    longitude: getDraftLongitude(draft),

    description,
    anonymous: draft.anonymous,

    reporter_name: draft.anonymous ? 'Anonymous' : 'You',
    reporter_contact: reporterContact,

    assigned_body: null,
    priority_score: priorityScore,
    response_eta: null,

    attachments: uploadedAttachments,
    timeline
  };

  const { data, error } = await supabase
    .from('incidents')
    .insert(payload)
    .select(INCIDENT_SELECT_COLUMNS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const incidentRow = data as SupabaseIncidentRow;

  await createStatusUpdateRow(
    incidentRow.id,
    'Submitted',
    'Report submitted',
    'Incident report submitted from the mobile app. Admin Control Desk can now review and route it.',
    'Reporter'
  );

  const refreshedIncident = await getIncidentById(publicId);
  const incident = refreshedIncident ?? mapRowToIncident(incidentRow, timeline);

  incidentCache.items = [incident, ...incidentCache.items];

  return incident;
}

export async function updateIncidentStatus(
  id: string,
  nextStatus: IncidentStatus,
  actor = 'Operations Team'
): Promise<Incident | undefined> {
  const existing = await getIncidentById(id);

  if (!existing) {
    return undefined;
  }

  const now = formatNow();

  const nextTimeline: IncidentTimelineItem[] = [
    ...existing.timeline,
    {
      id: `${id}-${nextStatus}-${Date.now()}`,
      status: nextStatus,
      title: nextStatus,
      description: `Status changed to ${nextStatus}.`,
      actor,
      timestamp: now
    }
  ];

  const { data, error } = await supabase
    .from('incidents')
    .update({
      status: nextStatus,
      timeline: nextTimeline
    })
    .eq('public_id', id)
    .select(INCIDENT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return undefined;
  }

  const incidentRow = data as SupabaseIncidentRow;

  await createStatusUpdateRow(
    incidentRow.id,
    nextStatus,
    nextStatus,
    `Status changed to ${nextStatus}.`,
    actor
  );

  const updatedIncident = (await getIncidentById(id)) ?? mapRowToIncident(incidentRow, nextTimeline);

  incidentCache.items = incidentCache.items.map((incident) =>
    incident.id === id ? updatedIncident : incident
  );

  return updatedIncident;
}

export async function resetIncidentsToDemoData(): Promise<Incident[]> {
  return loadMyIncidents();
}
