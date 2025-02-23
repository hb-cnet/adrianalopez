// app/birthday/carousel.tsx
"use client"

import React, { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

interface CarouselProps {
  images: string[];
  onDeleteImage: (key: string) => void;
  backendUrl: string;
}

const Carousel: React.FC<CarouselProps> = ({ images, onDeleteImage, backendUrl }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (key: string) => {
    setSelectedImage(key);
  };

  const closePreview = () => {
    setSelectedImage(null);
  };

  return (
    <div className="relative">
      {/* Lista vertical de imágenes */}
      <div className="overflow-y-auto h-[70vh]">
        {images.map((key, index) => (
          <div key={index} className="mb-4 cursor-pointer" onClick={() => handleImageClick(key)}>
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
                closePreview();
              }}
              className="absolute bottom-4 left-4 bg-red-500 text-white p-2 rounded"
              title="Eliminar imagen"
            >
              <Trash2 className="h-6 w-6" />
            </button>
            {/* Botón para cerrar la vista previa */}
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded"
              title="Cerrar vista previa"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;
