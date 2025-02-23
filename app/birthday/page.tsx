// app/birthday/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import { ImagePlus, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Carousel } from "./carousel"
import { ImageUploader } from "./image-uploader"
import { AudioPlayer } from "./audio-player"

export default function BirthdayPage() {
  const router = useRouter()
  const [showUploader, setShowUploader] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [confettiCount, setConfettiCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string

  // URL base del bucket en Cloudflare R2
  const bucketBaseURL = "https://pub-6441f60deee34aadbbc59ac975cddf5f.r2.dev/"

  // Cargar imágenes desde el backend vía GET
  useEffect(() => {
    const loadImages = async () => {
      try {
        const res = await fetch(`${backendUrl}/`)
        const data = await res.json()
        if (data.images) {
          const fullImageUrls = data.images.map((img: string) => `${bucketBaseURL}${img}`)
          setImages(fullImageUrls)
        }
      } catch (error) {
        console.error("Error al cargar imágenes:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadImages()
  }, [backendUrl])

  // Verificar autenticación y lanzar confetti
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    if (!isAuth) {
      router.push("/")
      return
    }
    const launchConfetti = () => {
      if (confettiCount < 3) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
        setConfettiCount((prev) => prev + 1)
      }
    }
    launchConfetti()
    const interval = setInterval(launchConfetti, 3000)
    if (confettiCount >= 3) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [router, confettiCount])

  // Función de subida de imagen con manejo robusto de errores
  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch(`${backendUrl}/`, {
        method: "POST",
        body: formData,
      })

      let data
      try {
        data = await res.json()
      } catch (jsonError) {
        console.error("Error al parsear la respuesta JSON:", jsonError)
        throw new Error("Respuesta del servidor no válida")
      }

      if (!res.ok) {
        console.error("Error en la subida de imagen, respuesta:", data)
        throw new Error(data?.error || "Error en la subida de imagen")
      }

      // Ahora se utiliza "key" en lugar de "fileUrl"
      if (data.key) {
        const fullUrl = `${bucketBaseURL}${data.key}`
        setImages((prev) => [...prev, fullUrl])
      } else {
        console.error("Error: no se encontró key en la respuesta", data)
        throw new Error("No se recibió key en la respuesta")
      }
      setShowUploader(false)
    } catch (error: unknown) {
      let message = "Error en la subida de imagen"
      if (error instanceof Error) {
        message = error.message
      }
      console.error("Error en la subida de imagen:", message)
      // Aquí puedes notificar al usuario
    }
  }

  // Eliminación de imagen (actualmente solo elimina del estado)
  const handleDeleteImage = async (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
        <p className="text-white text-xl">Cargando imágenes...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 relative pb-16">
      <main className="container mx-auto px-2 py-4 md:px-4 md:py-8">
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
          {images.length > 0 ? (
            <Carousel images={images} onDeleteImage={handleDeleteImage} />
          ) : (
            <div className="text-center text-white">
              <p className="text-xl mb-4">No hay imágenes aún</p>
              <Button
                variant="secondary"
                onClick={() => setShowUploader(true)}
                className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
              >
                Agregar imágenes
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Botón de regalo */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors"
          onClick={() => (window.location.href = "https://digitalmarket.com.co")}
        >
          <Gift className="h-10 w-10" />
        </Button>
      </div>

      {/* Botones de audio y subir imagen */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <AudioPlayer />
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors"
          onClick={() => setShowUploader(true)}
        >
          <ImagePlus className="h-10 w-10" />
        </Button>
      </div>

      {showUploader && (
        <ImageUploader onUpload={handleImageUpload} onClose={() => setShowUploader(false)} />
      )}
    </div>
  )
}
