import { NextResponse } from "next/server";
import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  try {
    const { prompt, conversation } = await request.json();

    // Mensaje del sistema que indica cómo formatear la respuesta.
    const systemMessage = {
      role: "system",
      content:
        "Eres un experto en horóscopo. Responde en español con un tono amigable y motivador. Cada párrafo debe estar separado por dos saltos de línea para que el texto se vea espaciado y agradable. Formatea la respuesta con claridad y usa emoticonos cuando sea apropiado, el horóscopo diario va dirigido a Adriana.",
    };

    const messages =
      conversation && conversation.length > 0
        ? conversation
        : [systemMessage, { role: "user", content: prompt }];

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 300,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const messageContent = response.data.choices[0].message.content;
    return NextResponse.json({ response: messageContent });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Error generando respuesta";
    console.error("Error en API chat:", error);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
