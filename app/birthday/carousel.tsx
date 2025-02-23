// app/birthday/carousel.tsx
"use client"

import Image from "next/image";
import React, { FC, useState } from "react";
import { Trash2 } from "lucide-react";

interface CarouselProps {
  images: string[]; // claves de los objetos (nombres de archivo)
  onDeleteImage: (key: string) => void;
  backendUrl: string; // URL base de tu Worker (por ejemplo, NEXT_PUBLIC_BACKEND_URL)
}

const Carousel: FC<CarouselProps> = ({ images, onDeleteImage, backendUrl }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Duplicar imágenes para simular un scroll infinito
  const duplicatedImages = [...images, ...images];

  return (
    <>
      {/* Definimos keyframes para el scroll vertical */}
      <style jsx>{`
        @keyframes scrollVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .scroll-container {
          animation: scrollVertical 30s linear infinite;
        }
        .scroll-container:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative">
        {/* Contenedor del carrusel con scroll vertical */}
        <div className="overflow-hidden h-[70vh]">
          <div className="scroll-container">
            {duplicatedImages.map((key, index) => (
              <div
                key={index}
                className="mb-4 cursor-pointer"
                onClick={() => setSelectedImage(key)}
              >
                <Image
                  src={`${backendUrl}/r2/${encodeURIComponent(key)}`}
                  alt={`Imagen ${index + 1}`}
                  width={500}
                  height={500}
                  unoptimized
                  className="w-full object-contain rounded-xl"
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
      </div>
    </>
  );
};

export default Carousel;
