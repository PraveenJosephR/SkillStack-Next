# SkillStack - Comprehensive Frontend Documentation

This document serves as an exhaustive blueprint of the `SkillStack-Next` frontend React/Next.js repository. It outlines every core component, state management hook, API integration, and architectural decision currently implemented in the workspace.

---

## 🛠 Global Architecture & State Management
- **Framework:** Next.js (App Router `src/app/...`)
- **Styling:** Tailwind CSS integrated with `Shadcn UI` (Radix Primitives).
- **Global State (`src/store/atoms.ts`):** 
  Utilizes `Jotai` for state management with local storage persistence (`atomWithStorage`).
  - **`userAtom`**: Stores the globally authenticated user profile (`id`, `name`, `email_id`, `role_id`, `is_active`). Crucial for Role-Based Access Control (RBAC).
  - **`accessTokenAtom`**: Stores the JWT token retrieved from the backend. Automatically injected into the `Authorization: Bearer` headers of all subsequent API `fetch()` requests.

---

## 📂 Page-by-Page Component Breakdown

### 1. Authentication (`src/components/login-form.tsx`)
The entry point of the application.
- **Form Handling:** Standard email/password inputs with validation.
- **API Integration:** `POST /api/v1/users/login`
- **Logic:** Upon successful 200 OK, the backend returns an `access_token` and user object. These are committed to `accessTokenAtom` and `userAtom` before redirecting the user to `/dashboard` (or `/teacher/dashboard` depending on `role_id`).

### 2. Global Navigation (`src/components/app-sidebar.tsx` & `site-header.tsx`)
- **Sidebar (`app-sidebar.tsx`):** Reads `role_id` from `userAtom`. If `role_id == 2` (Teacher), renders the Teacher Dashboard and Approvals links. If `role_id == 1` (Student), renders Semester Plan, Activity Center, and My Activities links.
- **Header (`site-header.tsx`):** 
  - **API Integration:** `GET /api/v1/users/tokens`
  - **Logic:** Dynamically fetches and renders the student's live global token balance as a badge in the top right corner.

### 3. Student Dashboard (`src/app/dashboard/` & `src/components/section-cards.tsx`)
Provides the high-level summary of a student's progress.
- **API Integration 1:** `GET /api/v1/users/tokens` -> Used to render the "Earned Tokens" and "Spent Tokens" metric cards.
- **API Integration 2:** `GET /api/v1/goals/summary` -> Used to render the "Semester Target" completion percentage and the "Planned Activities" count.

### 4. Activity Center Catalog (`src/app/activity/`)
The discovery catalog where students find new activities to pursue.
- **Component: `cards.tsx`**
  - **API Integration:** `GET /api/v1/goals/activities`
  - **Logic:** Fetches the master dictionary of all `activity` table rows. Supports client-side sorting (High to Low tokens) and keyword searching. *Note: Lazy loading was explicitly removed in favor of instantaneous full-list rendering due to layout constraints.*
- **Component: `startActivityDialog.tsx`**
  - **API Integration:** `POST /api/v1/my-activities/{activity_id}/start`
  - **Form Validation:** Uses `Zod` and `react-hook-form`.
  - **Fields Captured:** `title` (string), `activity_details` (text), `event_type` (Select: 1=Internal, 2=External), `date_range` (DatePicker).

### 5. Semester Plan (`src/app/semester-plan/`)
A planner sheet allowing students to map out their upcoming targets.
- **Component: `sheet.tsx`**
  - **API Integration 1:** `GET /api/v1/goals/` -> Fetches the drafted goals.
  - **API Integration 2:** `GET /api/v1/goals/activities` -> Populates the selection dropdown.
  - **API Integration 3:** `POST /api/v1/goals/` -> Submits a newly selected activity and `target_month` to the database.
  - **API Integration 4:** `DELETE /api/v1/goals/` -> Removes an existing goal.

### 6. My Activities Timeline (`src/app/my-activities/`)
Where students track their ongoing and completed events.
- **Current State:** Fully static mock data. Relies on `src/app/my-activities/activitiesData.ts`.
- **Pending Integration:** Requires updating the page to execute a `GET /api/v1/my-activities/` fetch to replace the static JSON array with the live SQL database rows.

### 7. Teacher Dashboard (`src/app/teacher/dashboard/page.tsx`)
The roster view for class coordinators.
- **API Integration 1:** `GET /api/v1/users/me` -> Identifies the current teacher's unique DB ID.
- **API Integration 2:** `GET /api/v1/my-activities/teacher/students`
  - **Logic:** Queries the `staff_student_mapping` table to return the exact list of students assigned to this teacher. Populates the data table containing Name, Department, Register No, and Total Tokens.

### 8. Teacher Student Details (`src/app/teacher/student/[id]/page.tsx`)
The granular inspection view when a teacher clicks on a specific student row.
- **API Integration 1:** `GET /api/v1/my-activities/teacher/students` -> Used as a fallback to extract basic profile metadata (Department, Reg No) if the dedicated profile endpoint is unavailable.
- **API Integration 2:** `GET /api/v1/users/students/{student_id}/tokens` -> Fetches the specific student's wallet balance.
- **API Integration 3:** `GET /api/v1/my-activities/teacher/students/{student_id}/activities` -> Fetches the chronological timeline of the student's `user_activity_mapping` rows so the teacher can see what is "In Progress" vs "Completed".

---

## 🛑 Known Frontend Bypasses & Alterations
Due to unstable backend logic returning `500 Internal Server Error` strings (which causes the frontend `res.json()` parser to crash), the following tactical bypasses have been implemented:
1. **Activity Catalog API Swap:** The frontend was reverted to use `/api/v1/goals/activities` instead of the broken `/api/v1/my-activities/activities` endpoint.
2. **Teacher Leaderboard API Swap:** The frontend was updated to use `/api/v1/my-activities/teacher/students` instead of the broken `/api/v1/users/leaderboard/class-coordinator/{id}` endpoint.
