import * as FileSystem from 'expo-file-system/legacy';

import { EvidenceAttachment } from '../types/incident';
import { supabase } from '../lib/supabase';

const EVIDENCE_BUCKET = 'incident-evidence';

type UploadableEvidenceAttachment = EvidenceAttachment & {
  uri?: string;
  url?: string;
  publicUrl?: string;
  storagePath?: string;
  mimeType?: string;
  fileName?: string;
  sizeBytes?: number;
  uploadStatus?: 'uploaded' | 'failed' | 'skipped';
  uploadError?: string;
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

function sanitizeFileName(value: string): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return cleaned || `evidence-${Date.now()}`;
}

function encodeStoragePath(path: string): string {
  return path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
}

function getFallbackExtension(type: string): string {
  if (type === 'Video') {
    return 'mp4';
  }

  if (type === 'Document') {
    return 'pdf';
  }

  return 'jpg';
}

function guessMimeType(attachment: UploadableEvidenceAttachment): string {
  if (attachment.mimeType) {
    return attachment.mimeType;
  }

  const name = String(attachment.fileName || attachment.name || '').toLowerCase();

  if (name.endsWith('.png')) {
    return 'image/png';
  }

  if (name.endsWith('.webp')) {
    return 'image/webp';
  }

  if (name.endsWith('.mp4')) {
    return 'video/mp4';
  }

  if (name.endsWith('.mov')) {
    return 'video/quicktime';
  }

  if (name.endsWith('.pdf')) {
    return 'application/pdf';
  }

  if (attachment.type === 'Video') {
    return 'video/mp4';
  }

  if (attachment.type === 'Document') {
    return 'application/pdf';
  }

  return 'image/jpeg';
}

function buildStoragePath(
  userId: string,
  reportPublicId: string,
  attachment: UploadableEvidenceAttachment,
  index: number
): string {
  const safeReportId = sanitizeFileName(reportPublicId);
  const safeName = sanitizeFileName(
    attachment.fileName || attachment.name || `evidence-${index + 1}`
  );

  const hasExtension = /\.[a-z0-9]+$/i.test(safeName);
  const finalName = hasExtension
    ? safeName
    : `${safeName}.${getFallbackExtension(attachment.type)}`;

  return `${userId}/${safeReportId}/${Date.now()}-${index + 1}-${finalName}`;
}

function getPublicUrl(storagePath: string): string {
  const { data } = supabase.storage.from(EVIDENCE_BUCKET).getPublicUrl(storagePath);

  return data.publicUrl;
}

async function getAccessToken(): Promise<string> {
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session?.access_token) {
    throw new Error('Please sign in again before uploading evidence.');
  }

  return session.access_token;
}

async function uploadLocalFileWithExpoFileSystem(
  localUri: string,
  storagePath: string,
  contentType: string,
  accessToken: string
): Promise<void> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables.');
  }

  const encodedPath = encodeStoragePath(storagePath);
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${EVIDENCE_BUCKET}/${encodedPath}`;

  const result = await FileSystem.uploadAsync(uploadUrl, localUri, {
    httpMethod: 'POST',
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': contentType,
      'x-upsert': 'false'
    }
  });

  if (result.status < 200 || result.status >= 300) {
    throw new Error(result.body || `Evidence upload failed with status ${result.status}.`);
  }
}

async function uploadRemoteFileWithFetch(
  remoteUri: string,
  storagePath: string,
  contentType: string
): Promise<void> {
  const response = await fetch(remoteUri);

  if (!response.ok) {
    throw new Error(`Unable to read evidence file: ${response.status}`);
  }

  const fileBlob = await response.blob();

  const { error } = await supabase.storage.from(EVIDENCE_BUCKET).upload(storagePath, fileBlob, {
    contentType,
    upsert: false
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function uploadSingleAttachment(
  userId: string,
  reportPublicId: string,
  attachment: UploadableEvidenceAttachment,
  index: number,
  accessToken: string
): Promise<UploadableEvidenceAttachment> {
  if (!attachment.uri) {
    return {
      ...attachment,
      uploadStatus: 'skipped'
    };
  }

  if (attachment.storagePath || attachment.publicUrl || attachment.url) {
    return {
      ...attachment,
      uploadStatus: 'uploaded'
    };
  }

  const storagePath = buildStoragePath(userId, reportPublicId, attachment, index);
  const contentType = guessMimeType(attachment);

  try {
    if (
      attachment.uri.startsWith('file://') ||
      attachment.uri.startsWith('content://') ||
      attachment.uri.startsWith('ph://')
    ) {
      await uploadLocalFileWithExpoFileSystem(attachment.uri, storagePath, contentType, accessToken);
    } else {
      await uploadRemoteFileWithFetch(attachment.uri, storagePath, contentType);
    }

    const publicUrl = getPublicUrl(storagePath);

    return {
      ...attachment,
      storagePath,
      publicUrl,
      url: publicUrl,
      mimeType: contentType,
      uploadStatus: 'uploaded'
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Evidence upload failed.';

    return {
      ...attachment,
      mimeType: contentType,
      uploadStatus: 'failed',
      uploadError: message
    };
  }
}

export async function uploadEvidenceAttachments(
  userId: string,
  reportPublicId: string,
  attachments: EvidenceAttachment[]
): Promise<EvidenceAttachment[]> {
  if (!attachments.length) {
    return [];
  }

  const accessToken = await getAccessToken();
  const uploadedAttachments: UploadableEvidenceAttachment[] = [];

  for (let index = 0; index < attachments.length; index += 1) {
    const uploaded = await uploadSingleAttachment(
      userId,
      reportPublicId,
      attachments[index] as UploadableEvidenceAttachment,
      index,
      accessToken
    );

    uploadedAttachments.push(uploaded);
  }

  return uploadedAttachments as EvidenceAttachment[];
}