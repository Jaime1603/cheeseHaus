import { NextResponse } from "next/server";
import { findAccountToken, verificationTokenType } from "@/lib/accountTokens";
import { prisma } from "@/lib/prisma";
import { getAppBaseUrl } from "@/lib/email";

function loginRedirect(status: "exitosa" | "fallida") {
  return NextResponse.redirect(
    new URL(`/login?verificacion=${status}`, getAppBaseUrl()),
  );
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token) {
    return loginRedirect("fallida");
  }

  try {
    const storedToken = await findAccountToken(token, verificationTokenType);
    if (!storedToken || storedToken.fecha_expiracion <= new Date()) {
      return loginRedirect("fallida");
    }

    const verified = await prisma.$transaction(async (transaction) => {
      const currentToken = await transaction.tokenAutenticacion.findUnique({
        where: { id_token: storedToken.id_token },
      });
      if (
        !currentToken ||
        currentToken.tipo !== verificationTokenType ||
        currentToken.fecha_expiracion <= new Date()
      ) {
        return false;
      }

      const result = await transaction.credencial.updateMany({
        where: { email: currentToken.email },
        data: { email_verificado_en: new Date() },
      });
      await transaction.tokenAutenticacion.delete({
        where: { id_token: currentToken.id_token },
      });
      return result.count === 1;
    });

    return loginRedirect(verified ? "exitosa" : "fallida");
  } catch (error) {
    console.error("Error al verificar el correo", error);
    return NextResponse.json(
      { error: "No fue posible verificar el correo" },
      { status: 500 },
    );
  }
}
