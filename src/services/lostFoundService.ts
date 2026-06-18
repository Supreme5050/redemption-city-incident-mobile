import { EvidenceAttachment } from '../types/incident';
import { LostFoundDraft, LostFoundMode, LostFoundRecord, LostFoundReport, LostFoundStatus } from '../types/lostFound';
import { supabase } from '../lib/supabase';
import { uploadEvidenceAttachments } from './evidenceUploadService';

type SupabaseLostFoundRow = {
  id: string;
  public_id: string;
  reporter_id: string;
  report_type: string;
  item_name: string;
  category: string;
  description: string;
  location: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  reporter_name: string | null;
  reporter_contact: string | null;
  anonymous: boolean;
  attachments: EvidenceAttachment[] | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

const LOST_FOUND_SELECT_COLUMNS = `
  id,
  public_id,
  reporter_id,
  report_type,
  item_name,
  category,
  description,
  location,
  address,
  latitude,
  longitude,
  status,
  reporter_name,
  reporter_contact,
  anonymous,
  attachments,
  admin_note,
  created_at,
  updated_at
`;

function createLostFoundId(): string {
  const year = new Date().getFullYear();
  const timestampPart = Date.now().toString().slice(-6);
  const randomPart = Math.floor(100 + Math.random() * 900);

  return `LF-${year}-${timestampPart}${randomPart}`;
}

function safeText(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();

  if (!trimmed) {
    return fallback;
  }

  return trimmed;
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
    throw new Error('Please sign in before submitting a Lost & Found report.');
  }

  return user.id;
}

function createPhotoAttachmentFromDraft(draft: LostFoundDraft): EvidenceAttachment[] {
  if (draft.attachments?.length) {
    return draft.attachments;
  }

  if (!draft.imageUri) {
    return [];
  }

  return [
    {
      id: `lost-found-photo-${Date.now()}`,
      type: 'Photo',
      name: draft.photoLabel || 'Lost & Found item photo',
      size: 'Attached',
      uri: draft.imageUri,
      thumbnailLabel: draft.photoLabel || 'Item photo'
    }
  ];
}

function mapRowToLostFoundRecord(row: SupabaseLostFoundRow): LostFoundRecord {
  const mode = row.report_type as LostFoundMode;
  const attachments = Array.isArray(row.attachments) ? row.attachments : [];
  const firstPhoto = attachments.find((item) => item.type === 'Photo' && item.uri);

  return {
    id: row.public_id,
    mode,
    reportType: mode,
    itemName: row.item_name,
    category: row.category,
    description: row.description,
    locationLabel: row.location,
    location: row.location,
    address: row.address ?? row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    status: row.status as LostFoundStatus,
    reporterName: row.reporter_name ?? 'You',
    contact: row.reporter_contact ?? 'Mobile App',
    reporterContact: row.reporter_contact ?? 'Mobile App',
    anonymous: row.anonymous,
    imageUri: firstPhoto?.uri,
    photoLabel: firstPhoto?.thumbnailLabel,
    attachments,
    adminNote: row.admin_note ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function loadMyLostFoundReports(): Promise<LostFoundRecord[]> {
  const userId = await getCurrentSupabaseUserId();

  const { data, error } = await supabase
    .from('lost_found_reports')
    .select(LOST_FOUND_SELECT_COLUMNS)
    .eq('reporter_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapRowToLostFoundRecord(row as SupabaseLostFoundRow));
}

export async function loadLostFoundRecords(): Promise<LostFoundRecord[]> {
  return loadMyLostFoundReports();
}

export async function getLostFoundReportById(id: string): Promise<LostFoundRecord | undefined> {
  const userId = await getCurrentSupabaseUserId();

  const { data, error } = await supabase
    .from('lost_found_reports')
    .select(LOST_FOUND_SELECT_COLUMNS)
    .eq('reporter_id', userId)
    .eq('public_id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return undefined;
  }

  return mapRowToLostFoundRecord(data as SupabaseLostFoundRow);
}

export async function createLostFoundReportFromDraft(draft: LostFoundDraft): Promise<LostFoundRecord> {
  const userId = await getCurrentSupabaseUserId();
  const publicId = createLostFoundId();

  const reportType = draft.reportType ?? draft.mode ?? 'Lost Item';
  const itemName = safeText(draft.itemName, 'Unnamed item');
  const category = safeText(draft.category, 'General');
  const description = safeText(draft.description, 'No description provided.');
  const location = safeText(draft.location ?? draft.locationLabel, 'Current Location');
  const address = safeText(draft.address, 'Location captured from device');
  const reporterContact = safeText(draft.reporterContact ?? draft.contact, 'Mobile App');
  const rawAttachments = createPhotoAttachmentFromDraft(draft);

  const uploadedAttachments = await uploadEvidenceAttachments(
    userId,
    `lost-found-${publicId}`,
    rawAttachments
  );

  const payload = {
    public_id: publicId,
    reporter_id: userId,

    report_type: reportType,
    item_name: itemName,
    category,
    description,

    location,
    address,
    latitude: draft.latitude ?? null,
    longitude: draft.longitude ?? null,

    status: 'Open',
    reporter_name: draft.anonymous ? 'Anonymous' : 'You',
    reporter_contact: reporterContact,
    anonymous: draft.anonymous ?? false,

    attachments: uploadedAttachments,
    admin_note: null
  };

  const { data, error } = await supabase
    .from('lost_found_reports')
    .insert(payload)
    .select(LOST_FOUND_SELECT_COLUMNS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToLostFoundRecord(data as SupabaseLostFoundRow);
}

export async function createLostFoundRecord(draft: LostFoundDraft): Promise<LostFoundRecord> {
  return createLostFoundReportFromDraft(draft);
}

export async function updateLostFoundStatus(
  id: string,
  status: LostFoundStatus
): Promise<LostFoundReport | undefined> {
  const { data, error } = await supabase
    .from('lost_found_reports')
    .update({ status })
    .eq('public_id', id)
    .select(LOST_FOUND_SELECT_COLUMNS)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return undefined;
  }

  return mapRowToLostFoundRecord(data as SupabaseLostFoundRow);
}
