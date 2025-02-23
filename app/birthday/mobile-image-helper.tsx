// app/birthday/mobile-image-helper.tsx
"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function MobileImageHelper() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <Alert className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>¿Problemas para subir imágenes?</AlertTitle>
      <AlertDescription className="text-sm mt-2">
        <ul className="list-disc list-inside space-y-1">
          <li>Usa el botón Seleccionar de la galería para elegir una imagen existente</li>
          <li>O usa Tomar foto para usar la cámara directamente</li>
        </ul>
        <button
          onClick={() => setDismissed(true)}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Entendido, no mostrar de nuevo
        </button>
      </AlertDescription>
    </Alert>
  );
}
