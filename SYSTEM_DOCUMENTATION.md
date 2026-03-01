# Sai Sadhana Made Simple (Sai SMS) by SSIOM - System Documentation

---

## 1. Book Club Module (2026 Offering)

### 1.1 Content Architecture
- **Curriculum**: Systematic 52-week study of *Ramakatha Rasavahini*.
- **Release Schedule**: Every Thursday at 00:00 MYT (First start: Feb 5, 2026).
- **Progress Gate**: Users must reach 95% vertical scroll depth to enable the "Knowledge Check".
- **Certification**: Earning a "Sai Lit Badge" requires correctly passing 4 MCQs for that specific week.

### 1.2 Administrative Workflow (Preparation Pipeline)
The app includes a specialized preparation system for National Wing Admins to ensure high-quality content:

1. **Scheduling (The Roadmap)**: 
   - Use the **Content Planner** in the Admin Portal to view the full 52-week roadmap.
   - RELEASE DATE is automatically calculated starting from Feb 5th.

2. **Assignment (Delegation)**:
   - Lead Admins assign a **Coordinator** to each week using the email dropdown.
   - Status changes from `Unassigned` to `Drafting` once assigned.

3. **Drafting (Coordinator Tasks)**:
   - The assigned coordinator enters the **Chapter Editor**.
   - Tasks: Paste the text from the source site, upload an relevant illustration, set the Source PDF link, and draft the 4 MCQs with explanations and citations.

4. **Review (Quality Control)**:
   - Once drafting is finished, the coordinator sets the status to `In Review`.
   - A Reviewer uses the **Preview Simulation** to read the text and test the quiz.

5. **Approval (Final Schedule)**:
   - Approved chapters are set to `Scheduled`.
   - The platform will automatically unlock the content for all devotees exactly at the `publishAt` timestamp.

### 1.3 Data Storage (LocalStorage Logic)
- `sms_week_comp_[WeekID]`: Boolean flag for completion status.
- `sms_badges_earned`: Collection of awarded badges and timestamps.
- `sms_completions`: Array of Week IDs for dashboard visualization.
- `sms_notes_[WeekID]`: Personal user reflections.
- `sms_bookclub_weeks`: The collection of dynamic metadata managed by admins.

---
© 2026 SSIOM Malaysia
