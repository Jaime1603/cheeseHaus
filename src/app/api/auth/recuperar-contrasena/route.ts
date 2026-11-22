import { NextResponse } from "next/server";
import { isRecord, isValidEmail } from "@/lib/validation";

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

  const emailValue = body.email;
  if (typeof emailValue !== "string" || !isValidEmail(emailValue.trim())) {
    return NextResponse.json(
      { error: "Ingresa un correo electrónico válido" },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      message:
        "Solicitud recibida. Si el correo está registrado, recibirías instrucciones. El envío de correos aún no está configurado en este proyecto.",
    },
    { status: 202 },
  );
}
