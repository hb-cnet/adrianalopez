// app/components/HoroscopeChatBot.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Send, MessageCircle } from "lucide-react";

export function HoroscopeChatBot() {
  const [conversation, setConversation] = useState<
    { role: string; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Al montar el componente, obtenemos el horóscopo diario para Piscis.
  useEffect(() => {
    const fetchHoroscope = async () => {
      setLoading(true);
      try {
        // Prompt inicial: se solicita el horóscopo diario para Piscis, en español, con tono amistoso y frases alentadoras.
        const prompt = "Genera el horóscopo diario para Piscis en español, con un tono amistoso y motivador, incluyendo frases alentadoras.";
        const res = await axios.post("/api/chat", { prompt, conversation: [] });
        const botMessage = { role: "bot", content: res.data.response };
        setConversation([botMessage]);
      } catch (error) {
        setConversation([{ role: "bot", content: "Error al obtener el horóscopo." }]);
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscope();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Agregar el mensaje del usuario al chat
    const userMessage = { role: "user", content: input };
    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);
    setInput("");

    setLoading(true);
    try {
      // Enviar la conversación completa para mantener el contexto
      const res = await axios.post("/api/chat", {
        prompt: "", // El prompt inicial ya se incluyó en la conversación
        conversation: updatedConversation,
      });
      const botMessage = { role: "bot", content: res.data.response };
      setConversation((prev) => [...prev, botMessage]);
    } catch (error) {
      setConversation((prev) => [
        ...prev,
        { role: "bot", content: "Error al obtener respuesta." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="p-4 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white w-80 p-4 shadow-lg rounded-lg">
          <div className="h-64 overflow-y-auto">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-1 rounded-md ${
                  msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="p-2 my-1 text-center text-gray-500">
                Generando respuesta...
              </div>
            )}
          </div>
          <div className="flex items-center mt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 p-2 border rounded-md"
            />
            <button
              className="ml-2 p-3 bg-blue-600 text-white rounded-md"
              onClick={sendMessage}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
