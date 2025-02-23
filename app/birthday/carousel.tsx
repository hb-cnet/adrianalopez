// app/birthday/carousel.tsx
"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { phrases } from "./phrases"; // Asegúrate de que tus frases incluyan emojis
import { ImageViewer } from "./image-viewer"; // Componente modal para vista previa

interface CarouselProps {
  images: string[]; // Claves de los objetos (nombres de archivo)
  onDeleteImage: (index: number) => void; // Función que elimina la imagen dado su índice
}

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function Carousel({ images, onDeleteImage }: CarouselProps) {
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [orderedImages, setOrderedImages] = useState<string[]>([]);

  // Al cargar, se mezcla el orden de las imágenes
  useEffect(() => {
    if (images.length && orderedImages.length === 0) {
      setOrderedImages(shuffleArray(images));
    }
  }, [images, orderedImages]);

  // Actualiza la frase aleatoriamente cada 8 segundos
  useEffect(() => {
    const showNewPhrase = () => {
      const randomIndex = Math.floor(Math.random() * phrases.length);
      setCurrentPhrase(phrases[randomIndex]);
    };
    showNewPhrase();
    const interval = setInterval(showNewPhrase, 8000);
    return () => clearInterval(interval);
  }, []);

  // Duplicamos las imágenes para simular un scroll infinito
  const duplicatedImages = [...orderedImages, ...orderedImages];

  // Al hacer clic, se abre la vista previa y se guarda el índice original
  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index % orderedImages.length);
  };

  // Al eliminar, se llama a la función del padre con el índice
  const handleDelete = () => {
    if (selectedIndex !== null) {
      onDeleteImage(selectedIndex);
      setSelectedImage(null);
      setSelectedIndex(null);
    }
  };

  return (
    <>
      <div className="relative w-full max-w-md mx-auto overflow-hidden" style={{ height: "78vh" }}>
        {/* Frase animada en la parte superior */}
        {currentPhrase && (
          <div className="fixed top-4 left-0 right-0 text-center z-40">
            <p className="text-xl md:text-2xl font-bold text-white bg-black/50 mx-auto inline-block px-4 py-2 rounded-full animate-bounce">
              {currentPhrase}
            </p>
          </div>
        )}

        {/* Carrusel vertical */}
        <div className="overflow-hidden mt-16">
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
              <div key={index} className="relative w-full cursor-pointer" onClick={() => handleImageClick(image, index)}>
                <Image
                  src={image || "/placeholder.svg"}
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
      </div>

      {/* Modal de vista previa */}
      {selectedImage && (
        <ImageViewer
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={handleDelete}
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
    </>
  );
}
