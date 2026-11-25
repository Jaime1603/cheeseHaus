import { NextResponse } from "next/server";
import { isRecord, isValidEmail } from "@/lib/validation";

const WHATSAPP_NUMBER = "573128076425";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud no es válido" },
      { status: 400 },
    );
  }

  if (!isRecord(body)) {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud no es válido" },
      { status: 400 },
    );
  }

  const { nombres, apellidos, email: emailValue, mensaje } = body;
  if (
    typeof nombres !== "string" ||
    typeof apellidos !== "string" ||
    typeof emailValue !== "string" ||
    typeof mensaje !== "string" ||
    !nombres.trim() ||
    !apellidos.trim() ||
    !emailValue.trim() ||
    !mensaje.trim()
  ) {
    return NextResponse.json(
      { error: "Completa todos los campos del formulario" },
      { status: 400 },
    );
  }

  const email = emailValue.trim();
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Ingresa un correo electrónico válido" },
      { status: 400 },
    );
  }

  if (nombres.length > 80 || apellidos.length > 80 || email.length > 254) {
    return NextResponse.json(
      { error: "Uno o más campos superan la longitud permitida" },
      { status: 400 },
    );
  }

  if (mensaje.trim().length > 2000) {
    return NextResponse.json(
      { error: "El mensaje debe tener máximo 2000 caracteres" },
      { status: 400 },
    );
  }

  const texto = [
    "Nuevo mensaje de contacto de CheeseHaus",
    `Nombre: ${nombres.trim()} ${apellidos.trim()}`,
    `Correo: ${email}`,
    "",
    mensaje.trim(),
  ].join("\n");

  return NextResponse.json({
    whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`,
  });
}
