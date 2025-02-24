// app/components/HoroscopeChatBot.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Send, X } from "lucide-react";

interface HoroscopeChatBotProps {
  onClose: () => void;
}

export function HoroscopeChatBot({ onClose }: HoroscopeChatBotProps) {
  const [conversation, setConversation] = useState<
    { role: string; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const formatBotResponse = (text: string) => {
    if (!text.trim().endsWith("?")) {
      return text + " 😊 ¿Deseas saber algo más sobre tu horóscopo?";
    }
    return text;
  };

  useEffect(() => {
    const fetchHoroscope = async () => {
      setLoading(true);
      try {
        const prompt =
          "Genera el horóscopo diario para Piscis en español, con un tono amistoso y motivador, incluyendo emoticonos y frases alentadoras.";
        const res = await axios.post("/api/chat", { prompt, conversation: [] });
        const botMessage = {
          role: "bot",
          content: formatBotResponse(res.data.response),
        };
        setConversation([botMessage]);
      } catch {
        setConversation([{ role: "bot", content: "Error al obtener el horóscopo. 😕" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscope();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post("/api/chat", {
        prompt: "",
        conversation: updatedConversation,
      });
      const botMessage = {
        role: "bot",
        content: formatBotResponse(res.data.response),
      };
      setConversation((prev) => [...prev, botMessage]);
    } catch {
      setConversation((prev) => [
        ...prev,
        { role: "bot", content: "Error al obtener respuesta. 😕" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-16 right-4 z-50 w-96 h-[28rem] bg-white rounded-lg shadow-xl flex flex-col">
      {/* Cabecera del chat con botón de cierre */}
      <div className="flex items-center justify-between bg-blue-600 text-white p-3 rounded-t-lg">
        <h3 className="text-lg font-bold">Horóscopo Diario</h3>
        <button onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>
      {/* Contenedor de mensajes con padding izquierdo de 15px */}
      <div className="flex-1 p-4 pl-[15px] overflow-y-auto bg-gray-50">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-md ${
              msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-200 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="text-center text-gray-500 mt-2">
            Generando respuesta... ⏳
          </div>
        )}
      </div>
      {/* Input y botón para enviar mensajes */}
      <div className="flex p-3 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          className="flex-1 p-2 border rounded-md focus:outline-none"
        />
        <button
          className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={sendMessage}
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
