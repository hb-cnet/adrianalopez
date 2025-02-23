// app/birthday/carousel.tsx
"use client"

import Image from "next/image";
import React, { FC, useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

interface CarouselProps {
  images: string[]; // Claves de los objetos (nombres de archivo)
  onDeleteImage: (key: string) => void; // Ahora espera una cadena, no un número
  backendUrl: string; // URL base de tu Worker
}

const phrases = [
  "🎉 ¡Feliz Cumpleaños! 🎉",
  "😊 ¡Que tengas un día maravilloso! 😊",
  "🌟 Eres lo mejor 🌟",
  "💖 Te pienso siempre 💖",
  "🎂 Hoy será un gran día 🎂"
];

const Carousel: FC<CarouselProps> = ({ images, onDeleteImage, backendUrl }) => {
  const [currentPhrase, setCurrentPhrase] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mezclar el orden de las imágenes solo al cargar
  const [orderedImages, setOrderedImages] = useState<string[]>([]);
  useEffect(() => {
    if (images.length && orderedImages.length === 0) {
      setOrderedImages(shuffleArray(images));
    }
  }, [images, orderedImages]);

  // Actualiza la frase aleatoriamente cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * phrases.length);
      setCurrentPhrase(phrases[randomIndex]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Duplicar imágenes para simular scroll infinito
  const duplicatedImages = [...orderedImages, ...orderedImages];

  const handleImageClick = (key: string) => {
    setSelectedImage(key);
  };

  return (
    <div className="relative">
      {/* Frase en la parte superior */}
      {currentPhrase && (
        <div className="fixed top-4 left-0 right-0 text-center z-40">
          <p className="text-xl md:text-2xl font-bold text-white bg-black/50 mx-auto inline-block px-4 py-2 rounded-full animate-bounce">
            {currentPhrase}
          </p>
        </div>
      )}

      {/* Carrusel vertical */}
      <div className="overflow-hidden h-[70vh] mt-16">
        <div
          className="animate-scroll px-4"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            animation: "scrollVertical 30s linear infinite",
          }}
        >
          {duplicatedImages.map((key, index) => (
            <div key={index} className="relative w-full cursor-pointer" onClick={() => handleImageClick(key)}>
              <Image
                src={`${backendUrl}/r2/${encodeURIComponent(key)}`}
                alt={`Imagen ${index + 1}`}
                layout="responsive"
                width={500}
                height={500}
                unoptimized
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal de vista previa */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative">
            <Image
              src={`${backendUrl}/r2/${encodeURIComponent(selectedImage)}`}
              alt="Vista previa"
              width={800}
              height={800}
              unoptimized
              className="rounded-xl"
            />
            {/* Botón para eliminar la imagen */}
            <button
              onClick={() => {
                onDeleteImage(selectedImage);
                setSelectedImage(null);
              }}
              className="absolute bottom-4 left-4 bg-red-500 text-white p-2 rounded"
              title="Eliminar imagen"
            >
              <Trash2 className="h-6 w-6" />
            </button>
            {/* Botón para cerrar la vista previa */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded"
              title="Cerrar vista previa"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scrollVertical {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default Carousel;
