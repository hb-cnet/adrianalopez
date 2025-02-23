// app/api/images/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const uploadDir = path.join(process.cwd(), "public", "uploads");

// Asegurar que el directorio exista
async function ensureUploadDir() {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

export async function POST(request: Request) {
  await ensureUploadDir();
  try {
    const formData = await request.formData();
    const fileField = formData.get("file");
    if (!fileField) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    // El objeto fileField es de tipo File (Web API)
    const file = fileField as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convertir la imagen a WebP con alta calidad (ajusta la calidad según lo necesites)
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 90 })
      .toBuffer();
    
    // Crear un nombre de archivo con extensión .webp
    const baseName = file.name.split(".")[0];
    const fileName = `${Date.now()}-${baseName}.webp`;
    const destPath = path.join(uploadDir, fileName);
    
    await fs.writeFile(destPath, webpBuffer);
    
    // Retornar la URL relativa de la imagen convertida
    const fileUrl = `/uploads/${fileName}`;
    return NextResponse.json({ message: "Imagen subida exitosamente", fileUrl });
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    return NextResponse.json({ error: "Error processing file" }, { status: 500 });
  }
}

export async function GET() {
  await ensureUploadDir();
  try {
    const files = await fs.readdir(uploadDir);
    const fileUrls = files.map((fileName) => `/uploads/${fileName}`);
    return NextResponse.json({ images: fileUrls });
  } catch (error) {
    return NextResponse.json({ error: "Error al leer imágenes" }, { status: 500 });
  }
}
  