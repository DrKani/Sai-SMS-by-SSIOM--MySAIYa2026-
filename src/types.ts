export interface UserProfile {
  uid: string;
  name: string;
  state: string;
  centre?: string;
  email?: string;
  gender?: 'male' | 'female';
  avatarUrl?: string; // Internal app avatar
  photoURL?: string; // Firebase Auth photo
  joinedAt: string;
  isGuest?: boolean;
  isAdmin?: boolean;
  onboardingDone?: boolean;
  onboardedApp?: boolean; // Tutorial: has user seen the main app onboarding tour?
  fcmTokens?: string[]; // Push notification tokens
  notificationsEnabled?: boolean;
  streak?: number;
  lastActivity?: string; // ISO Date of last submission

  // Extended Profile Fields
  publicReflections?: boolean;
  publicLeaderboard?: boolean;
  phone?: string;
  bio?: string;
  accomplishments?: string;
  homeAddress?: string;
  workAddress?: string;
  recoveryEmail?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  stats?: {
    gayathri: number;
    saiGayathri: number;
    likitha: number;
    mantras?: number;
  };
}

export interface Reflection {
  id: string;
  uid: string;
  userName: string;
  weekId: string;
  chapterTitle: string;
  content: string;
  timestamp: string;
  isPublic: boolean;
  status: 'pending' | 'approved' | 'rejected';
  adminComments?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  action: string;
  target: string;
  outcome: 'success' | 'failure';
}

export interface DatabaseHealthReport {
  lastScan: string;
  status: 'healthy' | 'degraded' | 'critical';
  issues: {
    key: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  stats: {
    totalKeys: number;
    storageSize: string;
    orphanRecords: number;
  };
}

export interface BookClubQuizQuestion {
  question: string;
  options: string[]; // Should be exactly 4
  correctAnswer: number; // 0-3
  explanation: string;
  citation: string;
  points?: number; // Added for gamification
}

export interface BookClubWeek {
  weekId: string;
  book: string;
  chapterTitle: string;
  topic: string;
  pages: string;
  complexity?: string;
  // Content Fields
  contentRaw: string; // Deprecated in favor of summaryRaw + sourceUrl, but kept for backward compatibility if needed
  summaryRaw: string; // Rich text summary
  sourceUrl: string; // External reading material URL
  imageUrl?: string; // Illustration
  pdfUrl?: string; // Optional PDF backup
  // Metadata
  durationMinutes: number;
  learningOutcomes: string[];
  reflectionPrompts: string[]; // Changed from single string to array
  // Assessment
  questions: BookClubQuizQuestion[];
  quizCutoff: number; // Score required for Excellence Badge
  // Scheduling
  publishAt: string; // ISO Date
  status: 'draft' | 'in-review' | 'scheduled' | 'published' | 'unassigned';
  interestingBit: string; // Kept for legacy
  // Analytics
  analytics?: {
    totalReads: number;
    scrollDepthAvg: number;
    badgeDistribution: {
      reader: number;
      excellent: number;
      failed: number;
    };
  };
}

export interface QuizSubmission {
  weekId: string;
  timestamp: string;
  score: number; // 0 - 100
  answers: { questionIdx: number; selectedOption: number; isCorrect: boolean }[];
  maxScore: number;
}

export interface UserBriefcaseItem {
  id: string;
  type: 'quiz_result' | 'reflection' | 'note' | 'word_card';
  weekId?: string;
  title: string;
  content: any; // Could be text for reflection, or QuizSubmission object
  timestamp: string;
}

export interface Annotation {
  id: string;
  weekId: string;
  textSnippet: string;
  note: string;
  color: 'yellow' | 'green' | 'blue';
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Event' | 'News' | 'Spiritual';
  isPinned: boolean;
  timestamp: string;
  imageUrl?: string;
  validUntil?: string;
}

import { Timestamp } from 'firebase/firestore';

export interface SmsEvent {
  eventId: string;
  title: string;
  description: string;
  eventDate: any; // Timestamp (using any to avoid strict version mismatches if needed, but intended as Firestore Timestamp)
  endDate?: any; // Timestamp
  location: string; // "Online" or physical address
  type: 'spiritual' | 'service' | 'learning' | 'festival';
  maxAttendees?: number;
  registeredCount: number;
  registeredUsers: string[]; // Array of UIDs
  imageUrl?: string;
  createdBy: string; // Admin UID
  createdAt: any; // Timestamp
  status: 'draft' | 'published' | 'cancelled';
  // Legacy fields for compatibility during transition
  id?: string;
  category?: string;
  date?: string;
  time?: string;
  meetingLink?: string;
  rsvpLink?: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  sequenceCorrect?: string[]; // Added for QuoteGame
}

export interface Bookmark {
  id: string;
  weekId: string;
  chapterTitle: string;
  text: string;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Gratitude' | 'Prayer' | 'Lesson';
  entryDate: string;
  timestamp: string;
}

// Unified Article interfaces moved below

export interface BrandingConfig {
  logoHeader: string;
  logoFooter: string;
  logoAuth: string;
  favicon: string;
  pwaIcon: string;
}

export interface SiteContent {
  homeWelcomeText: string;
  footerAboutText: string;
  chantingIntroText: string;
}

// --- Notification ---
// Collection: notifications/{notificationId}
export interface AppNotification {
  id?: string;
  notificationId?: string;
  uid: string;                    // Target user UID
  title: string;
  body: string;
  type: 'announcement' | 'event' | 'system' | 'badge' | 'streak' | 'reminder';
  isRead: boolean;
  deliveredAt?: string;            // ISO timestamp (server sets on delivery)
  fcmToken?: string;              // FCM token used for delivery
  data?: Record<string, string>;  // Extra key-value payload for deep-linking
  createdAt: any;                 // ISO timestamp or Firestore Timestamp
}

// --- Article ---
// Collection: articles/{articleId}
export interface Article {
  id?: string;                    // Legacy ID
  articleId?: string;             // New precise ID
  title: string;
  slug?: string;                  // URL-safe identifier, must be unique
  content: string;                // Markdown / rich text body
  excerpt: string;                // Short preview (≤200 chars)
  imageUrl?: string;              // Legacy image
  coverImageUrl?: string;         // New image
  author?: string;                // Legacy author name
  authorName?: string;            // New author name
  authorUid: string;
  category?: string;
  tags: string[];
  publishedAt?: string;           // ISO timestamp; null when not yet published
  createdAt?: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  commentsEnabled?: boolean;      // Legacy flag
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
}

// --- Comment ---
// Collection: comments/{commentId}
export interface ArticleComment {
  id?: string;                    // Legacy ID
  commentId?: string;             // New ID
  articleId: string;              // Parent article
  uid: string;
  userName: string;
  userAvatarUrl?: string;         // Legacy avatar
  content: string;
  timestamp?: string;             // Legacy timestamp
  createdAt?: string;
  updatedAt?: string;
  status?: 'pending' | 'approved' | 'rejected'; // Legacy status
  isApproved?: boolean;           // Requires admin approval before display
  parentCommentId?: string;       // Set for nested replies
}

// --- Poll ---
// Collection: polls/{pollId}
export interface PollOption {
  optionId: string;
  text: string;
  voteCount: number;
}

export interface Poll {
  pollId: string;
  question: string;
  options: PollOption[];
  createdBy: string;              // Admin UID
  targetAudience: 'all' | string; // 'all', a state name, or centre name
  status: 'draft' | 'active' | 'closed';
  startAt: string;                // ISO timestamp
  endAt: string;                  // ISO timestamp
  totalResponses: number;
  createdAt: string;
  updatedAt: string;
}

// --- PollResponse ---
// Collection: pollResponses/{responseId}
export interface PollResponse {
  responseId: string;
  pollId: string;
  uid: string;
  selectedOptionId: string;
  submittedAt: string;            // ISO timestamp
}

// --- ContactSubmission ---
// Collection: contactSubmissions/{submissionId}
export interface ContactSubmission {
  submissionId: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  state?: string;
  centre?: string;
  status: 'new' | 'in-review' | 'resolved' | 'closed';
  assignedTo?: string;            // Admin UID handling this submission
  adminNotes?: string;
  submittedAt: string;            // ISO timestamp
  updatedAt?: string;
}

// --- Badge ---
// Subcollection: users/{uid}/badges/{badgeId}
export interface Badge {
  badgeId: string;
  uid: string;
  type: 'reader' | 'excellence' | 'streak' | 'contributor' | 'special';
  name: string;
  description: string;
  iconUrl?: string;
  earnedAt: string;               // ISO timestamp
  weekId?: string;                // Source book-club week, if applicable
  metadata?: Record<string, unknown>;
}
