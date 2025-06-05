export interface User {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'admin' | 'super-admin';
  avatar?: string;
  createdAt: Date;
  lastActive: Date;
}

export interface AudioSegment {
  id: string;
  batchId: string;
  filename: string;
  duration: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'returned';
  transcription?: string;
  assignedTo?: string;
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  returnReason?: string;
  waveformData?: number[];
}

export interface Batch {
  id: string;
  name: string;
  totalSegments: number;
  completedSegments: number;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  assignedWorkers: string[];
}

export interface TranscriptionProgress {
  segmentId: string;
  progress: number;
  lastSaved: Date;
  autoSaveEnabled: boolean;
}

export interface ReviewItem {
  segmentId: string;
  transcription: string;
  submittedBy: string;
  submittedAt: Date;
  audioUrl: string;
  duration: number;
}

export interface Statistics {
  totalSegments: number;
  completedSegments: number;
  averageProcessingTime: number;
  approvalRate: number;
  activeWorkers: number;
  dailyProgress: {
    date: string;
    completed: number;
  }[];
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current: boolean;
  roles: User['role'][];
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
}

export interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export type DenialReason = 
  | 'poor-audio-quality'
  | 'incorrect-transcription'
  | 'incomplete-transcription'
  | 'formatting-issues'
  | 'other';

export interface ReviewDecision {
  segmentId: string;
  decision: 'approve' | 'deny';
  reason?: DenialReason;
  comments?: string;
  reviewedBy: string;
  reviewedAt: Date;
}