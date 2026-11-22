/** @jest-environment node */
jest.mock("@/lib/prisma", () => ({
  prisma: {
    credencial: { findFirst: jest.fn() },
    cliente: { create: jest.fn() },
  },
}));

import { POST } from "@/app/api/registro/route";
import { prisma } from "@/lib/prisma";

function createRequest(body: unknown) {
  return new Request("http://localhost/api/registro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => jest.clearAllMocks());

test("rechaza correos inválidos sin consultar la base de datos", async () => {
  const response = await POST(
    createRequest({
      nombre: "Ana",
      apellido: "Pérez",
      email: "correo-invalido",
      password: "clave123",
    }),
  );
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data.error).toBe("Ingresa un correo electrónico válido");
  expect(prisma.credencial.findFirst).not.toHaveBeenCalled();
});

test("requiere campos completos y contraseñas de al menos seis caracteres", async () => {
  const camposVacios = await POST(createRequest({}));
  const passwordCorta = await POST(
    createRequest({
      nombre: "Ana",
      apellido: "Pérez",
      email: "ana@correo.com",
      password: "123",
    }),
  );

  expect(camposVacios.status).toBe(400);
  expect(passwordCorta.status).toBe(400);
  expect(prisma.credencial.findFirst).not.toHaveBeenCalled();
});
