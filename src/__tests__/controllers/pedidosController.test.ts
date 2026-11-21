/** @jest-environment node */
import {
  getAllPedidos,
  getPedidosById,
  PUT,
  POST,
  DELETE,
} from "@/controllers/pedidosController";
import { pedidosService } from "@/services/pedidosService";
import { auth } from "@/lib/auth";

jest.mock("@/services/pedidosService", () => ({
  pedidosService: {
    getPedidos: jest.fn(),
    getPedidosByClienteId: jest.fn(),
    getPedidoById: jest.fn(),
    updateEstado: jest.fn(),
    create: jest.fn(),
    deletePedido: jest.fn(),
  },
}));

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));

describe("pedidosController", () => {
  const adminSession = { user: { id: "1", email: "admin@test.com", rol: "ADMIN" } };
  const clientSession = { user: { id: "3", email: "client@test.com", rol: "CLIENTE" } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── getAllPedidos ──
  describe("getAllPedidos /api/admin/pedidos", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/pedidos");
      const res = await getAllPedidos(req);
      expect(res.status).toBe(401);
    });

    test("retorna todos los pedidos sin filtro", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (pedidosService.getPedidos as jest.Mock).mockResolvedValue({
        exito: true,
        datos: [{ id_pedido: 1 }],
      });

      const req = new Request("http://localhost/api/admin/pedidos");
      const res = await getAllPedidos(req);
      expect(res.status).toBe(200);
    });

    test("retorna pedidos filtrados por cliente", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (pedidosService.getPedidosByClienteId as jest.Mock).mockResolvedValue({
        exito: true,
        datos: [{ id_pedido: 1, id_cliente: 3 }],
      });

      const req = new Request("http://localhost/api/admin/pedidos?cliente=3");
      const res = await getAllPedidos(req);
      expect(res.status).toBe(200);
      expect(pedidosService.getPedidosByClienteId).toHaveBeenCalledWith(3);
    });

    test("retorna error si el filtro por cliente falla", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (pedidosService.getPedidosByClienteId as jest.Mock).mockResolvedValue({
        exito: false,
        error: "Cliente invalido",
        codigo: 400,
      });

      const req = new Request("http://localhost/api/admin/pedidos?cliente=abc");
      const res = await getAllPedidos(req);
      expect(res.status).toBe(400);
    });

    test("retorna 500 ante excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/admin/pedidos");
      const res = await getAllPedidos(req);
      expect(res.status).toBe(500);
    });
  });

  // ── getPedidosById ──
  describe("getPedidosById /api/admin/pedidos/[id]", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/pedidos/1");
      const res = await getPedidosById(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(401);
    });

    test("retorna 200 con el pedido encontrado", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (pedidosService.getPedidoById as jest.Mock).mockResolvedValue({
        exito: true,
        datos: { id_pedido: 1 },
      });

      const req = new Request("http://localhost/api/admin/pedidos/1");
      const res = await getPedidosById(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(200);
    });

    test("retorna código de error si el pedido no existe", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (pedidosService.getPedidoById as jest.Mock).mockResolvedValue({
        exito: false,
        error: "Pedido no encontrado",
        codigo: 404,
      });

      const req = new Request("http://localhost/api/admin/pedidos/99");
      const res = await getPedidosById(req, { params: Promise.resolve({ id: "99" }) });
      expect(res.status).toBe(404);
    });

    test("retorna 500 ante excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/admin/pedidos/1");
      const res = await getPedidosById(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });

  // ── PUT ──
  describe("PUT /api/admin/pedidos/[id]", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/pedidos/1", { method: "PUT" });
      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(401);
    });

    test("retorna 200 al actualizar estado exitosamente", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (pedidosService.updateEstado as jest.Mock).mockResolvedValue({
        exito: true,
        datos: { id_pedido: 1, estado: "Entregado" },
      });

      const req = new Request("http://localhost/api/admin/pedidos/1", {
        method: "PUT",
        body: JSON.stringify({ estado: "Entregado" }),
      });
      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(200);
    });

    test("retorna código de error si el servicio falla (ej: 409)", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (pedidosService.updateEstado as jest.Mock).mockResolvedValue({
        exito: false,
        error: "No se puede cambiar el estado",
        codigo: 409,
      });

      const req = new Request("http://localhost/api/admin/pedidos/1", {
        method: "PUT",
        body: JSON.stringify({ estado: "Cancelado" }),
      });
      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(409);
    });

    test("retorna 500 ante excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/admin/pedidos/1", {
        method: "PUT",
        body: JSON.stringify({}),
      });
      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });

  // ── POST /api/pedidos/cliente ──
  describe("POST /api/pedidos/cliente", () => {
    test("retorna 401 si no hay sesión activa", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/pedidos/cliente", { method: "POST" });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    test("crea el pedido con status 201 usando el id_cliente de la sesión", async () => {
      (auth as jest.Mock).mockResolvedValue(clientSession);
      (pedidosService.create as jest.Mock).mockResolvedValue({
        exito: true,
        datos: { id_pedido: 10 },
      });

      const bodyData = {
        direccion: "Calle 10",
        barrio: "San Antonio",
        telefono: "3101234567",
        fecha_entrega: "2026-12-01",
        metodoPago: "Efectivo",
        items: [{ id_producto: 1, cantidad: 1, tamaño: "Grande", precio_unitario: 20000 }],
      };

      const req = new Request("http://localhost/api/pedidos/cliente", {
        method: "POST",
        body: JSON.stringify(bodyData),
      });
      const res = await POST(req);
      expect(res.status).toBe(201);
      expect(pedidosService.create).toHaveBeenCalledWith(
        expect.objectContaining({ id_cliente: 3 })
      );
    });

    test("retorna código de error si el servicio de pedidos falla", async () => {
      (auth as jest.Mock).mockResolvedValue(clientSession);
      (pedidosService.create as jest.Mock).mockResolvedValue({
        exito: false,
        error: "Dirección obligatoria",
        codigo: 400,
      });

      const req = new Request("http://localhost/api/pedidos/cliente", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    test("retorna 500 ante excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/pedidos/cliente", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const res = await POST(req);
      expect(res.status).toBe(500);
    });
  });

  // ── DELETE ──
  describe("DELETE /api/admin/pedidos/[id]", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/pedidos/1", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(401);
    });

    test("retorna 200 al eliminar exitosamente", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (pedidosService.deletePedido as jest.Mock).mockResolvedValue({
        exito: true,
        datos: { message: "Pedido eliminado correctamente" },
      });

      const req = new Request("http://localhost/api/admin/pedidos/1", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(200);
    });

    test("retorna código de error si delete falla", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (pedidosService.deletePedido as jest.Mock).mockResolvedValue({
        exito: false,
        error: "Pedido no encontrado",
        codigo: 404,
      });

      const req = new Request("http://localhost/api/admin/pedidos/99", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "99" }) });
      expect(res.status).toBe(404);
    });

    test("retorna 500 ante excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/admin/pedidos/1", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });
});
