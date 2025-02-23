// app/birthday/audio-player.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AudioPlayer() {
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/birthday-song.mp3")
    audioRef.current.loop = true

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
      setIsMuted(!isMuted)
    }
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className="bg-white/80 backdrop-blur-sm" // se quita la posición fija
      onClick={toggleMute}
    >
      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </Button>
  )
}
