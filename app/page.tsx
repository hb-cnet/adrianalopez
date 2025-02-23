// app/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
