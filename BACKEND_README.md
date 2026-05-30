# SkillStack - Comprehensive Backend API Documentation

This document serves as an exhaustive blueprint of the `SkillStack_v2` FastAPI backend layer. It outlines every exposed OpenAPI route, its expected request/response payloads, and its current health status based on live frontend integrations.

---

## 🛠 Server & Architecture
- **Framework:** Python / FastAPI
- **Local Host:** `http://localhost:8000`
- **Global Auth Header:** `Authorization: Bearer <access_token>`

---

## ✅ Active / Healthy API Endpoints

### 1. User & Authentication (`/api/v1/users`)
- **`POST /api/v1/users/login`**
  - *Payload:* `{"email_id": "student@college.com"}`
  - *Response:* `{ "access_token": "ey...", "token_type": "bearer", "user": { ... } }`
  - *Purpose:* Authenticates the user and issues the JWT token needed for all other requests.
- **`GET /api/v1/users/me`**
  - *Payload:* None (Bearer Token).
  - *Response:* The raw `users` table record for the authenticated user.
  - *Purpose:* Validates session state and extracts `role_id` (1=Student, 2=Teacher).
- **`GET /api/v1/users/tokens`**
  - *Payload:* None.
  - *Response:* `{ "total_tokens": 12, "earned": 15, "deducted": 3 }`
  - *Purpose:* Used to render the global token wallet in the site header and dashboard.
- **`GET /api/v1/users/students/{student_id}/tokens`**
  - *Payload:* `student_id` path parameter.
  - *Purpose:* Used specifically by Teachers on the student detail view to inspect another user's wallet.

### 2. Goals & Semester Planning (`/api/v1/goals`)
- **`GET /api/v1/goals/summary`**
  - *Payload:* None.
  - *Response:* Aggregates the `student_goal` and `user_token_mapping` tables.
  - *Purpose:* Used on the Student Dashboard to render "Target completion percentage".
- **`GET /api/v1/goals/activities`**
  - *Payload:* None.
  - *Response:* JSON Array of all 21 rows from the master `activity` table.
  - *Purpose:* Used by the Activity Center to render the catalog cards.
- **`GET /api/v1/goals/`**
  - *Payload:* None.
  - *Response:* JSON Array of `student_goal` rows joined with the `activity` name.
  - *Purpose:* Used to populate the Semester Plan sidebar.
- **`POST /api/v1/goals/`**
  - *Payload:* `{"activity_id": 36, "target_month": 4}`
  - *Purpose:* Inserts a new row into `student_goal`.
- **`DELETE /api/v1/goals/`**
  - *Payload:* `{"goal_id": 5}`
  - *Purpose:* Removes a goal from the semester plan.

### 3. Activity Tracking Engine (`/api/v1/my-activities`)
- **`POST /api/v1/my-activities/{activity_id}/start`**
  - *Payload:* `{"title": "Hackathon", "activity_details": "TCS event", "event_type": 2, "activity_start_date": "2026-04-01", "activity_end_date": "2026-04-05"}`
  - *Response:* 200 OK.
  - *Purpose:* Executed by the "Start Activity" dialog. Inserts a row into `user_activity_mapping` with `stage_id=1` and `status=2` (In Progress).
- **`GET /api/v1/my-activities/`**
  - *Payload:* None.
  - *Response:* JSON Array of `user_activity_mapping` rows for the logged-in student.
  - *Purpose:* Powers the "My Activities" timeline view.

### 4. Teacher Coordination (`/api/v1/my-activities/teacher`)
- **`GET /api/v1/my-activities/teacher/students`**
  - *Payload:* None (Reads Teacher ID from JWT).
  - *Response:* JSON Array joining `staff_student_mapping` with `users`.
  - *Purpose:* Powers the Teacher Dashboard roster table.
- **`GET /api/v1/my-activities/teacher/students/{student_id}/activities`**
  - *Payload:* `student_id` path parameter.
  - *Response:* JSON Array of `user_activity_mapping` for a specific student.
  - *Purpose:* Allows teachers to audit a student's chronological progress timeline.

---

## 🛑 Unstable / Broken API Endpoints
The following endpoints exist in the FastAPI OpenAPI specification but currently throw a `500 Internal Server Error` exception during execution. They must be debugged and fixed by the backend team.

1. **`GET /api/v1/my-activities/activities`**
   - *Intended Purpose:* Seems designed to list the master catalog of activities (redundant to `/goals/activities`). 
   - *Issue:* Throws a 500 error preventing the Activity Center from loading.
2. **`GET /api/v1/users/profile/full`**
   - *Intended Purpose:* Fetch comprehensive profile data with complex joins.
   - *Issue:* Currently crashing; the frontend has fallen back to using `/users/me`.
3. **`GET /api/v1/users/leaderboard/class-coordinator/{teacher_id}`**
   - *Intended Purpose:* Retrieve an ordered leaderboard specifically scoped to a single teacher's class.
   - *Issue:* Throws a 500 error. The frontend has temporarily bypassed this by manually sorting the array returned from `/api/v1/my-activities/teacher/students`.

---

## 🚧 Pending Development Pipelines
1. **Proof Uploads (`/api/v1/my-activities/{activity_id}/submit`):**
   - Needs to be heavily tested to ensure `multipart/form-data` support for uploading PDF/Image certificates for AI Verification.
2. **Teacher Review Logic (`/api/v1/my-activities/teacher/review/{activity_id}`):**
   - Requires endpoints to process the Faculty member clicking "Approve" or "Reject", updating `user_activity_mapping.stage_id`, and triggering the insert into `user_token_mapping` to officially award the points.
