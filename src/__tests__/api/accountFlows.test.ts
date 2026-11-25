/** @jest-environment node */
jest.mock("@/lib/prisma", () => ({
  prisma: {
    credencial: {
      findFirst: jest.fn(),
      updateMany: jest.fn(),
    },
    cliente: { create: jest.fn() },
    tokenAutenticacion: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock("@/lib/accountTokens", () => ({
  createAccountToken: jest.fn(),
  findAccountToken: jest.fn(),
  verificationTokenType: "VERIFY_EMAIL",
  passwordResetTokenType: "RESET_PASSWORD",
}));

jest.mock("@/lib/email", () => ({
  isEmailConfigured: jest.fn(),
  sendVerificationEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  getAppBaseUrl: () => "http://localhost:3000",
}));

jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: { hash: jest.fn().mockResolvedValue("hashed-password") },
}));

import { POST as register } from "@/app/api/registro/route";
import {
  POST as requestPasswordReset,
} from "@/app/api/auth/recuperar-contrasena/route";
import {
  POST as resetPassword,
} from "@/app/api/auth/restablecer-contrasena/route";
import { GET as verifyEmail } from "@/app/api/auth/verificar-correo/route";
import { prisma } from "@/lib/prisma";
import {
  createAccountToken,
  findAccountToken,
} from "@/lib/accountTokens";
import {
  isEmailConfigured,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/lib/email";

function request(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  (isEmailConfigured as jest.Mock).mockReturnValue(true);
  (prisma.$transaction as jest.Mock).mockImplementation(
    (callback: (transaction: typeof prisma) => unknown) => callback(prisma),
  );
});

test("registration creates a pending account and sends a verification link", async () => {
  (prisma.credencial.findFirst as jest.Mock).mockResolvedValue(null);
  (prisma.cliente.create as jest.Mock).mockResolvedValue({ id_cliente: 4 });
  (createAccountToken as jest.Mock).mockResolvedValue("verification-token");
  (sendVerificationEmail as jest.Mock).mockResolvedValue(undefined);

  const response = await register(
    request("http://localhost/api/registro", {
      nombre: "Ana",
      apellido: "Pérez",
      email: "ANA@correo.com",
      password: "clave123",
    }),
  );

  expect(response.status).toBe(202);
  expect(prisma.cliente.create).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        email: "ana@correo.com",
        credenciales: {
          create: expect.objectContaining({
            email: "ana@correo.com",
            password_hash: "hashed-password",
            activo: true,
          }),
        },
      }),
    }),
  );
  expect(sendVerificationEmail).toHaveBeenCalledWith(
    "ana@correo.com",
    "verification-token",
  );
});

test("registration rejects an already verified email", async () => {
  (prisma.credencial.findFirst as jest.Mock).mockResolvedValue({
    email_verificado_en: new Date(),
  });

  const response = await register(
    request("http://localhost/api/registro", {
      nombre: "Ana",
      apellido: "Pérez",
      email: "ana@correo.com",
      password: "clave123",
    }),
  );

  expect(response.status).toBe(409);
  expect(prisma.cliente.create).not.toHaveBeenCalled();
  expect(sendVerificationEmail).not.toHaveBeenCalled();
});

test("registration does not create an account when email delivery is unavailable", async () => {
  (prisma.credencial.findFirst as jest.Mock).mockResolvedValue(null);
  (isEmailConfigured as jest.Mock).mockReturnValue(false);

  const response = await register(
    request("http://localhost/api/registro", {
      nombre: "Ana",
      apellido: "Pérez",
      email: "ana@correo.com",
      password: "clave123",
    }),
  );

  expect(response.status).toBe(503);
  expect(prisma.cliente.create).not.toHaveBeenCalled();
  expect(sendVerificationEmail).not.toHaveBeenCalled();
});

test("password reset sends a one-time link only for verified accounts", async () => {
  (prisma.credencial.findFirst as jest.Mock).mockResolvedValue({
    email: "ana@correo.com",
  });
  (createAccountToken as jest.Mock).mockResolvedValue("reset-token");
  (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

  const response = await requestPasswordReset(
    request("http://localhost/api/auth/recuperar-contrasena", {
      email: " ANA@correo.com ",
    }),
  );

  expect(response.status).toBe(202);
  expect(prisma.credencial.findFirst).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        email: { equals: "ana@correo.com", mode: "insensitive" },
        email_verificado_en: { not: null },
      }),
    }),
  );
  expect(sendPasswordResetEmail).toHaveBeenCalledWith(
    "ana@correo.com",
    "reset-token",
  );
});

test("password reset returns a generic response for unknown addresses", async () => {
  (prisma.credencial.findFirst as jest.Mock).mockResolvedValue(null);

  const response = await requestPasswordReset(
    request("http://localhost/api/auth/recuperar-contrasena", {
      email: "no-registrado@correo.com",
    }),
  );

  expect(response.status).toBe(202);
  expect(sendPasswordResetEmail).not.toHaveBeenCalled();
});

test("password reset reports when the email service is not configured", async () => {
  (isEmailConfigured as jest.Mock).mockReturnValue(false);

  const response = await requestPasswordReset(
    request("http://localhost/api/auth/recuperar-contrasena", {
      email: "ana@correo.com",
    }),
  );

  expect(response.status).toBe(503);
  expect(prisma.credencial.findFirst).not.toHaveBeenCalled();
});

test("reset password rejects expired or invalid tokens", async () => {
  (findAccountToken as jest.Mock).mockResolvedValue(null);

  const response = await resetPassword(
    request("http://localhost/api/auth/restablecer-contrasena", {
      token: "invalid-token",
      password: "clave123",
    }),
  );

  expect(response.status).toBe(400);
  expect(prisma.$transaction).not.toHaveBeenCalled();
});

test("reset password updates credentials and consumes the recovery token", async () => {
  (findAccountToken as jest.Mock).mockResolvedValue({
    id_token: 8,
    email: "ana@correo.com",
    tipo: "RESET_PASSWORD",
    fecha_expiracion: new Date(Date.now() + 60_000),
  });
  const transaction = {
    tokenAutenticacion: {
      findUnique: jest.fn().mockResolvedValue({
        id_token: 8,
        email: "ana@correo.com",
        tipo: "RESET_PASSWORD",
        fecha_expiracion: new Date(Date.now() + 60_000),
      }),
      delete: jest.fn().mockResolvedValue({}),
    },
    credencial: {
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  };
  (prisma.$transaction as jest.Mock).mockImplementation(
    (callback: (value: typeof transaction) => unknown) => callback(transaction),
  );

  const response = await resetPassword(
    request("http://localhost/api/auth/restablecer-contrasena", {
      token: "valid-token",
      password: "nueva123",
    }),
  );

  expect(response.status).toBe(200);
  expect(transaction.credencial.updateMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        email: "ana@correo.com",
        activo: true,
        email_verificado_en: { not: null },
      },
      data: { password_hash: "hashed-password" },
    }),
  );
  expect(transaction.tokenAutenticacion.delete).toHaveBeenCalledWith({
    where: { id_token: 8 },
  });
});

test("email verification activates the account and consumes its token", async () => {
  (findAccountToken as jest.Mock).mockResolvedValue({
    id_token: 7,
    email: "ana@correo.com",
    tipo: "VERIFY_EMAIL",
    fecha_expiracion: new Date(Date.now() + 60_000),
  });
  (prisma.tokenAutenticacion.findUnique as jest.Mock).mockResolvedValue({
    id_token: 7,
    email: "ana@correo.com",
    tipo: "VERIFY_EMAIL",
    fecha_expiracion: new Date(Date.now() + 60_000),
  });
  (prisma.credencial.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
  (prisma.tokenAutenticacion.delete as jest.Mock).mockResolvedValue({});

  const response = await verifyEmail(
    new Request("http://localhost/api/auth/verificar-correo?token=valid"),
  );

  expect(response.status).toBe(307);
  expect(response.headers.get("location")).toContain(
    "/login?verificacion=exitosa",
  );
  expect(prisma.credencial.updateMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { email: "ana@correo.com" },
      data: expect.objectContaining({ email_verificado_en: expect.any(Date) }),
    }),
  );
  expect(prisma.tokenAutenticacion.delete).toHaveBeenCalledWith({
    where: { id_token: 7 },
  });
});
