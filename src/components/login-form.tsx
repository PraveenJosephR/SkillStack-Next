"use client";

import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { userAtom, authLoadingAtom } from "@/store/atoms";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    google: any;
  }
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  // Jotai state
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useAtom(authLoadingAtom);

  // Local form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ─── Google Sign-In Setup ───────────────────────────────────────────

  const handleGoogleLoginClick = () => {
    if (!window.google?.accounts?.oauth2) {
      setError("Google Login is still loading. Please try again.");
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      scope: "openid email profile",
      callback: (response: any) => {
        if (response.access_token) {
          handleGoogleResponse(response.access_token);
        }
      },
    });
    client.requestAccessToken();
  };

  // ─── Google Login Handler ───────────────────────────────────────────

  async function handleGoogleResponse(access_token: string) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Google login failed");
        return;
      }

      const servRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id: data.user.email }),
      });

      if (!servRes.ok) {
        setError(data.error || "User does not exist.");
        return;
      }

      // Store user in Jotai state
      setUser(data.user);
      console.log("Logged in via Google:", data.user);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Email/Password Login Handler ──────────────────────────────────

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Store user in Jotai state
      setUser(data.user);
      console.log("Logged in via email:", data.user);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border border-white/30 bg-black/40 backdrop-blur-2xl shadow-2xl">
        <CardContent className="p-0">
          <form className="p-6 md:p-8" onSubmit={handleEmailLogin}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/sathyabama-logo.png"
                    alt="Sathyabama Logo"
                    className="h-10 w-10 object-contain rounded-full"
                  />
                  <h1 className="text-2xl font-bold text-white">
                    Sathyabama University
                  </h1>
                </div>
                <p className="text-balance text-white/90">Welcome Back</p>
              </div>

              {/* Error message */}
              {error && (
                <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive font-medium border border-destructive/20 backdrop-blur-md">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email" className="text-white font-medium">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-white/50"
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel
                    htmlFor="password"
                    className="text-white font-medium"
                  >
                    Password
                  </FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm text-white/80 underline-offset-2 hover:underline hover:text-white"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-white/50"
                />
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-none"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-transparent text-white/80 [&>*]:border-white/30">
                Or continue with
              </FieldSeparator>

              <Field className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleLoginClick}
                  disabled={loading}
                  className="w-full relative flex items-center justify-center gap-2 rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed h-[44px]"
                >
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>
              </Field>

              <FieldDescription className="text-center text-white/80">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="text-white font-medium underline-offset-2 hover:underline"
                >
                  Sign up
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-white/70">
        By clicking continue, you agree to our{" "}
        <a
          href="#"
          className="text-white/90 hover:text-white underline-offset-2 hover:underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-white/90 hover:text-white underline-offset-2 hover:underline"
        >
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
