import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { isRecord, isValidEmail } from "@/lib/validation";
import { createAccountToken, verificationTokenType } from "@/lib/accountTokens";
import { isEmailConfigured, sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
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

  const { nombre, apellido, email: emailValue, password } = body;
  if (
    typeof nombre !== "string" ||
    typeof apellido !== "string" ||
    typeof emailValue !== "string" ||
    typeof password !== "string" ||
    !nombre.trim() ||
    !apellido.trim() ||
    !emailValue.trim() ||
    !password
  ) {
    return NextResponse.json(
      { error: "Todos los campos son obligatorios" },
      { status: 400 },
    );
  }

  const email = emailValue.trim().toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Ingresa un correo electrónico válido" },
      { status: 400 },
    );
  }

  if (nombre.trim().length > 50 || apellido.trim().length > 50) {
    return NextResponse.json(
      { error: "El nombre y el apellido deben tener máximo 50 caracteres" },
      { status: 400 },
    );
  }

  if (email.length > 100) {
    return NextResponse.json(
      { error: "El correo electrónico debe tener máximo 100 caracteres" },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "La contraseña debe tener al menos 6 caracteres" },
      { status: 400 },
    );
  }

  let token: string;
  try {
    const credencialExistente = await prisma.credencial.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: {
        email: true,
        email_verificado_en: true,
      },
    });

    if (credencialExistente?.email_verificado_en) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo electrónico" },
        { status: 409 },
      );
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: "El servicio de correo no está configurado" },
        { status: 503 },
      );
    }

    if (!credencialExistente) {
      const passwordHash = await bcrypt.hash(password, 12);
      await prisma.cliente.create({
        data: {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          email,
          telefono_cliente: "",
          cedula: "",
          credenciales: {
            create: {
              email,
              password_hash: passwordHash,
              activo: true,
            },
          },
        },
      });
    }

    token = await createAccountToken(
      email,
      verificationTokenType,
      24 * 60 * 60 * 1000,
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo electrónico" },
        { status: 409 },
      );
    }

    console.error("Error al registrar usuario", error);
    return NextResponse.json(
      { error: "No fue posible procesar el registro" },
      { status: 500 },
    );
  }

  try {
    await sendVerificationEmail(email, token);
  } catch (error) {
    console.error("Error al enviar el correo de verificación", error);
    return NextResponse.json(
      { error: "No fue posible enviar el correo de verificación" },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      message:
        "Te enviamos un enlace de verificación. Confirma tu correo para activar la cuenta.",
    },
    { status: 202 },
  );
}