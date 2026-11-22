/** @jest-environment node */
import { POST } from "@/app/api/auth/recuperar-contrasena/route";

function createRequest(email: unknown) {
  return new Request("http://localhost/api/auth/recuperar-contrasena", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

test("simula la solicitud sin revelar si el correo está registrado", async () => {
  const response = await POST(createRequest("no-registrado@correo.com"));
  const data = await response.json();

  expect(response.status).toBe(202);
  expect(data.message).toContain("El envío de correos aún no está configurado");
});

test("rechaza un correo inválido", async () => {
  const response = await POST(createRequest("correo-invalido"));

  expect(response.status).toBe(400);
});
