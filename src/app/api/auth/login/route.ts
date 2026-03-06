import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // TODO: Replace with real database authentication
    // This is a placeholder that simulates a successful login
    // In production, you would:
    // 1. Look up the user by email in your database
    // 2. Verify the password hash
    // 3. Return the user data or an error

    // Placeholder validation — accepts any @sathyabama.ac.in email
    if (!email.endsWith("@sathyabama.ac.in")) {
      return NextResponse.json(
        { error: "Please use your Sathyabama email address" },
        { status: 401 }
      )
    }

    const user = {
      name: email.split("@")[0],
      email: email,
      picture: "",
      sub: `local_${Date.now()}`,
      role: "student",
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    )
  }
}
