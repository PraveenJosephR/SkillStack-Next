import Image from "next/image"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {/* Background Image */}
      <Image
        src="/images/tajmahal.jpeg"
        alt="Background"
        fill
        priority
        className="object-cover -z-20"
      />
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/20">
            <Image
              src="/images/header.png"
              alt="Sathyabama Institute of Science and Technology"
              width={380}
              height={90}
              priority
              className="object-contain rounded-lg"
            />
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
