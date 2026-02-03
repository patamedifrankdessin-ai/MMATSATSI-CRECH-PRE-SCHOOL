
export type View = 'dashboard' | 'learners' | 'documents' | 'attendance' | 'schedule' | 'trash';

export interface LogEntry {
  date: string;
  action: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  date: string;
  read: boolean;
}

export interface Learner {
  id: string;
  name: string;
  age: number;
  gender: 'Boy' | 'Girl' | 'Other';
  group: string; // e.g., Babies, Toddlers, Grade R
  email?: string;
  phone?: string;
  joinedDate: string;
  status: 'active' | 'inactive';
  attendance: Record<string, 'present' | 'absent' | 'late'>;
  activityLog: LogEntry[];
}

export interface Document {
  id: string;
  title: string;
  content: string;
  type: 'word' | 'excel' | 'pdf_ref';
  lastModified: string;
  category: string;
}

export interface TrashItem {
  id: string;
  originalId: string;
  type: 'learner' | 'document';
  itemData: any;
  deletedDate: string;
  title: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
  date: string;
}

export interface AppState {
  learners: Learner[];
  documents: Document[];
  schedule: ScheduleEvent[];
  activeView: View;
  notifications: Notification[];
  trash: TrashItem[];
}
