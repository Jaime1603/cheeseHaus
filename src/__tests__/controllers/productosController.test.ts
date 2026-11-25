/** @jest-environment node */
import {
  GET,
  POST,
  getById,
  getByIdAdmin,
  getByCategory,
  PUT,
  DELETE,
} from "@/controllers/productosController";
import { productoService } from "@/services/productosService";
import { auth } from "@/lib/auth";

jest.mock("@/services/productosService", () => ({
  productoService: {
    getAllProductos: jest.fn(),
    getByCategory: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));

describe("productosController", () => {
  const adminSession = { user: { id: "1", email: "admin@test.com", rol: "ADMIN" } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── GET /api/admin/productos ──
  describe("GET /api/admin/productos", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/productos");
      const res = await GET(req);
      expect(res.status).toBe(401);
    });

    test("retorna todos los productos sin filtro de categoría", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (productoService.getAllProductos as jest.Mock).mockResolvedValue({
        exito: true,
        datos: [{ id_producto: 1, nombre_producto: "Cheesecake" }],
      });

      const req = new Request("http://localhost/api/admin/productos");
      const res = await GET(req);
      expect(res.status).toBe(200);
    });

    test("retorna productos filtrados por categoría", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (productoService.getByCategory as jest.Mock).mockResolvedValue({
        exito: true,
        datos: [{ id_producto: 1, id_categoria: 2 }],
      });

      const req = new Request("http://localhost/api/admin/productos?categoria=2");
      const res = await GET(req);
      expect(res.status).toBe(200);
      expect(productoService.getByCategory).toHaveBeenCalledWith(2);
    });

    test("retorna código de error si filtrar por categoría falla", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (productoService.getByCategory as jest.Mock).mockResolvedValue({
        exito: false,
        error: "No hay productos",
        codigo: 400,
      });

      const req = new Request("http://localhost/api/admin/productos?categoria=99");
      const res = await GET(req);
      expect(res.status).toBe(400);
    });
  });

  // ── POST /api/admin/productos ──
  describe("POST /api/admin/productos", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/productos", { method: "POST" });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    test("retorna 201 al crear producto exitosamente", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (productoService.create as jest.Mock).mockResolvedValue({
        exito: true,
        datos: { id_producto: 5, nombre_producto: "Nuevo" },
      });

      const req = new Request("http://localhost/api/admin/productos", {
        method: "POST",
        body: JSON.stringify({ nombre_producto: "Nuevo" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(201);
    });

    test("retorna código de error si la creación falla", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (productoService.create as jest.Mock).mockResolvedValue({
        exito: false,
        error: "Nombre obligatorio",
        codigo: 400,
      });

      const req = new Request("http://localhost/api/admin/productos", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    test("retorna 500 ante una excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/admin/productos", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const res = await POST(req);
      expect(res.status).toBe(500);
    });
  });

  // ── getById público ──
  describe("getById /api/productos/[id]", () => {
    test("retorna 200 con el producto", async () => {
      (productoService.getById as jest.Mock).mockResolvedValue({
        exito: true,
        datos: { id_producto: 1 },
      });

      const req = new Request("http://localhost/api/productos/1");
      const res = await getById(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(200);
    });

    test("retorna 404 si no existe", async () => {
      (productoService.getById as jest.Mock).mockResolvedValue({
        exito: false,
        error: "Producto no encontrado",
        codigo: 404,
      });

      const req = new Request("http://localhost/api/productos/99");
      const res = await getById(req, { params: Promise.resolve({ id: "99" }) });
      expect(res.status).toBe(404);
    });

    test("retorna 500 ante excepción", async () => {
      (productoService.getById as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/productos/1");
      const res = await getById(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });

  // ── getByIdAdmin ──
  describe("getByIdAdmin /api/admin/productos/[id]", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/productos/1");
      const res = await getByIdAdmin(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(401);
    });

    test("retorna 200 delegando a getById si es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (productoService.getById as jest.Mock).mockResolvedValue({
        exito: true,
        datos: { id_producto: 1 },
      });

      const req = new Request("http://localhost/api/admin/productos/1");
      const res = await getByIdAdmin(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(200);
    });

    test("retorna 500 si auth falla con excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/admin/productos/1");
      const res = await getByIdAdmin(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });

  // ── getByCategory ──
  describe("getByCategory /api/admin/productos/categoria/[id]", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/productos/categoria?id_categoria=1");
      const res = await getByCategory(req);
      expect(res.status).toBe(401);
    });

    test("retorna 400 si falta el parámetro id_categoria", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      const req = new Request("http://localhost/api/admin/productos/categoria");
      const res = await getByCategory(req);
      expect(res.status).toBe(400);
    });

    test("retorna 200 con los productos de la categoría", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (productoService.getByCategory as jest.Mock).mockResolvedValue({
        exito: true,
        datos: [{ id_producto: 1 }],
      });

      const req = new Request("http://localhost/api/admin/productos/categoria?id_categoria=2");
      const res = await getByCategory(req);
      expect(res.status).toBe(200);
    });

    test("retorna código de error si el servicio falla", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (productoService.getByCategory as jest.Mock).mockResolvedValue({
        exito: false,
        error: "No hay productos",
        codigo: 400,
      });

      const req = new Request("http://localhost/api/admin/productos/categoria?id_categoria=2");
      const res = await getByCategory(req);
      expect(res.status).toBe(400);
    });

    test("retorna 500 ante una excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/admin/productos/categoria?id_categoria=1");
      const res = await getByCategory(req);
      expect(res.status).toBe(500);
    });
  });

  // ── PUT ──
  describe("PUT /api/admin/productos/[id]", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/productos/1", { method: "PUT" });
      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(401);
    });

    test("retorna 200 al actualizar correctamente", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (productoService.update as jest.Mock).mockResolvedValue({
        exito: true,
        datos: { id_producto: 1, nombre_producto: "Nuevo" },
      });

      const req = new Request("http://localhost/api/admin/productos/1", {
        method: "PUT",
        body: JSON.stringify({ nombre_producto: "Nuevo" }),
      });
      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(200);
    });

    test("retorna error si falla el update", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (productoService.update as jest.Mock).mockResolvedValue({
        exito: false,
        error: "Producto no encontrado",
        codigo: 404,
      });

      const req = new Request("http://localhost/api/admin/productos/99", {
        method: "PUT",
        body: JSON.stringify({ nombre_producto: "Nuevo" }),
      });
      const res = await PUT(req, { params: Promise.resolve({ id: "99" }) });
      expect(res.status).toBe(404);
    });

    test("retorna 500 ante excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/admin/productos/1", {
        method: "PUT",
        body: JSON.stringify({}),
      });
      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });

  // ── DELETE ──
  describe("DELETE /api/admin/productos/[id]", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/productos/1", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(401);
    });

    test("retorna 200 al eliminar exitosamente", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (productoService.delete as jest.Mock).mockResolvedValue({
        exito: true,
        datos: { message: "Producto eliminado correctamente" },
      });

      const req = new Request("http://localhost/api/admin/productos/1", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(200);
    });

    test("retorna error si delete falla", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (productoService.delete as jest.Mock).mockResolvedValue({
        exito: false,
        error: "Producto no encontrado",
        codigo: 404,
      });

      const req = new Request("http://localhost/api/admin/productos/99", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "99" }) });
      expect(res.status).toBe(404);
    });

    test("retorna 500 ante excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/admin/productos/1", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });
});
