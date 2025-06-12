export interface TimelineEvent {
  id: string;
  type: string;
  timestamp: string;
  actor?: string;
  payload?: Record<string, unknown> | null;
  tags?: string[];
}

export interface TimelineMeta {
  sessionId: string;
  createdAt: string;
  source?: string;
}

export interface Timeline {
  events: TimelineEvent[];
  meta: TimelineMeta;
}