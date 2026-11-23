import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { isRecord } from "@/lib/validation";
import {
  findAccountToken,
  passwordResetTokenType,
} from "@/lib/accountTokens";
import { prisma } from "@/lib/prisma";

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

  if (
    !isRecord(body) ||
    typeof body.token !== "string" ||
    typeof body.password !== "string" ||
    body.password.length < 6
  ) {
    return NextResponse.json(
      { error: "El enlace o la contraseña no son válidos" },
      { status: 400 },
    );
  }

  try {
    const storedToken = await findAccountToken(
      body.token,
      passwordResetTokenType,
    );
    if (!storedToken || storedToken.fecha_expiracion <= new Date()) {
      return NextResponse.json(
        { error: "El enlace no es válido o ya venció" },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const updated = await prisma.$transaction(async (transaction) => {
      const currentToken = await transaction.tokenAutenticacion.findUnique({
        where: { id_token: storedToken.id_token },
      });
      if (
        !currentToken ||
        currentToken.tipo !== passwordResetTokenType ||
        currentToken.fecha_expiracion <= new Date()
      ) {
        return false;
      }

      const result = await transaction.credencial.updateMany({
        where: {
          email: currentToken.email,
          activo: true,
          email_verificado_en: { not: null },
        },
        data: { password_hash: passwordHash },
      });
      await transaction.tokenAutenticacion.delete({
        where: { id_token: currentToken.id_token },
      });
      return result.count === 1;
    });

    if (!updated) {
      return NextResponse.json(
        { error: "La cuenta asociada al enlace no está disponible" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: "Contraseña actualizada. Ya puedes iniciar sesión.",
    });
  } catch (error) {
    console.error("Error al cambiar la contraseña", error);
    return NextResponse.json(
      { error: "No fue posible cambiar la contraseña" },
      { status: 500 },
    );
  }
}
