// app/birthday/image-viewer.tsx
"use client"

import { Trash2, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ImageViewerProps {
  image: string
  onClose: () => void
  onDelete: () => void
}

export function ImageViewer({ image, onClose, onDelete }: ImageViewerProps) {
  return (
    <div className="fixed inset-0 z-[90]">
      {/* Fondo semitransparente para cerrar la vista al hacer click */}
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />
      {/* Contenedor de contenido con z-index superior */}
      <div className="relative z-[100] flex items-center justify-center min-h-screen">
        {/* Botón para cerrar en la esquina superior derecha */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        {/* Botón para eliminar la imagen en la esquina superior izquierda */}
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-4 left-4 z-[110] bg-red-600 rounded-full p-2 hover:bg-red-700"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="h-6 w-6 text-white" />
        </Button>
        {/* Contenedor de la imagen que evita la propagación de clicks */}
          <Image
            src={image || "/placeholder.svg"}
            alt="Vista completa"
            layout="fill"
            objectFit="contain"
            className="max-h-[90vh] max-w-[90vw]"
          />
      </div>
    </div>
  )
}
