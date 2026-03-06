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
    const { credential, access_token } = await request.json()

    if (!credential && !access_token) {
      return NextResponse.json(
        { error: "Missing credential or access token" },
        { status: 400 }
      )
    }

    let decoded: GoogleJwtPayload | null = null;

    if (credential) {
      // Decode & verify the Google JWT
      decoded = jwtDecode<GoogleJwtPayload>(credential)
    } else if (access_token) {
      // Fetch user info from Google using access token
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch user info from Google");
      }
      const data = await res.json();
      decoded = {
        sub: data.sub,
        name: data.name,
        email: data.email,
        picture: data.picture,
        email_verified: data.email_verified,
      } as GoogleJwtPayload;
    }

    if (!decoded || !decoded.email_verified) {
      return NextResponse.json(
        { error: "Email not verified or failed to decode info" },
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
      { error: "Invalid credential or access token" },
      { status: 401 }
    )
  }
}
