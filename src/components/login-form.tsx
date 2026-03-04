"use client"

import { useEffect, useRef, useState } from "react"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { cn } from "@/lib/utils"

import { userAtom, authLoadingAtom } from "@/store/atoms"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

declare global {
  interface Window {
    google: any
  }
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Jotai state
  const [user, setUser] = useAtom(userAtom)
  const [loading, setLoading] = useAtom(authLoadingAtom)

  // Local form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // ─── Google Sign-In Setup ───────────────────────────────────────────

  useEffect(() => {
    function initializeGoogle() {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        })

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            width: googleButtonRef.current.offsetWidth,
            text: "continue_with",
          })
        }
        return true
      }
      return false
    }

    if (initializeGoogle()) return

    const interval = setInterval(() => {
      if (initializeGoogle()) {
        clearInterval(interval)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [])

  // ─── Google Login Handler ───────────────────────────────────────────

  async function handleGoogleResponse(response: any) {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Google login failed")
        return
      }

      // Store user in Jotai state
      setUser(data.user)
      console.log("Logged in via Google:", data.user)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      console.error("Google login error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ─── Email/Password Login Handler ──────────────────────────────────

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }

      // Store user in Jotai state
      setUser(data.user)
      console.log("Logged in via email:", data.user)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
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
                  <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                </div>
                <p className="text-balance text-white/90">
                  Login to your Sathyabama Skillstack account
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email" className="text-white font-medium">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-white/15 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-white font-medium">Password</FieldLabel>
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
                  className="bg-white/15 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-transparent text-white/80 [&>*]:border-white/30">
                Or continue with
              </FieldSeparator>

              <Field className="grid grid-cols-1 gap-4">
                <div ref={googleButtonRef} className="w-full flex justify-center" />
              </Field>

              <FieldDescription className="text-center text-white/80">
                Don&apos;t have an account? <a href="#" className="text-white font-medium underline-offset-2 hover:underline">Sign up</a>
              </FieldDescription>

            </FieldGroup>
          </form>

        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-white/70">
        By clicking continue, you agree to our <a href="#" className="text-white/90 hover:text-white underline-offset-2 hover:underline">Terms of Service</a>{" "}
        and <a href="#" className="text-white/90 hover:text-white underline-offset-2 hover:underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}