// app/birthday/page.tsx
"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { ImagePlus, Gift, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel } from "./carousel";
import { ImageUploader } from "./image-uploader";
import { AudioPlayer } from "./audio-player";
import { HoroscopeChatBot } from "@/components/HoroscopeChatBot";

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function BirthdayPage() {
  const router = useRouter();
  const [showUploader, setShowUploader] = useState(false);
  const [showHoroscope, setShowHoroscope] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [confettiCount, setConfettiCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string;
  const bucketBaseURL = "https://pub-6441f60deee34aadbbc59ac975cddf5f.r2.dev/";

  useEffect(() => {
    const loadImages = async () => {
      try {
        const res = await fetch(`${backendUrl}/`);
        const data = await res.json();
        if (data.images) {
          const fullImageUrls = data.images.map(
            (img: string) => `${bucketBaseURL}${img}`
          );
          setImages(shuffleArray(fullImageUrls));
        }
      } catch (error) {
        console.error("Error al cargar imágenes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadImages();
  }, [backendUrl]);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.push("/");
      return;
    }
    const launchConfetti = () => {
      if (confettiCount < 3) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        setConfettiCount((prev) => prev + 1);
      }
    };
    launchConfetti();
    const interval = setInterval(launchConfetti, 3000);
    if (confettiCount >= 3) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [router, confettiCount]);

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${backendUrl}/`, {
        method: "POST",
        body: formData,
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error("Error al parsear la respuesta JSON:", jsonError);
        throw new Error("Respuesta del servidor no válida");
      }
      if (!res.ok) {
        console.error("Error en la subida de imagen, respuesta:", data);
        throw new Error(data?.error || "Error en la subida de imagen");
      }
      if (data.key) {
        const fullUrl = `${bucketBaseURL}${data.key}`;
        setImages((prev) => [...prev, fullUrl]);
      } else {
        console.error("Error: no se encontró key en la respuesta", data);
        throw new Error("No se recibió key en la respuesta");
      }
      setShowUploader(false);
    } catch (error: unknown) {
      let message = "Error en la subida de imagen";
      if (error instanceof Error) {
        message = error.message;
      }
      console.error("Error en la subida de imagen:", message);
    }
  };

  const handleDeleteImage = async (index: number) => {
    const imageUrl = images[index];
    const key = imageUrl.replace(bucketBaseURL, "");
    try {
      const res = await fetch(`${backendUrl}/r2/${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Error en la eliminación de imagen, respuesta:", text);
        throw new Error(text || "Error al eliminar la imagen");
      }
      setImages((prev) => prev.filter((_, i) => i !== index));
    } catch (error: unknown) {
      let message = "Error al eliminar la imagen";
      if (error instanceof Error) {
        message = error.message;
      }
      console.error("Error al eliminar la imagen:", message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
        <p className="text-white text-xl">Cargando imágenes...</p>
      </div>
    );
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
          onClick={() =>
            (window.location.href =
              "https://www.youtube.com/watch?v=98Akpf1ph2o&list=RD98Akpf1ph2o&start_radio=1")
          }
        >
          <Gift className="h-12 w-12" />
        </Button>
      </div>

      {/* Botones flotantes en la esquina inferior derecha */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {/* Botón para abrir el chat de horóscopo */}
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors"
          onClick={() => setShowHoroscope(true)}
        >
          <Sun className="h-12 w-12" />
        </Button>
        <AudioPlayer />
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors"
          onClick={() => setShowUploader(true)}
        >
          <ImagePlus className="h-12 w-12" />
        </Button>
      </div>

      {showUploader && (
        <ImageUploader onUpload={handleImageUpload} onClose={() => setShowUploader(false)} />
      )}
      {showHoroscope && (
        <HoroscopeChatBot onClose={() => setShowHoroscope(false)} />
      )}
    </div>
  );
}
