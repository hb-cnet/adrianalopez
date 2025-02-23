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

function BirthdayPage() {
  const router = useRouter()
  const [showUploader, setShowUploader] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [confettiCount, setConfettiCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string

  // Cargar imágenes desde el backend vía GET
  useEffect(() => {
    const loadImages = async () => {
      try {
        const res = await fetch(`${backendUrl}/`)
        const data = await res.json()
        if (data.images) {
          setImages(data.images)
        } else {
          setImages([])
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
    return () => clearInterval(interval)
  }, [router, confettiCount])

  // Función para subir imagen (POST)
  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch(`${backendUrl}/`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.key) {
        setImages((prev) => [...prev, data.key])
      } else {
        console.error("Error en la subida de imagen:", data ? data.error : "Respuesta vacía")
      }
      setShowUploader(false)
    } catch (error) {
      console.error("Error al subir imagen:", error)
    }
  }

  // Función para eliminar imagen (DELETE) que recibe la clave de la imagen
  const handleDeleteImage = async (key: string) => {
    try {
      const res = await fetch(`${backendUrl}/r2/${encodeURIComponent(key)}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (res.ok) {
        setImages((prev) => prev.filter((imgKey) => imgKey !== key))
      } else {
        console.error("Error al eliminar imagen:", data.error)
      }
    } catch (error) {
      console.error("Error al eliminar imagen:", error)
    }
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
            <Carousel images={images} onDeleteImage={handleDeleteImage} backendUrl={backendUrl} />
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

      {/* Botón de regalo en la esquina inferior izquierda */}
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

      {/* Botones de mute y subir imagen en la esquina inferior derecha */}
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

export default BirthdayPage;
