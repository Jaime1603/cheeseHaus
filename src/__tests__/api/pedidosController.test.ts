/** @jest-environment node */
jest.mock("@/lib/auth", () => ({ auth: jest.fn() }));
jest.mock("@/services/pedidosService", () => ({
  pedidosService: { create: jest.fn() },
}));

import { POST } from "@/controllers/pedidosController";
import { auth } from "@/lib/auth";
import { pedidosService } from "@/services/pedidosService";

function createRequest(body: unknown) {
  return new Request("http://localhost/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => jest.clearAllMocks());

test("assigns the order to the authenticated customer instead of the request body", async () => {
  (auth as jest.Mock).mockResolvedValue({
    user: { id: "12", rol: "Cliente" },
  });
  (pedidosService.create as jest.Mock).mockResolvedValue({
    exito: true,
    datos: { id_pedido: 31, id_cliente: 12 },
  });

  const response = await POST(
    createRequest({
      id_cliente: 999,
      direccion: "Calle 1 #2-3",
      barrio: "Centro",
      ciudad: "Cali",
      telefono: "3001234567",
      fecha_entrega: "2099-12-30",
      metodoPago: "Contra entrega",
      items: [],
    }),
  );

  expect(response.status).toBe(201);
  expect(pedidosService.create).toHaveBeenCalledWith(
    expect.objectContaining({ id_cliente: 12 }),
  );
  expect(pedidosService.create).toHaveBeenCalledWith(
    expect.not.objectContaining({ id_cliente: 999 }),
  );
});

test("rejects orders without a valid authenticated customer", async () => {
  (auth as jest.Mock).mockResolvedValue({ user: { id: "" } });

  const response = await POST(createRequest({}));

  expect(response.status).toBe(401);
  expect(pedidosService.create).not.toHaveBeenCalled();
});
