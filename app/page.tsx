// app/page.tsx
"use client"

interface GoogleReCaptcha {
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha: GoogleReCaptcha;
  }
}

import { useState } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const RECAPTCHA_SITE_KEY = "6LeVlOAqAAAAAOvet8_bX4AfmABU27zf_IZfhNds" // Reemplaza con tu clave de sitio

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (typeof window.grecaptcha !== "undefined") {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "login" })
      console.log("Token reCAPTCHA:", token)
      // Opcional: enviar token al backend para validación
    } else {
      console.error("reCAPTCHA no está disponible")
      setError("Error al cargar el captcha. Inténtalo de nuevo.")
      return
    }

    if (password === process.env.NEXT_PUBLIC_AUTH_PASSWORD) {
      localStorage.setItem("isAuthenticated", "true")
      router.push("/birthday")
    } else {
      setError("Clave incorrecta")
    }
  }

  return (
    <div
      className="h-screen w-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/Unknown-a1.jpeg')" }}
    >
      {/* Carga el script de reCAPTCHA v3 */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      <Card className="w-[350px] bg-white/30 backdrop-blur-md border border-white/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center animate-bounce text-white">
            ¡Hola Adriana!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-center text-lg text-white">Introduce tu clave</h2>
            <Input
              type="password"
              placeholder="Ingresa la clave..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/50 backdrop-blur-sm"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export {}
