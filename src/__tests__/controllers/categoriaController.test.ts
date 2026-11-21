/** @jest-environment node */
import { GET, getById, POST, PUT, DELETE } from "@/controllers/categoriaController";
import { categoriaService } from "@/services/categoriaService";
import { auth } from "@/lib/auth";

jest.mock("@/services/categoriaService", () => ({
  categoriaService: {
    getAllCategories: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));

describe("categoriaController", () => {
  const adminSession = { user: { id: "1", email: "admin@test.com", rol: "ADMIN" } };
  const clientSession = { user: { id: "2", email: "client@test.com", rol: "CLIENTE" } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── GET ──
  describe("GET /api/admin/categorias", () => {
    test("retorna 401 si no hay sesión o no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const res = await GET();
      expect(res.status).toBe(401);

      (auth as jest.Mock).mockResolvedValue(clientSession);
      const res2 = await GET();
      expect(res2.status).toBe(401);
    });

    test("retorna lista de categorías con status 200", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (categoriaService.getAllCategories as jest.Mock).mockResolvedValue({
        exito: true,
        datos: [{ id_categoria: 1, nombre_categoria: "Tortas" }],
      });

      const res = await GET();
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body).toEqual([{ id_categoria: 1, nombre_categoria: "Tortas" }]);
    });

    test("retorna status de error si el servicio falla", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (categoriaService.getAllCategories as jest.Mock).mockResolvedValue({
        exito: false,
        error: "Error en base de datos",
        codigo: 500,
      });

      const res = await GET();
      expect(res.status).toBe(500);
    });

    test("retorna 500 ante una excepción no controlada", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const res = await GET();
      expect(res.status).toBe(500);
    });
  });

  // ── getById ──
  describe("getById /api/admin/categorias/[id]", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/categorias/1");
      const res = await getById(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(401);
    });

    test("retorna 200 con la categoría encontrada", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (categoriaService.getById as jest.Mock).mockResolvedValue({
        exito: true,
        datos: { id_categoria: 1, nombre_categoria: "Tortas" },
      });

      const req = new Request("http://localhost/api/admin/categorias/1");
      const res = await getById(req, { params: Promise.resolve({ id: "1" }) });
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body).toEqual({ id_categoria: 1, nombre_categoria: "Tortas" });
    });

    test("retorna error cuando el servicio falla (ej: 404)", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (categoriaService.getById as jest.Mock).mockResolvedValue({
        exito: false,
        error: "Categoria no encontrada",
        codigo: 404,
      });

      const req = new Request("http://localhost/api/admin/categorias/99");
      const res = await getById(req, { params: Promise.resolve({ id: "99" }) });
      expect(res.status).toBe(404);
    });

    test("retorna 500 ante una excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/admin/categorias/1");
      const res = await getById(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });

  // ── POST ──
  describe("POST /api/admin/categorias", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/categorias", {
        method: "POST",
        body: JSON.stringify({ nombre_categoria: "Postres" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    test("retorna 201 al crear exitosamente", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (categoriaService.create as jest.Mock).mockResolvedValue({
        exito: true,
        datos: { id_categoria: 2, nombre_categoria: "Postres" },
      });

      const req = new Request("http://localhost/api/admin/categorias", {
        method: "POST",
        body: JSON.stringify({ nombre_categoria: "Postres" }),
      });
      const res = await POST(req);
      const body = await res.json();
      expect(res.status).toBe(201);
      expect(body).toEqual({ id_categoria: 2, nombre_categoria: "Postres" });
    });

    test("retorna 400 si los datos son inválidos", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (categoriaService.create as jest.Mock).mockResolvedValue({
        exito: false,
        error: "El nombre es obligatorio",
        codigo: 400,
      });

      const req = new Request("http://localhost/api/admin/categorias", {
        method: "POST",
        body: JSON.stringify({ nombre_categoria: "" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    test("retorna 500 ante una excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/admin/categorias", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const res = await POST(req);
      expect(res.status).toBe(500);
    });
  });

  // ── PUT ──
  describe("PUT /api/admin/categorias/[id]", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/categorias/1", {
        method: "PUT",
        body: JSON.stringify({ nombre_categoria: "Actualizado" }),
      });
      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(401);
    });

    test("retorna 200 al actualizar exitosamente", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (categoriaService.update as jest.Mock).mockResolvedValue({
        exito: true,
        datos: { id_categoria: 1, nombre_categoria: "Actualizado" },
      });

      const req = new Request("http://localhost/api/admin/categorias/1", {
        method: "PUT",
        body: JSON.stringify({ nombre_categoria: "Actualizado" }),
      });
      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(200);
    });

    test("retorna código de error si el servicio falla", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (categoriaService.update as jest.Mock).mockResolvedValue({
        exito: false,
        error: "Ya existe una categoria con ese nombre",
        codigo: 400,
      });

      const req = new Request("http://localhost/api/admin/categorias/1", {
        method: "PUT",
        body: JSON.stringify({ nombre_categoria: "Duplicado" }),
      });
      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(400);
    });

    test("retorna 500 ante una excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/admin/categorias/1", {
        method: "PUT",
        body: JSON.stringify({}),
      });
      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });

  // ── DELETE ──
  describe("DELETE /api/admin/categorias/[id]", () => {
    test("retorna 401 si no es admin", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/admin/categorias/1", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(401);
    });

    test("retorna 200 al eliminar exitosamente", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (categoriaService.delete as jest.Mock).mockResolvedValue({
        exito: true,
        datos: { message: "Categoria eliminada correctamente" },
      });

      const req = new Request("http://localhost/api/admin/categorias/1", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(200);
    });

    test("retorna código de error si el servicio falla", async () => {
      (auth as jest.Mock).mockResolvedValue(adminSession);
      (categoriaService.delete as jest.Mock).mockResolvedValue({
        exito: false,
        error: "Categoria no encontrada",
        codigo: 404,
      });

      const req = new Request("http://localhost/api/admin/categorias/99", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "99" }) });
      expect(res.status).toBe(404);
    });

    test("retorna 500 ante una excepción", async () => {
      (auth as jest.Mock).mockRejectedValue(new Error("Crash"));
      const req = new Request("http://localhost/api/admin/categorias/1", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });
});
