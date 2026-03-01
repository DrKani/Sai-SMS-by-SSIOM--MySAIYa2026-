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

export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  category: string; // 'Live' (Purple), 'Virtual' (Teal), 'Festival' (Green)
  image?: string;
  isStudy?: boolean;
  mapEmbed?: string;
  meetingLink?: string; // Zoom/Meet
  rsvpLink?: string;
  isRecurring?: boolean;
  recurrenceRule?: 'weekly' | 'monthly';
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
