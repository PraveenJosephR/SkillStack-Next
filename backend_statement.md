# Backend Integration & State Management Guide

This document explains which files are responsible for connecting to your Python backend and how the local state manages the user data.

## 1. Where does the Frontend connect to the Backend?

The frontend communicates with your Python backend (`http://127.0.0.1:8000`) securely through Next.js API routes.

### Files connecting to the backend:

- **`src/app/api/auth/google/route.ts`**: Handles Google SSO. After verifying the Google login, this file makes a `POST` request to `http://127.0.0.1:8000/api/v1/users/login` with the `email_id` to get the access token from your Python backend.
- **`src/app/api/auth/login/route.ts`**: Handles standard Email/Password login. It takes the email entered in the UI and makes the exact same `POST` request to `http://127.0.0.1:8000/api/v1/users/login`.

If you need to add more API calls in the future (like fetching dashboard data), you can either create new routes in `src/app/api/...` or call the Python backend directly from your React components.

---

## 2. Global State (Jotai) - `src/store/atoms.ts`

We use Jotai to manage state globally across the application. This state is saved in the browser's `localStorage` so the user stays logged in even after refreshing the page.

### The States and their specific purposes:

- **`userAtom`** (Saved as `skillstack_user` in localStorage)
  - **What it does:** Stores the logged-in user's profile details (like `name`, `email`, `picture`, `role`).
  - **Where to use it:** Use this in components like the Header or Sidebar to display the user's name and profile picture.

- **`tokenAtom`** (Saved as `skillstack_token` in localStorage)
  - **What it does:** Stores the `access_token` returned by your Python backend.
  - **Where to use it:** You **must** attach this token in the `Authorization: Bearer <token>` header whenever your React components need to fetch protected data from your Python backend.

- **`authLoadingAtom`**
  - **What it does:** A simple `true`/`false` switch to track if an authentication request is currently happening.
  - **Where to use it:** Used inside `login-form.tsx` to disable the login buttons and show "Logging in..." so the user doesn't click multiple times.

---

## Example: Making a Frontend API Call using the Token

If you are building a new page and need to grab data from the Python backend seamlessly, use the token like this:

```tsx
import { useAtomValue } from "jotai";
import { tokenAtom } from "@/store/atoms";
import { useEffect } from "react";

export default function DashboardData() {
  // Grab the token from global state
  const token = useAtomValue(tokenAtom);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://127.0.0.1:8000/api/v1/my-data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Send the token here!
        },
      });
      const data = await response.json();
      console.log(data);
    }

    if (token) {
      fetchData();
    }
  }, [token]);

  return <div>Loading data...</div>;
}
```
