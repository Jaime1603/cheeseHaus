/** @jest-environment node */
jest.mock("nodemailer", () => ({
  __esModule: true,
  default: { createTransport: jest.fn() },
}));

import nodemailer from "nodemailer";
import {
  isEmailConfigured,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/lib/email";

const originalEnv = { ...process.env };

beforeEach(() => {
  jest.clearAllMocks();
  process.env.SMTP_HOST = "smtp.example.test";
  process.env.SMTP_PORT = "587";
  process.env.SMTP_USER = "sender@example.test";
  process.env.SMTP_PASSWORD = "not-a-real-password";
  process.env.EMAIL_FROM = "CheeseHaus <sender@example.test>";
  process.env.NEXTAUTH_URL = "http://localhost:3000/";
  (nodemailer.createTransport as jest.Mock).mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(undefined),
  });
});

afterAll(() => {
  process.env = originalEnv;
});

test("email configuration requires SMTP credentials and a site URL", () => {
  expect(isEmailConfigured()).toBe(true);
  delete process.env.SMTP_PASSWORD;
  expect(isEmailConfigured()).toBe(false);
});

test("verification email contains a link with the one-time token", async () => {
  await sendVerificationEmail("ana@example.test", "verify-token");

  const transport = (nodemailer.createTransport as jest.Mock).mock.results[0]
    .value;
  expect(transport.sendMail).toHaveBeenCalledWith(
    expect.objectContaining({
      to: "ana@example.test",
      subject: "Verifica tu correo de CheeseHaus",
      text: expect.stringContaining(
        "http://localhost:3000/api/auth/verificar-correo?token=verify-token",
      ),
    }),
  );
});

test("password recovery email links to the password reset form", async () => {
  await sendPasswordResetEmail("ana@example.test", "reset-token");

  const transport = (nodemailer.createTransport as jest.Mock).mock.results[0]
    .value;
  expect(transport.sendMail).toHaveBeenCalledWith(
    expect.objectContaining({
      to: "ana@example.test",
      subject: "Recupera tu contraseña de CheeseHaus",
      text: expect.stringContaining(
        "http://localhost:3000/restablecer-contrasena?token=reset-token",
      ),
    }),
  );
});
