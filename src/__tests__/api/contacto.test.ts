/** @jest-environment node */
import { POST } from "@/app/api/contacto/route";

function createRequest(body: unknown) {
  return new Request("http://localhost/api/contacto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("devuelve un enlace de WhatsApp con el mensaje preparado", async () => {
  const response = await POST(
    createRequest({
      nombres: "Ana",
      apellidos: "Pérez",
      email: "ana@correo.com",
      mensaje: "Quiero conocer los sabores disponibles",
    }),
  );
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.whatsappUrl).toContain("https://wa.me/573128076425?text=");
  expect(decodeURIComponent(data.whatsappUrl)).toContain("ana@correo.com");
});

test("rechaza mensajes incompletos y correos inválidos", async () => {
  const incompleto = await POST(createRequest({}));
  const correoInvalido = await POST(
    createRequest({
      nombres: "Ana",
      apellidos: "Pérez",
      email: "correo-invalido",
      mensaje: "Hola",
    }),
  );

  expect(incompleto.status).toBe(400);
  expect(correoInvalido.status).toBe(400);
});
