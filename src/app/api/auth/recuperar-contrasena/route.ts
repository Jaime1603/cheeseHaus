import { NextResponse } from "next/server";
import { isRecord, isValidEmail } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { createAccountToken, passwordResetTokenType } from "@/lib/accountTokens";
import { isEmailConfigured, sendPasswordResetEmail } from "@/lib/email";

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

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { error: "El servicio de correo no está configurado" },
      { status: 503 },
    );
  }

  const email = emailValue.trim().toLowerCase();
  let token: string | null = null;
  let recipientEmail = email;
  try {
    const credential = await prisma.credencial.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        activo: true,
        email_verificado_en: { not: null },
      },
      select: { email: true },
    });

    if (credential) {
      recipientEmail = credential.email;
      token = await createAccountToken(
        credential.email,
        passwordResetTokenType,
        60 * 60 * 1000,
      );
    }
  } catch (error) {
    console.error("Error al preparar recuperación de contraseña", error);
    return NextResponse.json(
      { error: "No fue posible procesar la solicitud" },
      { status: 500 },
    );
  }

  if (token) {
    try {
      await sendPasswordResetEmail(recipientEmail, token);
    } catch (error) {
      console.error("Error al enviar recuperación de contraseña", error);
      return NextResponse.json(
        { error: "No fue posible enviar el correo de recuperación" },
        { status: 503 },
      );
    }
  }

  return NextResponse.json(
    {
      message:
        "Si la cuenta existe y está verificada, recibirás un enlace para restablecer la contraseña.",
    },
    { status: 202 },
  );
}
