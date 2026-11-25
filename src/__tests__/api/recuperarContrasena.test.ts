/** @jest-environment node */
jest.mock("@/lib/email", () => ({
  isEmailConfigured: jest.fn().mockReturnValue(false),
  sendPasswordResetEmail: jest.fn(),
}));

import { POST } from "@/app/api/auth/recuperar-contrasena/route";

function createRequest(email: unknown) {
  return new Request("http://localhost/api/auth/recuperar-contrasena", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

test("informa cuando el servicio de correo no está configurado", async () => {
  const response = await POST(createRequest("no-registrado@correo.com"));
  const data = await response.json();

  expect(response.status).toBe(503);
  expect(data.error).toContain("El servicio de correo no está configurado");
});

test("rechaza un correo inválido", async () => {
  const response = await POST(createRequest("correo-invalido"));

  expect(response.status).toBe(400);
});
