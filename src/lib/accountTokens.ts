import { createHash, randomBytes } from "node:crypto";
import type { TokenAutenticacion } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const verificationTokenType = "VERIFY_EMAIL";
export const passwordResetTokenType = "RESET_PASSWORD";

export function hashAccountToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createAccountToken(
  email: string,
  type: string,
  expiresInMs: number,
) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashAccountToken(token);

  await prisma.$transaction(async (transaction) => {
    await transaction.tokenAutenticacion.deleteMany({
      where: { email, tipo: type },
    });
    await transaction.tokenAutenticacion.create({
      data: {
        email,
        tipo: type,
        token_hash: tokenHash,
        fecha_expiracion: new Date(Date.now() + expiresInMs),
      },
    });
  });

  return token;
}

export async function findAccountToken(
  token: string,
  type: string,
): Promise<TokenAutenticacion | null> {
  const record = await prisma.tokenAutenticacion.findUnique({
    where: { token_hash: hashAccountToken(token) },
  });
  return record?.tipo === type ? record : null;
}
