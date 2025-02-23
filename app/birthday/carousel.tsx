"use client"

import Image from "next/image";
import React, { FC, useState, useEffect } from "react";
//import { Trash2 } from "lucide-react";
import { phrases } from "./phrases";
import { ImageViewer } from "./image-viewer";

interface CarouselProps {
  images: string[]; // Claves (nombres de archivo) de las imágenes
  onDeleteImage: (key: string) => void; // Función que elimina la imagen dado su key
  // (Si en el futuro necesitas pasar backendUrl, lo harías desde la página, pero aquí se espera que cada URL esté ya completa)
}

const Carousel: FC<CarouselProps> = ({ images, onDeleteImage }) => {
  const [currentPhrase, setCurrentPhrase] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // Conserva el orden aleatorio de las imágenes
  const [orderedImages, setOrderedImages] = useState<string[]>([]);

  // Mezcla el orden de las imágenes al cargar
  useEffect(() => {
    if (images.length && orderedImages.length === 0) {
      setOrderedImages(shuffleArray(images));
    }
  }, [images, orderedImages]);

  // Actualiza la frase cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * phrases.length);
      setCurrentPhrase(phrases[randomIndex]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Duplicar imágenes para simular scroll infinito
  const duplicatedImages = [...orderedImages, ...orderedImages];

  // Al hacer clic en una imagen se abre el modal
  const handleImageClick = (key: string) => {
    setSelectedImage(key);
  };

  return (
    <div className="relative">
      {/* Frase animada en la parte superior */}
      {currentPhrase && (
        <div className="fixed top-4 left-0 right-0 text-center z-40">
          <p className="text-xl md:text-2xl font-bold text-white bg-black/50 mx-auto inline-block px-4 py-2 rounded-full animate-bounce">
            {currentPhrase}
          </p>
        </div>
      )}

      {/* Carrusel vertical */}
      <div className="overflow-hidden h-[78vh] mt-16">
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
            <div
              key={index}
              className="relative w-full cursor-pointer"
              onClick={() => handleImageClick(key)}
            >
              <Image
                src={key} // Se asume que el valor ya es una URL completa; si no, deberás construirla en la página padre
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
        <ImageViewer
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={() => {
            onDeleteImage(selectedImage);
            setSelectedImage(null);
          }}
        />
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
