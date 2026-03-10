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

    // Call the Python backend
    const backendRes = await fetch("http://127.0.0.1:8000/api/v1/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_id: decoded.email }),
    })

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || "Backend login failed" },
        { status: backendRes.status }
      )
    }

    const backendData = await backendRes.json()

    // Assuming backend returns: { access_token, token_type, user }
    return NextResponse.json({
      access_token: backendData.access_token,
      user: {
        ...backendData.user,
        picture: decoded.picture, // keep picture from google
      }
    }, { status: 200 })
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json(
      { error: "Invalid credential or access token" },
      { status: 401 }
    )
  }
}
