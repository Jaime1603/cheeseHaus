import bcrypt from "bcryptjs";
import {
  findCredentialByEmail,
  updateLastAccess,
} from "@/repositories/authRepository";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  rol: string;
}

export async function authenticateCredentials(
  emailValue: unknown,
  passwordValue: unknown,
): Promise<AuthenticatedUser | null> {
  if (typeof emailValue !== "string" || typeof passwordValue !== "string") {
    return null;
  }

  const email = emailValue.trim();
  if (!email || !passwordValue) {
    return null;
  }

  const credential = await findCredentialByEmail(email);
  if (!credential || !credential.activo) {
    return null;
  }

  const passwordIsValid = await bcrypt.compare(
    passwordValue,
    credential.password_hash,
  );
  if (!passwordIsValid) {
    return null;
  }

  await updateLastAccess(credential.id_usuario);

  return {
    id: credential.cliente.id_cliente.toString(),
    email: credential.email,
    name: `${credential.cliente.nombre} ${credential.cliente.apellido}`,
    rol: credential.rol,
  };
}
