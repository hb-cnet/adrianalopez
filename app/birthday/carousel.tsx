// app/birthday/carousel.tsx
"use client"

import Image from "next/image";
import { FC } from "react";
import { Trash2 } from "lucide-react";

interface CarouselProps {
  images: string[]; // claves de las imágenes
  onDeleteImage: (key: string) => void;
  backendUrl: string;
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
