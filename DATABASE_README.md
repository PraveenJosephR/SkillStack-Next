# SkillStack - Comprehensive Database Documentation

This document provides an exhaustive breakdown of the `SkillStack_v2` PostgreSQL database schema, including every crucial field across the major tables and how they map to the application's business logic.

## 🗄 Connection Details
- **Database Engine:** PostgreSQL
- **Database Name:** `SkillStack_v2`
- **Default Connection URI:** `postgresql://postgres:1234@127.0.0.1:5432/SkillStack_v2`

---

## 🏗 Exhaustive Table Definitions

### 1. `users` Table
The central identity table for all individuals logging into the system.
- **`id`** *(bigint, PK)*: Unique identifier.
- **`name`** *(varchar)*: Full name of the user.
- **`email_id`** *(varchar)*: Used for Google OAuth login.
- **`role_id`** *(integer, FK)*: Maps to `roles.id`. Crucial for determining UI layout.
- **`is_active`** *(smallint)*: Soft delete flag (1 = active, 0 = inactive).
- **`gender_id`**, **`dept_id`**: Foreign keys to metadata tables.
- **`year`**, **`section`**, **`register_no`**: Student-specific metadata used heavily in the Teacher Dashboard roster view.
- **`phone_no`**: Contact information.

### 2. `roles` Table
Defines the permission boundaries in the system.
- **`id`** *(smallint, PK)*: 1 = Student, 2 = Staff/Teacher, 3 = Admin.
- **`role_name`** *(varchar)*: The human-readable string.
- **`is_active`** *(smallint)*: Status flag.

### 3. `staff_student_mapping` Table
**Crucial Junction Table**: Dictates which students belong to which teacher. If this table is not populated, the Teacher Dashboard will be completely empty.
- **`id`** *(integer, PK)*: Unique mapping ID.
- **`staff_id`** *(integer, FK)*: Maps to `users.id` where `role_id` = 2.
- **`staff_role_id`** *(integer, FK)*: Maps to `roles.id` (usually 2).
- **`student_id`** *(integer, FK)*: Maps to `users.id` where `role_id` = 1.
- **`is_active`** *(smallint)*: Allows reassigning students without deleting historical mappings.

### 4. `activity` Table
The master catalog dictionary of all activities.
- **`id`** *(integer, PK)*: Unique activity ID.
- **`activity_name`** *(varchar)*: The display title (e.g., "Hackathon", "NPTEL").
- **`base_token`** *(integer)*: The default number of tokens awarded for completing this activity.
- **`has_sub_category`** *(smallint)*: Boolean flag (0/1) indicating if the token value branches based on outcome (e.g., Win vs Participation).
- **`workflow_id`** *(integer)*: Defines which approval pipeline this activity must undergo.

### 5. `user_activity_mapping` Table
The core operational table. Represents a "session" of a student tracking a specific activity.
- **`id`** *(bigint, PK)*: Unique tracking session ID.
- **`user_id`** *(bigint, FK)*: The student tracking the activity.
- **`activity_id`** *(bigint, FK)*: The master activity being tracked.
- **`title`** *(varchar)*: User-defined custom title (e.g., "TCS Global Hackathon 2026").
- **`activity_details`** *(text)*: User-defined custom description.
- **`event_type`** *(bigint, FK)*: Maps to `event_master`. Distinguishes between `1` (Internal Event) and `2` (External Event).
- **`stage_id`** *(bigint, FK)*: The current point in the workflow pipeline (e.g., Initial Proof Upload, AI Verification, Teacher Approval).
- **`status`** *(bigint, FK)*: General status bucket (1=Draft, 2=In Progress, 3=Completed).
- **`permission_score`** & **`proof_score`** *(integer)*: Ratings assigned by the AI or Faculty during verification.
- **`activity_start_date`** & **`activity_end_date`** *(date)*: Timeline of the event.

### 6. `student_goal` Table
Stores the user's "Semester Plan" selections.
- **`id`** *(integer, PK)*: Unique goal ID.
- **`user_id`** *(integer, FK)*: The student who planned the goal.
- **`activity_id`** *(integer, FK)*: The master activity they plan to complete.
- **`target_month`** *(integer)*: The month (1-12) they aim to complete it in.
- **`is_active`** *(smallint)*: Status flag.

### 7. `user_token_mapping` Table
The financial ledger of the SkillStack system.
- **`id`** *(integer, PK)*: Unique ledger entry ID.
- **`user_id`** *(integer, FK)*: The student receiving/losing tokens.
- **`completed_activity_id`** *(integer, FK)*: Links back to `user_activity_mapping` to prove *why* the tokens were awarded.
- **`malpractice_id`** *(integer, FK)*: Links to `malpractice_master`. If populated, this represents a *deduction* rather than an award.
- **`token_value`** *(integer)*: The exact positive or negative integer of tokens applied to the student's global wallet.

---

## 📝 Dummy Data Configuration
To enable offline frontend development without students constantly generating live data, the database has been seeded with:
1. **Teacher Mappings:** `staff_student_mapping` has been populated to map `student_id` (4, 5, 6, 7) to `staff_id` (21, 22). This powers the Teacher Dashboard roster view.
2. **Activity Sessions:** `user_activity_mapping` has been loaded with 6 varied activities spanning multiple `stage_id` and `status` variations to test UI rendering of "Completed" vs "In Progress" badges.
3. **Semester Goals:** `student_goal` contains 5 records to verify the calculation of the "Planned Activities" count on the student dashboard section cards.
