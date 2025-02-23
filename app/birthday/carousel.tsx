// app/birthday/carousel.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { phrases } from "./phrases"
import { ImageViewer } from "./image-viewer"

interface CarouselProps {
  images: string[]
  onDeleteImage: (index: number) => void
}

// Función de shuffle (Fisher–Yates)
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

export function Carousel({ images, onDeleteImage }: CarouselProps) {
  const [currentPhrase, setCurrentPhrase] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  // Almacenamos el orden aleatorio solo al cargar la página
  const [orderedImages, setOrderedImages] = useState<string[]>([])

  useEffect(() => {
    if (images.length && orderedImages.length === 0) {
      setOrderedImages(shuffleArray(images))
    }
  }, [images, orderedImages])

  useEffect(() => {
    const showNewPhrase = () => {
      setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)])
    }
    showNewPhrase()
    const interval = setInterval(showNewPhrase, 8000)
    return () => clearInterval(interval)
  }, [])

  // Duplicar imágenes para efecto infinito
  const duplicatedImages = [...orderedImages, ...orderedImages]

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image)
    setSelectedIndex(index % orderedImages.length)
  }

  const handleDelete = () => {
    if (selectedIndex !== null) {
      onDeleteImage(selectedIndex)
      setSelectedImage(null)
      setSelectedIndex(null)
    }
  }

  return (
    <>
      <div
        className="relative w-full max-w-md mx-auto overflow-hidden"
        style={{ height: "78vh" }}
      >
        <div
          className="animate-scroll px-4"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            animation: "scrollVertical 30s linear infinite",
          }}
        >
          {duplicatedImages.map((image, index) => (
            <div
              key={index}
              className="relative w-full cursor-pointer"
              onClick={() => handleImageClick(image, index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Imagen ${index + 1}`}
                className="w-full h-auto object-contain rounded-xl"
                layout="responsive"
                width={500}
                height={500}
              />
            </div>
          ))}
        </div>

        {currentPhrase && (
          <div className="fixed top-4 left-0 right-0 text-center z-40">
            <p className="text-xl md:text-2xl font-bold text-white bg-black/50 mx-auto inline-block px-4 py-2 rounded-full animate-bounce">
              {currentPhrase}
            </p>
          </div>
        )}
      </div>

      {selectedImage && (
        <ImageViewer
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}
