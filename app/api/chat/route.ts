// app/api/chat/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("La variable de entorno OPENAI_API_KEY no está definida");
}

export async function POST(request: Request) {
  try {
    const { prompt, conversation } = await request.json();

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json(
        { error: "El prompt no puede estar vacío" },
        { status: 401 }
      );
    }

    const systemMessage = {
      role: "system",
      content:
        "Genera el horóscopo diario para Piscis en español. Hazlo dirigido para Adriana, con un tono amistoso y motivador, incluyendo emoticonos y frases alentadoras. Separa cada párrafo con un solo salto de línea, e indica que es el horoscopo del dia, y entregas el dia actual.",
    };

    const messages =
      conversation && Array.isArray(conversation) && conversation.length > 0
        ? conversation
        : [systemMessage, { role: "user", content: prompt }];

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 400,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // Procesamos la respuesta para reemplazar múltiples saltos de línea por uno solo.
    let messageContent = response.data.choices[0].message.content;
    messageContent = messageContent.replace(/\n{2,}/g, "\n");

    return NextResponse.json({ response: messageContent });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error data:", error.response?.data);
    }
    const errMsg =
      error instanceof Error ? error.message : "Error generando respuesta";
    console.error("Error en API chat:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
