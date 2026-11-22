import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { isRecord, isValidEmail } from "@/lib/validation";

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

  try {
    const credencialExistente = await prisma.credencial.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (credencialExistente) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo electrónico" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const nuevoCliente = await prisma.cliente.create({
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

    return NextResponse.json(
      {
        message: "Usuario creado exitosamente",
        clienteId: nuevoCliente.id_cliente,
      },
      { status: 201 },
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
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}