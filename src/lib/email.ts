import nodemailer from "nodemailer";

const EMAIL_CONFIGURATION_ERROR = "Email service configuration is incomplete";

function getEmailConfiguration() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.EMAIL_FROM;

  if (
    !host ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !user ||
    !password ||
    !from
  ) {
    throw new Error(EMAIL_CONFIGURATION_ERROR);
  }

  return { host, port, user, password, from };
}

export function getAppBaseUrl() {
  const configuredUrl = process.env.NEXTAUTH_URL ?? process.env.AUTH_URL;
  if (!configuredUrl) {
    throw new Error("NEXTAUTH_URL or AUTH_URL must be configured");
  }

  return configuredUrl.replace(/\/+$/, "");
}

export function isEmailConfigured() {
  try {
    getEmailConfiguration();
    getAppBaseUrl();
    return true;
  } catch {
    return false;
  }
}

async function sendAccountLink(
  email: string,
  subject: string,
  heading: string,
  description: string,
  path: string,
  token: string,
) {
  const config = getEmailConfiguration();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.password },
  });
  const link = `${getAppBaseUrl()}${path}?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: config.from,
    to: email,
    subject,
    text: `${heading}\n\n${description}\n\n${link}\n\nSi no solicitaste este mensaje, puedes ignorarlo.`,
    html: `<h1>${heading}</h1><p>${description}</p><p><a href="${link}">Continuar</a></p><p>Si no solicitaste este mensaje, puedes ignorarlo.</p>`,
  });
}

export function sendVerificationEmail(email: string, token: string) {
  return sendAccountLink(
    email,
    "Verifica tu correo de CheeseHaus",
    "Confirma tu correo electrónico",
    "Para activar tu cuenta de CheeseHaus, verifica que este correo te pertenece.",
    "/api/auth/verificar-correo",
    token,
  );
}

export function sendPasswordResetEmail(email: string, token: string) {
  return sendAccountLink(
    email,
    "Recupera tu contraseña de CheeseHaus",
    "Restablece tu contraseña",
    "Usa este enlace para crear una contraseña nueva. El enlace vence en una hora.",
    "/restablecer-contrasena",
    token,
  );
}
