// app/components/HoroscopeChatBot.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

interface HoroscopeChatBotProps {
  onClose: () => void;
}

export function HoroscopeChatBot({ onClose }: HoroscopeChatBotProps) {
  const [horoscope, setHoroscope] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [dateString, setDateString] = useState("");

  // Función para formatear la respuesta: reemplaza saltos de línea múltiples por dos saltos de línea
  const formatResponse = (text: string) => {
    return text.replace(/\n+/g, "\n\n");
  };

  useEffect(() => {
    // Formateamos la fecha actual
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString("es-ES", options);
    setDateString(formattedDate);

    const fetchHoroscope = async () => {
      setLoading(true);
      try {
        const prompt = `Genera el horóscopo diario para Piscis en español. Hazlo dirigido para Adriana, con un tono amistoso y motivador, incluyendo emoticonos y frases alentadoras.
        
Tu horóscopo para el día de hoy ${formattedDate} es:
        
Separa cada párrafo con un solo salto de línea.`;
        const res = await axios.post("/api/chat", { prompt, conversation: [] });
        const formatted = formatResponse(res.data.response);
        setHoroscope(formatted);
      } catch {
        setHoroscope("Error al obtener el horóscopo. 😕");
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscope();
  }, []);

  return (
    <div className="fixed bottom-16 right-4 z-50 w-full max-w-md mx-4 h-[28rem] bg-white rounded-lg shadow-xl flex flex-col">
      {/* Cabecera del chat con título y botón de cierre */}
      <div className="flex items-center justify-between bg-blue-600 text-white p-3 rounded-t-lg">
        <h3 className="text-2xl font-bold">
          Horóscopo del día ({dateString})
        </h3>
        <button onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>
      {/* Contenedor de mensajes con padding izquierdo de 15px */}
      <div className="flex-1 p-4 pl-[15px] overflow-y-auto bg-gray-50 whitespace-pre-wrap">
        {loading ? (
          <div className="text-center text-gray-500 mt-2">
            Generando horóscopo... ⏳
          </div>
        ) : (
          <p>{horoscope}</p>
        )}
      </div>
    </div>
  );
}
