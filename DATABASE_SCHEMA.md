# SAI SMS Database Schema Reference

> **Project:** SAI SMS by SSIOM — MySAIYa 2026
> **Backend:** Firebase Firestore (NoSQL)
> **Last Updated:** 2026-03-02

---

## Table of Contents

1. [users/{uid}](#usersuid)
2. [users/{uid}/gameProgress/{gameId}](#usersuidgameprogressgameid)
3. [users/{uid}/briefcase/{itemId}](#usersuidbriefcaseitemid)
4. [users/{uid}/badges/{badgeId}](#usersuidbadgesbadgeid) *(new)*
5. [metadata/national_stats](#metadatanational_stats)
6. [metadata/national_stats/participants/{userId}](#metadatanational_statsparticipantsuserid)
7. [badge_events/{eventId}](#badge_eventseventid)
8. [journals/{journalId}](#journalsjournalid)
9. [sadhanaDaily/{docId}](#sadhanadailydocid)
10. [announcements/{docId}](#announcementsdocid)
11. [bookclubWeeks/{docId}](#bookclubweeksdocid)
12. [notifications/{notificationId}](#notificationsnotificationid) *(new)*
13. [articles/{articleId}](#articlesarticleid) *(new)*
14. [comments/{commentId}](#commentscommentid) *(new)*
15. [polls/{pollId}](#pollspollid) *(new)*
16. [pollResponses/{responseId}](#pollresponsesresponseid) *(new)*
17. [contactSubmissions/{submissionId}](#contactsubmissionssubmissionid) *(new)*

---

## users/{uid}

**Purpose:** User account profiles and settings.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | `string` | ✓ | Firebase Auth user ID (matches document ID) |
| `name` | `string` | ✓ | Display name |
| `email` | `string` | ✓ | Email address |
| `gender` | `'male' \| 'female'` | ✓ | Determines avatar selection |
| `state` | `string` | ✓ | Malaysian state |
| `centre` | `string` | ✓ | Sai centre affiliation |
| `photoURL` | `string` | — | Profile picture URL (Firebase Auth photo) |
| `avatarUrl` | `string` | — | In-app avatar URL |
| `joinedAt` | `string` | ✓ | ISO 8601 timestamp of account creation |
| `isGuest` | `boolean` | ✓ | `true` for anonymous/guest accounts |
| `isAdmin` | `boolean` | ✓ | Admin role flag; writable only by admins |
| `onboardingDone` | `boolean` | ✓ | Profile setup wizard completed |
| `onboardedApp` | `boolean` | — | Main app tutorial tour completed |
| `publicReflections` | `boolean` | — | Allow others to view reflections |
| `publicLeaderboard` | `boolean` | — | Show on leaderboard |
| `phone` | `string` | — | Contact phone number |
| `bio` | `string` | — | Short personal bio |
| `accomplishments` | `string` | — | Notable accomplishments |
| `homeAddress` | `string` | — | Home address |
| `workAddress` | `string` | — | Work address |
| `recoveryEmail` | `string` | — | Secondary recovery email |
| `socialLinks` | `object` | — | Social media links (see below) |
| `socialLinks.facebook` | `string` | — | Facebook profile URL |
| `socialLinks.twitter` | `string` | — | Twitter/X profile URL |
| `socialLinks.linkedin` | `string` | — | LinkedIn profile URL |
| `socialLinks.youtube` | `string` | — | YouTube channel URL |
| `stats` | `object` | — | Chanting statistics (see below) |
| `stats.gayathri` | `number` | — | Gayathri mantra count |
| `stats.saiGayathri` | `number` | — | Sai Gayathri mantra count |
| `stats.likitha` | `number` | — | Likitha Japam count |
| `stats.mantras` | `number` | — | Total mantra count |

**Indexes:**
- `state` (ascending) — for state-filtered leaderboards
- `centre` (ascending) — for centre-filtered views
- `isAdmin` (ascending) — for admin user listings

**Security:**
- **Read:** Owner, admin, or user with `publicLeaderboard == true`
- **Write:** Owner or admin (isAdmin field writable by admin only)

---

## users/{uid}/gameProgress/{gameId}

**Purpose:** Persist word search and crossword game progress per user.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `gameId` | `string` | ✓ | Game identifier (e.g., `wordsearch_week_01`) |
| `uid` | `string` | ✓ | Owner's UID |
| `completedWords` | `string[]` | ✓ | List of found word IDs |
| `isCompleted` | `boolean` | ✓ | Whether the game is fully solved |
| `startedAt` | `string` | ✓ | ISO timestamp of first play |
| `completedAt` | `string` | — | ISO timestamp of completion |
| `score` | `number` | — | Points earned |

**Security:**
- **Read/Write:** Owner only (`request.auth.uid == userId`)

---

## users/{uid}/briefcase/{itemId}

**Purpose:** User's personal collection of saved content (quiz results, reflections, notes, word cards).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✓ | Item identifier |
| `type` | `'quiz_result' \| 'reflection' \| 'note' \| 'word_card'` | ✓ | Content type |
| `weekId` | `string` | — | Associated book club week |
| `title` | `string` | ✓ | Display title |
| `content` | `any` | ✓ | Payload — text string or `QuizSubmission` object |
| `timestamp` | `string` | ✓ | ISO timestamp of creation |

**Security:**
- **Read/Write:** Owner only

---

## users/{uid}/badges/{badgeId}

**Purpose:** Badge awards subcollection — tracks achievements earned by the user.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `badgeId` | `string` | ✓ | Unique badge award ID (matches document ID) |
| `uid` | `string` | ✓ | Owner's UID |
| `type` | `'reader' \| 'excellence' \| 'streak' \| 'contributor' \| 'special'` | ✓ | Badge category |
| `name` | `string` | ✓ | Human-readable badge name (e.g., `"Reader Badge – Week 3"`) |
| `description` | `string` | ✓ | Achievement description shown in UI |
| `iconUrl` | `string` | — | Badge icon image URL |
| `earnedAt` | `string` | ✓ | ISO 8601 timestamp of award |
| `weekId` | `string` | — | Source book-club week ID, if applicable |
| `metadata` | `object` | — | Arbitrary additional data (score, streak length, etc.) |

**Badge Types:**

| Type | Trigger |
|------|---------|
| `reader` | Completed a book club week reading |
| `excellence` | Scored above `quizCutoff` on a quiz |
| `streak` | Maintained a consecutive-day sadhana streak |
| `contributor` | Submitted approved reflections or articles |
| `special` | Admin-granted recognition |

**Indexes:**
- `uid` + `earnedAt` (descending) — recent badges list

**Security:**
- **Read:** Owner or admin
- **Create:** System (Cloud Functions) or admin
- **Update/Delete:** Admin only

---

## metadata/national_stats

**Purpose:** Aggregated national chanting statistics for the leaderboard and dashboard.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `totalGayathri` | `number` | ✓ | National Gayathri total |
| `totalSaiGayathri` | `number` | ✓ | National Sai Gayathri total |
| `totalLikitha` | `number` | ✓ | National Likitha Japam total |
| `byState` | `object` | ✓ | Per-state breakdown (state name → count object) |
| `lastUpdated` | `string` | ✓ | ISO timestamp of last aggregation |

**Security:**
- **Read:** Public (unauthenticated allowed)
- **Update:** Any authenticated user (via sadhana recording)

---

## metadata/national_stats/participants/{userId}

**Purpose:** Individual participant contribution to the national aggregate.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | `string` | ✓ | Participant's UID |
| `state` | `string` | ✓ | Malaysian state |
| `gayathri` | `number` | ✓ | Gayathri count |
| `saiGayathri` | `number` | ✓ | Sai Gayathri count |
| `likitha` | `number` | ✓ | Likitha count |
| `lastUpdated` | `string` | ✓ | ISO timestamp of last update |

**Security:**
- **Read:** Owner or admin
- **Write:** Owner only

---

## badge_events/{eventId}

**Purpose:** Transactional log of badge award triggers; processed by Cloud Functions before writing to `users/{uid}/badges`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `eventId` | `string` | ✓ | Event document ID |
| `userId` | `string` | ✓ | Target user UID |
| `badgeType` | `string` | ✓ | Badge type identifier |
| `source` | `string` | ✓ | Trigger source (e.g., `quiz_completion`, `streak_7`) |
| `weekId` | `string` | — | Associated week, if applicable |
| `processedAt` | `string` | — | ISO timestamp when the function processed the event |
| `status` | `'pending' \| 'processed' \| 'failed'` | ✓ | Processing state |

**Security:**
- **Read:** Owner or admin
- **Create:** Owner (client triggers badge evaluation)
- **Update/Delete:** Admin only

---

## journals/{journalId}

**Purpose:** Personal journal entries for reflection and spiritual notes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✓ | Document ID |
| `uid` | `string` | ✓ | Author's UID |
| `title` | `string` | ✓ | Entry title |
| `content` | `string` | ✓ | Journal body text |
| `category` | `'General' \| 'Gratitude' \| 'Prayer' \| 'Lesson'` | ✓ | Entry category |
| `entryDate` | `string` | ✓ | Date of the entry (`YYYY-MM-DD`) |
| `timestamp` | `string` | ✓ | ISO creation timestamp |

**Indexes:**
- `uid` + `entryDate` (descending)

**Security:**
- **Create:** Authenticated user (uid must match)
- **Read/Update/Delete:** Owner or admin

---

## sadhanaDaily/{docId}

**Purpose:** Daily chanting submission records.
Document ID convention: `{uid}_{YYYY-MM-DD}`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | `string` | ✓ | Submitter's UID |
| `date` | `string` | ✓ | Date string `YYYY-MM-DD` |
| `gayathri` | `number` | ✓ | Gayathri count for the day |
| `saiGayathri` | `number` | ✓ | Sai Gayathri count |
| `likitha` | `number` | ✓ | Likitha Japam count |
| `notes` | `string` | — | Optional personal notes |
| `submittedAt` | `string` | ✓ | ISO timestamp |

**Indexes:**
- `uid` + `date` (descending)

**Security:**
- **Read:** Owner or admin
- **Create:** Owner (uid must match)
- **Update:** Owner

---

## announcements/{docId}

**Purpose:** Community-wide announcements (events, news, spiritual messages).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✓ | Document ID |
| `title` | `string` | ✓ | Announcement headline |
| `content` | `string` | ✓ | Full announcement body |
| `category` | `'Event' \| 'News' \| 'Spiritual'` | ✓ | Classification |
| `isPinned` | `boolean` | ✓ | Pin to top of list |
| `timestamp` | `string` | ✓ | ISO creation timestamp |
| `imageUrl` | `string` | — | Optional banner image |
| `validUntil` | `string` | — | ISO expiry date; hide after this date |

**Security:**
- **Read:** Any authenticated user
- **Write:** Admin only

---

## bookclubWeeks/{docId}

**Purpose:** Weekly book club study material including reading content, quiz questions, and scheduling metadata.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `weekId` | `string` | ✓ | Document ID (e.g., `week_01`) |
| `book` | `string` | ✓ | Book title |
| `chapterTitle` | `string` | ✓ | Chapter name |
| `topic` | `string` | ✓ | Week's spiritual topic |
| `pages` | `string` | ✓ | Page range (e.g., `"pp. 12–24"`) |
| `complexity` | `string` | — | Reading difficulty level |
| `contentRaw` | `string` | — | Legacy full text (deprecated) |
| `summaryRaw` | `string` | ✓ | Rich text summary for the app |
| `sourceUrl` | `string` | ✓ | External reading material link |
| `imageUrl` | `string` | — | Illustration image URL |
| `pdfUrl` | `string` | — | Downloadable PDF backup |
| `durationMinutes` | `number` | ✓ | Estimated reading time |
| `learningOutcomes` | `string[]` | ✓ | Bullet-point learning goals |
| `reflectionPrompts` | `string[]` | ✓ | Guided reflection questions |
| `questions` | `BookClubQuizQuestion[]` | ✓ | Quiz questions array |
| `quizCutoff` | `number` | ✓ | Minimum score (0–100) for Excellence Badge |
| `publishAt` | `string` | ✓ | ISO timestamp for scheduled release |
| `status` | `'draft' \| 'in-review' \| 'scheduled' \| 'published' \| 'unassigned'` | ✓ | Publishing state |
| `interestingBit` | `string` | — | Legacy fun fact field |
| `analytics` | `object` | — | Aggregated usage metrics (see below) |
| `analytics.totalReads` | `number` | — | Total unique reads |
| `analytics.scrollDepthAvg` | `number` | — | Average scroll depth (0–1) |
| `analytics.badgeDistribution.reader` | `number` | — | Reader badge count |
| `analytics.badgeDistribution.excellent` | `number` | — | Excellence badge count |
| `analytics.badgeDistribution.failed` | `number` | — | Below-cutoff quiz count |

**BookClubQuizQuestion sub-object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | `string` | ✓ | Question text |
| `options` | `string[4]` | ✓ | Exactly 4 answer choices |
| `correctAnswer` | `number` | ✓ | Index (0–3) of the correct option |
| `explanation` | `string` | ✓ | Explanation shown after answer |
| `citation` | `string` | ✓ | Source page/passage reference |
| `points` | `number` | — | Custom point value (default: 1) |

**Indexes:**
- `status` + `publishAt` (ascending)

**Security:**
- **Read:** Any authenticated user
- **Write:** Admin only

---

## notifications/{notificationId}

**Purpose:** Push notification delivery tracking — records every notification sent to a user for in-app inbox and read-state management.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `notificationId` | `string` | ✓ | Document ID |
| `uid` | `string` | ✓ | Target user UID |
| `title` | `string` | ✓ | Notification headline |
| `body` | `string` | ✓ | Notification body text |
| `type` | `'announcement' \| 'badge' \| 'streak' \| 'reminder' \| 'system'` | ✓ | Notification category |
| `isRead` | `boolean` | ✓ | Whether the user has opened/dismissed |
| `deliveredAt` | `string` | ✓ | ISO timestamp of FCM delivery |
| `fcmToken` | `string` | — | FCM token used (for delivery auditing) |
| `data` | `object` | — | Extra key-value payload for deep-link routing |
| `createdAt` | `string` | ✓ | ISO timestamp of document creation |

**Notification Types:**

| Type | Trigger |
|------|---------|
| `announcement` | Admin published a new announcement |
| `badge` | User earned a new badge |
| `streak` | Daily streak milestone reached |
| `reminder` | Scheduled chanting/study reminder |
| `system` | Platform maintenance or updates |

**Indexes:**
- `uid` + `createdAt` (descending) — user inbox ordered by recency
- `uid` + `isRead` (ascending) — unread count queries

**Security:**
- **Read:** Owner or admin
- **Create:** System (Cloud Functions) only; client cannot create
- **Update:** Owner (to mark `isRead = true`) or admin
- **Delete:** Owner or admin

---

## articles/{articleId}

**Purpose:** Blog/article system for spiritual content, news, and community stories.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `articleId` | `string` | ✓ | Document ID |
| `title` | `string` | ✓ | Article headline |
| `slug` | `string` | ✓ | URL-safe identifier; must be globally unique |
| `content` | `string` | ✓ | Markdown or rich text body |
| `excerpt` | `string` | ✓ | Short preview (≤200 characters) |
| `authorUid` | `string` | ✓ | Author's Firebase UID |
| `authorName` | `string` | ✓ | Author display name |
| `category` | `string` | ✓ | Article category (e.g., `"Spiritual"`, `"Community"`) |
| `tags` | `string[]` | ✓ | Search/filter tags |
| `coverImageUrl` | `string` | — | Banner/cover image URL |
| `status` | `'draft' \| 'published' \| 'archived'` | ✓ | Publishing state |
| `publishedAt` | `string` | — | ISO timestamp; `null` until published |
| `createdAt` | `string` | ✓ | ISO timestamp of creation |
| `updatedAt` | `string` | ✓ | ISO timestamp of last edit |
| `viewCount` | `number` | ✓ | Incremented on each unique read (default: 0) |
| `likeCount` | `number` | ✓ | Cumulative like count (default: 0) |
| `commentCount` | `number` | ✓ | Denormalised count from `comments` collection |

**Indexes:**
- `status` + `publishedAt` (descending) — public article feed
- `authorUid` + `createdAt` (descending) — author's articles
- `category` + `publishedAt` (descending) — category filtering

**Security:**
- **Read:** Published articles — any authenticated user; Draft/Archived — owner or admin
- **Create:** Admin or users with contributor role
- **Update:** Author (own articles) or admin
- **Delete:** Admin only

---

## comments/{commentId}

**Purpose:** Article comments — supports flat and nested (one-level) replies.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `commentId` | `string` | ✓ | Document ID |
| `articleId` | `string` | ✓ | Parent article ID |
| `uid` | `string` | ✓ | Commenter's UID |
| `userName` | `string` | ✓ | Commenter display name |
| `content` | `string` | ✓ | Comment text (max 1,000 chars) |
| `isApproved` | `boolean` | ✓ | Admin moderation gate; defaults to `false` |
| `parentCommentId` | `string` | — | Set for replies; references another `commentId` |
| `createdAt` | `string` | ✓ | ISO timestamp |
| `updatedAt` | `string` | — | ISO timestamp of last edit |

**Indexes:**
- `articleId` + `isApproved` + `createdAt` (ascending) — approved comments per article
- `isApproved` (ascending) + `createdAt` (ascending) — admin moderation queue

**Security:**
- **Read:** Any authenticated user (only approved comments in client queries)
- **Create:** Any authenticated user (uid must match)
- **Update:** Owner (content edit within time window) or admin (approval/rejection)
- **Delete:** Owner or admin

---

## polls/{pollId}

**Purpose:** Survey/polling system for community feedback and spiritual preference gathering.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pollId` | `string` | ✓ | Document ID |
| `question` | `string` | ✓ | Poll question text |
| `options` | `PollOption[]` | ✓ | Answer choices with vote counts (see below) |
| `createdBy` | `string` | ✓ | Admin UID who created the poll |
| `targetAudience` | `string` | ✓ | `'all'`, a state name, or centre name |
| `status` | `'draft' \| 'active' \| 'closed'` | ✓ | Poll lifecycle state |
| `startAt` | `string` | ✓ | ISO timestamp — when voting opens |
| `endAt` | `string` | ✓ | ISO timestamp — when voting closes |
| `totalResponses` | `number` | ✓ | Denormalised total submission count |
| `createdAt` | `string` | ✓ | ISO creation timestamp |
| `updatedAt` | `string` | ✓ | ISO last-modified timestamp |

**PollOption sub-object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `optionId` | `string` | ✓ | Stable unique identifier |
| `text` | `string` | ✓ | Option display text |
| `voteCount` | `number` | ✓ | Denormalised vote tally (default: 0) |

**Indexes:**
- `status` + `endAt` (ascending) — active polls
- `targetAudience` + `status` (ascending) — audience-filtered polls

**Security:**
- **Read:** Any authenticated user
- **Create/Delete:** Admin only
- **Update:** Admin (for management) or Cloud Function (to increment `voteCount` / `totalResponses`)

---

## pollResponses/{responseId}

**Purpose:** Individual poll submissions — one document per user per poll.
Document ID convention: `{pollId}_{uid}`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `responseId` | `string` | ✓ | Document ID (`{pollId}_{uid}`) |
| `pollId` | `string` | ✓ | Parent poll reference |
| `uid` | `string` | ✓ | Respondent's UID |
| `selectedOptionId` | `string` | ✓ | ID of the chosen `PollOption` |
| `submittedAt` | `string` | ✓ | ISO timestamp of submission |

**Indexes:**
- `pollId` + `uid` (ascending) — prevent duplicate votes (check existence)
- `uid` + `submittedAt` (descending) — user's poll history

**Security:**
- **Read:** Owner or admin
- **Create:** Authenticated user (uid must match; poll must be `active`)
- **Update/Delete:** Admin only (responses are immutable after submission)

---

## contactSubmissions/{submissionId}

**Purpose:** Contact form inquiries submitted by users or visitors — routed to admin review.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `submissionId` | `string` | ✓ | Document ID |
| `name` | `string` | ✓ | Submitter's full name |
| `email` | `string` | ✓ | Reply-to email address |
| `phone` | `string` | — | Optional contact phone |
| `subject` | `string` | ✓ | Inquiry subject line |
| `message` | `string` | ✓ | Full message body |
| `state` | `string` | — | Malaysian state (if provided) |
| `centre` | `string` | — | Sai centre affiliation (if provided) |
| `status` | `'new' \| 'in-review' \| 'resolved' \| 'closed'` | ✓ | Workflow status (default: `'new'`) |
| `assignedTo` | `string` | — | Admin UID handling the submission |
| `adminNotes` | `string` | — | Internal notes visible only to admins |
| `submittedAt` | `string` | ✓ | ISO timestamp of submission |
| `updatedAt` | `string` | — | ISO timestamp of last admin update |

**Indexes:**
- `status` + `submittedAt` (descending) — admin inbox sorted by recency
- `assignedTo` + `status` (ascending) — submissions per admin

**Security:**
- **Read:** Admin only
- **Create:** Public (unauthenticated allowed — contact form is pre-login)
- **Update:** Admin only (status, assignedTo, adminNotes)
- **Delete:** Admin only

---

## Index Summary

The following composite indexes should be configured in `firestore.indexes.json`:

| Collection | Fields | Order | Purpose |
|---|---|---|---|
| `users` | `state`, `__name__` | ASC | State leaderboard |
| `users` | `centre`, `__name__` | ASC | Centre leaderboard |
| `journals` | `uid`, `entryDate` | DESC | User journal list |
| `sadhanaDaily` | `uid`, `date` | DESC | User sadhana history |
| `bookclubWeeks` | `status`, `publishAt` | ASC | Published week feed |
| `notifications` | `uid`, `createdAt` | DESC | User notification inbox |
| `notifications` | `uid`, `isRead` | ASC | Unread notification count |
| `articles` | `status`, `publishedAt` | DESC | Public article feed |
| `articles` | `authorUid`, `createdAt` | DESC | Author's article list |
| `articles` | `category`, `publishedAt` | DESC | Category feed |
| `comments` | `articleId`, `isApproved`, `createdAt` | ASC | Approved comments per article |
| `polls` | `status`, `endAt` | ASC | Active polls |
| `polls` | `targetAudience`, `status` | ASC | Audience-scoped polls |
| `pollResponses` | `pollId`, `uid` | ASC | Duplicate vote prevention |
| `pollResponses` | `uid`, `submittedAt` | DESC | User poll history |
| `contactSubmissions` | `status`, `submittedAt` | DESC | Admin inbox |
| `contactSubmissions` | `assignedTo`, `status` | ASC | Per-admin queue |
| `users/{uid}/badges` | `uid`, `earnedAt` | DESC | Recent badges |

---

## Security Rule Principals

| Role | How Detected |
|------|-------------|
| **Owner** | `request.auth.uid == resource.data.uid` (or `userId`) |
| **Admin** | Email matches `.*@ssiomya.com` OR `users/{uid}.isAdmin == true` |
| **System** | Cloud Functions using Admin SDK (bypasses all rules) |

---

## Data Lifecycle Notes

- **Timestamps:** All timestamps are ISO 8601 strings (`YYYY-MM-DDTHH:mm:ssZ`). Server-set values use `FieldValue.serverTimestamp()` in Cloud Functions.
- **Soft Deletes:** Not yet implemented. Prefer updating `status` to `'archived'` or `'closed'` over hard deletes.
- **Aggregation:** National stats and analytics counters are maintained by Cloud Functions (daily scheduled job at 00:10 MYT) to avoid write-contention on hot documents.
- **Denormalisation:** `article.commentCount`, `poll.totalResponses`, and `poll.options[n].voteCount` are denormalised counters updated transactionally by Cloud Functions.
