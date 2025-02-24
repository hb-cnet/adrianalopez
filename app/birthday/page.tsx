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

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

export default function BirthdayPage() {
  const router = useRouter()
  const [showUploader, setShowUploader] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [confettiCount, setConfettiCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string

  // URL base del bucket en Cloudflare R2
  const bucketBaseURL = "https://pub-6441f60deee34aadbbc59ac975cddf5f.r2.dev/"

  // Cargar imágenes desde el backend vía GET y randomizar el orden al cargar la página
  useEffect(() => {
    const loadImages = async () => {
      try {
        const res = await fetch(`${backendUrl}/`)
        const data = await res.json()
        if (data.images) {
          const fullImageUrls = data.images.map((img: string) => `${bucketBaseURL}${img}`)
          setImages(shuffleArray(fullImageUrls))
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

  // Función de subida de imagen (sin cambios respecto a la versión anterior)
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

      if (data.key) {
        const fullUrl = `${bucketBaseURL}${data.key}`
        // Se agrega al final sin reordenar el arreglo ya existente.
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
    }
  }

  // Función para eliminar imagen: llama al endpoint DELETE para mover la imagen a la carpeta "trash"
  const handleDeleteImage = async (index: number) => {
    const imageUrl = images[index]
    // Extraer la clave del archivo: elimina la URL base
    const key = imageUrl.replace(bucketBaseURL, "")
    try {
      const res = await fetch(`${backendUrl}/?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const data = await res.json()
        console.error("Error en la eliminación de imagen, respuesta:", data)
        throw new Error(data?.error || "Error al eliminar la imagen")
      }
      // Si la eliminación es exitosa, quitar la imagen del estado
      setImages((prev) => prev.filter((_, i) => i !== index))
    } catch (error: unknown) {
      let message = "Error al eliminar la imagen"
      if (error instanceof Error) {
        message = error.message
      }
      console.error("Error al eliminar la imagen:", message)
      // Aquí podrías notificar al usuario de algún error
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
