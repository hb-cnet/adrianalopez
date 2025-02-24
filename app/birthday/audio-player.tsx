// app/birthday/audio-player.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AudioPlayer() {
  // Iniciamos con isMuted en false para intentar reproducir el sonido
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Crear el objeto de audio y configurarlo
    const audio = new Audio("/birthday-song.mp3")
    audio.loop = true
    audioRef.current = audio

    // Intentar reproducir el audio automáticamente
    audio.play().catch((err) =>
      console.error("Error auto-playing audio:", err)
    )

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        // Reproducir el audio si estaba en mute
        audioRef.current.play().catch((err) =>
          console.error("Error playing audio:", err)
        )
      } else {
        // Pausar el audio si no está en mute
        audioRef.current.pause()
      }
      setIsMuted(!isMuted)
    }
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className="bg-white/80 backdrop-blur-sm"
      onClick={toggleMute}
    >
      {isMuted ? (
        <VolumeX className="h-8 w-8" />
      ) : (
        <Volume2 className="h-8 w-8" />
      )}
    </Button>
  )
}
