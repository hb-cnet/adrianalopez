// app/birthday/image-uploader.tsx
"use client"

import { useState, useRef } from "react"
import { Camera, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploaderProps {
  onUpload: (file: File) => Promise<void>
  onClose: () => void
}

export function ImageUploader({ onUpload, onClose }: ImageUploaderProps) {
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona una imagen válida")
      return false
    }
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError("La imagen es demasiado grande. Máximo 5MB")
      return false
    }
    return true
  }

  const processFile = (file: File) => {
    if (!validateFile(file)) return
    setIsLoading(true)
    setError("")
    // Se envía el archivo y se maneja el error en caso de fallo
    onUpload(file)
      .catch((err) => {
        console.error("Error en la subida de imagen:", err)
        setError("Error al subir la imagen. Intenta nuevamente.")
      })
      .finally(() => setIsLoading(false))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="upload-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>Agregar nueva foto</DialogTitle>
        </DialogHeader>
        {/* Elemento de descripción oculto para accesibilidad */}
        <p id="upload-dialog-description" className="sr-only">
          Selecciona o toma una foto para subirla
        </p>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Seleccionar imagen de la galería"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Tomar foto con la cámara"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
            Seleccionar de la galería
          </Button>
          <Button
            onClick={() => cameraInputRef.current?.click()}
            variant="secondary"
            className="w-full flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            Tomar foto
          </Button>
          <div className="text-sm text-muted-foreground space-y-2 bg-secondary/50 p-3 rounded-lg">
            <p className="font-medium">Consejos para subir imágenes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Selecciona imágenes de tu galería o toma una foto nueva</li>
              <li>Asegúrate de permitir el acceso cuando el navegador lo solicite</li>
              <li>El tamaño máximo permitido es de 5MB</li>
              <li>Se aceptan todos los formatos comunes de imagen</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
