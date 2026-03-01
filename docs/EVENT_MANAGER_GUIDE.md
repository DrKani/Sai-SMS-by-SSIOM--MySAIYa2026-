
# Event Manager Module: Operational Guide
**System:** Sai SMS (Sai Sadhana Made Simple)  
**Version:** 2026.1  
**Access Level:** National Admin & Spiritual Coordinators

---

## 1. Module Overview
The **Event Manager** is the central command center for the National Spiritual Calendar. It allows administrators to schedule gatherings, manage the 2026 timeline, and broadcast event details (locations, Zoom links) to all devotees via the "Calendar" and "Home" pages.

### Design Philosophy
The module follows the **"Bento Grid"** design system defined in `DESIGN_SYSTEM.md`:
*   **Visual Hierarchy:** The input form is distinct from the list view.
*   **Color Coding:** Events are strictly categorized by color for instant recognition:
    *   **🟣 Live (Purple):** Physical gatherings (Satsangs, Service).
    *   **🔵 Virtual (Teal):** Online events (Zoom, Google Meet).
    *   **🟢 Festival (Green):** Major celebrations (Thaipusam, CNP, Deepavali).
*   **Interaction:** Uses "Optimistic UI"—events appear immediately upon creation without page reloads.

---

## 2. Core Functionalities

### 2.1 creating an Event
Located in the **"Create New Event"** card on the Admin Hub.

1.  **Title:** The headline of the event (e.g., "National Bhajans").
2.  **Date:** Selected via a date picker.
3.  **Time:** Free text field (e.g., "7:30 PM - 9:00 PM").
4.  **Category:** Click one of the three toggle buttons (Live/Virtual/Festival).
5.  **Description:** Details about the agenda, dress code, or prerequisites.
6.  **Location:** Physical address or venue name.
7.  **Meeting Link:** (Optional) Zoom/Meet URL. If provided, a "Join" button appears on the user's calendar.

**Action:** Click **"Publish Event"** to save to the live database (`localStorage`).

### 2.2 Managing Existing Events
The **"Upcoming Schedule"** list displays all events sorted chronologically.

*   **Static Events:** Events hardcoded into the system (ID starts with `f` or `e`, e.g., `f1`, `e1`). These **cannot** be deleted via the UI to preserve the National Core Calendar.
*   **Custom Events:** Events created by Admins (ID starts with `evt-`).
*   **Deleting:** A generic **Trash Icon** (🗑️) appears *only* next to Custom Events. Clicking this permanently removes the event.

---

## 3. Automated & Recurrent Event Logic

The system automatically generates certain events to save Admin effort. These do **not** appear in the manual list but show up on the User's Calendar.

### 3.1 Monday Morning Meditation (MMM)
*   **Logic:** The system algorithmically finds every **Monday** of the year 2026.
*   **Time:** 05:30 AM - 06:30 AM.
*   **Link:** Auto-embeds the fixed National Zoom Link.
*   **Frequency:** Weekly.

### 3.2 Sai Lit Club (Book Club)
*   **Logic:** Linked to the `ANNUAL_STUDY_PLAN`.
*   **Trigger:** Every **Thursday** (Release Day).
*   **Content:** The title matches the specific chapter released that week (e.g., "Week 04: Dasaratha & Kaika").

---

## 4. The 2026 National Calendar (Pre-Loaded)

The following events are hardcoded into the system (`constants.ts`) and serve as the immutable backbone of the 2026 schedule.

### January 2026
*   **Jan 03:** Spiritual Wing: Silent Saturday
*   **Jan 14:** Ponggal / Makara Sankranthi
*   **Jan 23:** Thaipusam 9-Day Sadhana Commencement
*   **Jan 24:** 136th Council Meeting
*   **Jan 31 - Feb 02:** Thaipusam Seva (Paal Kudam & Blood Donation)
    *   *Locations:* Batu Caves, Pulau Pinang, Ipoh, Seremban, Segamat.

### February 2026
*   **Feb 15:** Maha Shivaratri
*   **Feb 17:** Chinese New Year

### March 2026
*   **Mar 04:** Holi
*   **Mar 19:** Ugadi (Telugu New Year)
*   **Mar 20:** Hari Raya Aidilfitri
*   **Mar 26:** Sri Rama Navami

### April 2026
*   **Apr 02:** Hanuman Jayanthi
*   **Apr 22:** Earth Day (Service Wing)
*   **Apr 24:** **Sri Sathya Sai Aradhana Mahotsavam**

### May - August 2026
*   **May 01:** Buddha Poornima
*   **May 06:** Easwaramma Day
*   **Jul 29:** Guru Poornima
*   **Aug 26:** Onam

### September - December 2026
*   **Sep 04:** Sri Krishna Janmashtami
*   **Sep 14:** Ganesh Chaturthi
*   **Sep 21:** International Day of Peace
*   **Oct 20:** Vijayadashami (Dasara / Avatar Declaration Day)
*   **Nov 08:** Deepavali
*   **Nov 14:** Worldwide Akhanda Bhajans
*   **Nov 19:** Ladies' Day
*   **Nov 23:** **101st Birthday of Bhagawan Sri Sathya Sai Baba**
*   **Nov 24:** Guru Nanak Jayanthi
*   **Dec 25:** Christmas

---

## 5. Technical Data Structure

For developers or admins performing bulk uploads via JSON.

**Event Object Schema:**
```typescript
interface Event {
  id: string;          // 'evt-' + timestamp
  title: string;       // Event Name
  date: string;        // 'Mon Jan 01 2026' format
  time?: string;       // Optional
  location?: string;   // Optional
  description: string; // Context
  category: 'Live' | 'Virtual' | 'Festival';
  meetingLink?: string;// Optional URL
  mapEmbed?: string;   // Optional HTML iframe string (Static events only)
}
```

**Storage Key:** `sms_custom_events` (LocalStorage)
