import { NextRequest, NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"

interface GoogleJwtPayload {
  sub: string
  name: string
  email: string
  picture: string
  email_verified: boolean
}

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json()

    if (!credential) {
      return NextResponse.json(
        { error: "Missing credential token" },
        { status: 400 }
      )
    }

    // Decode & verify the Google JWT
    // In production, you should verify the token with Google's public keys
    // or use the Google Auth Library: google-auth-library
    const decoded = jwtDecode<GoogleJwtPayload>(credential)

    if (!decoded.email_verified) {
      return NextResponse.json(
        { error: "Email not verified" },
        { status: 401 }
      )
    }

    // TODO: Look up or create the user in your database here
    // For now, we return the decoded Google user info
    const user = {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
      sub: decoded.sub,
      role: "student", // Default role — replace with DB lookup
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json(
      { error: "Invalid credential token" },
      { status: 401 }
    )
  }
}
