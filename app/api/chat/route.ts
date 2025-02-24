// app/api/chat/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Se obtiene de .env.local

export async function POST(request: Request) {
  try {
    const { prompt, conversation } = await request.json();

    // Si no hay conversación previa, usamos el prompt inicial.
    const messages = conversation && conversation.length > 0 
      ? conversation 
      : [{ role: "user", content: prompt }];

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 200,
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
  } catch (error: any) {
    console.error("Error en API chat:", error);
    return NextResponse.json({ error: error.message || "Error generando respuesta" }, { status: 500 });
  }
}
