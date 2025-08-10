export type NotificationKind = 'issue' | 'announcement';

export interface NotificationActionLink {
  // Tab to open in dashboard, e.g., 'content' | 'design' | 'settings'
  targetTab?: string;
  // Section to edit inside 'content' tab, e.g., 'experience' | 'education' | 'projects' | 'skills'
  section?: string;
  // Optional index within the section
  index?: number;
}

export interface AppNotification {
  id: string; // unique id for dedupe
  kind: NotificationKind;
  title: string;
  message?: string;
  createdAt: number; // epoch ms
  read: boolean;
  action?: NotificationActionLink;
  // Optional stable key for deduping repeated validations (e.g., issue-experience-0-date)
  dedupeKey?: string;
}

