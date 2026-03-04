"use client";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleLogin() {

  useEffect(() => {

    if (window.google) {

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        {
          theme: "outline",
          size: "large"
        }
      );

    }

  }, []);

  function handleCredentialResponse(response: any) {

    const user = jwtDecode(response.credential);

    console.log("User Info:", user);
  }

  return <div id="googleButton"></div>;
}