// app/birthday/carousel.tsx
"use client"

import Image from "next/image";
import { FC } from "react";
import { Trash2 } from "lucide-react";

interface CarouselProps {
  images: string[]; // Claves de los objetos en R2 (por ejemplo, "Unknown-a1.jpeg")
  onDeleteImage: (key: string) => void;
  backendUrl: string; // La URL base de tu Worker (ej: https://my-birthday-backend.alvaro-hurtado.workers.dev)
}

export const Carousel: FC<CarouselProps> = ({ images, onDeleteImage, backendUrl }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {images.map((key, index) => (
        <div key={index} className="relative group">
          <Image
            src={`${backendUrl}/r2/${encodeURIComponent(key)}`}
            alt={`Imagen ${index + 1}`}
            width={500}
            height={500}
            unoptimized
            className="rounded-xl object-contain"
          />
          {/* Botón de eliminación: se muestra al hacer hover o al tocar */}
          <button
            onClick={() => onDeleteImage(key)}
            className="absolute bottom-2 left-2 hidden group-hover:block bg-red-500 text-white p-1 rounded"
            title="Eliminar imagen"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
