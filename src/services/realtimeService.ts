import { Incident } from '../types/incident';
import { supabase } from '../lib/supabase';
import { loadMyIncidents } from './incidentService';

export type IncidentRealtimeSnapshot = {
  incidents: Incident[];
  reason: string;
  receivedAt: string;
};

type SnapshotHandler = (snapshot: IncidentRealtimeSnapshot) => void;
type ErrorHandler = (error: Error) => void;

type RealtimeStatus =
  | 'SUBSCRIBED'
  | 'TIMED_OUT'
  | 'CLOSED'
  | 'CHANNEL_ERROR'
  | string;

function toError(error: unknown, fallback: string): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error(fallback);
}

export function subscribeToMyIncidentRealtime(
  userId: string,
  onSnapshot: SnapshotHandler,
  onError?: ErrorHandler
): () => void {
  let isDisposed = false;
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  async function refreshFromSupabase(reason: string) {
    try {
      const incidents = await loadMyIncidents();

      if (isDisposed) {
        return;
      }

      onSnapshot({
        incidents,
        reason,
        receivedAt: new Date().toISOString()
      });
    } catch (error) {
      if (!isDisposed) {
        onError?.(toError(error, 'Unable to refresh realtime incident updates.'));
      }
    }
  }

  function scheduleRefresh(reason: string) {
    if (isDisposed) {
      return;
    }

    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }

    refreshTimer = setTimeout(() => {
      refreshFromSupabase(reason);
    }, 600);
  }

  const channel = supabase
    .channel(`mobile-incident-realtime-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'incidents',
        filter: `reporter_id=eq.${userId}`
      },
      () => {
        scheduleRefresh('incident_changed');
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'incident_status_updates'
      },
      () => {
        scheduleRefresh('timeline_changed');
      }
    )
    .subscribe((status: RealtimeStatus) => {
      if (status === 'SUBSCRIBED') {
        scheduleRefresh('realtime_connected');
        return;
      }

      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        onError?.(new Error(`Realtime connection ${status.toLowerCase().replace('_', ' ')}.`));
      }
    });

  return () => {
    isDisposed = true;

    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }

    supabase.removeChannel(channel);
  };
}