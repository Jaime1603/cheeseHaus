/** @jest-environment node */
import { categoriaService } from "@/services/categoriaService";
import { categoriaRepository } from "@/repositories/categoriaRepository";

jest.mock("@/repositories/categoriaRepository", () => ({
    categoriaRepository: {
        getAllCategories: jest.fn(),
        getById: jest.fn(),
        getByName: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

beforeEach(() => jest.clearAllMocks());

// ── getAllCategories ──────────────────────────────────────────
describe("getAllCategories", () => {
    test("retorna lista de categorias correctamente", async () => {
        const mockCategorias = [
            { id_categoria: 1, nombre_categoria: "Tortas", descripcion: null },
            { id_categoria: 2, nombre_categoria: "Cheesecakes", descripcion: "Rico" },
        ];
        (categoriaRepository.getAllCategories as jest.Mock).mockResolvedValue(mockCategorias);

        const resultado = await categoriaService.getAllCategories();

        expect(resultado.exito).toBe(true);
        if (resultado.exito) {
            expect(resultado.datos).toHaveLength(2);
        }
    });
});

// ── getById ───────────────────────────────────────────────────
describe("getById", () => {
    test("retorna error 400 si el ID es NaN", async () => {
        const resultado = await categoriaService.getById(NaN);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) {
            expect(resultado.codigo).toBe(400);
        }
    });

    test("retorna error 404 si la categoria no existe", async () => {
        (categoriaRepository.getById as jest.Mock).mockResolvedValue(null);
        const resultado = await categoriaService.getById(99);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) {
            expect(resultado.codigo).toBe(404);
        }
    });

    test("retorna la categoria correctamente cuando existe", async () => {
        const mock = { id_categoria: 1, nombre_categoria: "Tortas", productos: [] };
        (categoriaRepository.getById as jest.Mock).mockResolvedValue(mock);
        const resultado = await categoriaService.getById(1);
        expect(resultado.exito).toBe(true);
    });
});

// ── create ────────────────────────────────────────────────────
describe("create", () => {
    test("retorna error si el nombre está vacío", async () => {
        const resultado = await categoriaService.create({ nombre_categoria: "" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error si el nombre tiene más de 30 caracteres", async () => {
        const resultado = await categoriaService.create({ nombre_categoria: "A".repeat(31) });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error si el nombre tiene menos de 3 caracteres", async () => {
        const resultado = await categoriaService.create({ nombre_categoria: "AB" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error si ya existe una categoria con ese nombre", async () => {
        (categoriaRepository.getByName as jest.Mock).mockResolvedValue({ id_categoria: 1 });
        const resultado = await categoriaService.create({ nombre_categoria: "Tortas" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("crea la categoria correctamente", async () => {
        (categoriaRepository.getByName as jest.Mock).mockResolvedValue(null);
        const mockCreada = { id_categoria: 3, nombre_categoria: "Brownies", descripcion: null };
        (categoriaRepository.create as jest.Mock).mockResolvedValue(mockCreada);

        const resultado = await categoriaService.create({ nombre_categoria: "Brownies" });
        expect(resultado.exito).toBe(true);
        if (resultado.exito) expect(resultado.datos).toEqual(mockCreada);
    });
});

// ── update ────────────────────────────────────────────────────
describe("update", () => {
    test("retorna error 400 si el ID es NaN", async () => {
        const resultado = await categoriaService.update(NaN, { nombre_categoria: "Tortas" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si el nombre está vacío", async () => {
        const resultado = await categoriaService.update(1, { nombre_categoria: "" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si el nombre tiene más de 30 caracteres en update", async () => {
        const resultado = await categoriaService.update(1, { nombre_categoria: "A".repeat(31) });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si el nombre tiene menos de 3 caracteres en update", async () => {
        const resultado = await categoriaService.update(1, { nombre_categoria: "AB" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 404 si la categoria no existe", async () => {
        (categoriaRepository.getById as jest.Mock).mockResolvedValue(null);
        const resultado = await categoriaService.update(99, { nombre_categoria: "Tortas" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(404);
    });

    test("retorna error 400 si el nombre ya lo usa otra categoria", async () => {
        (categoriaRepository.getById as jest.Mock).mockResolvedValue({ id_categoria: 1, productos: [] });
        (categoriaRepository.getByName as jest.Mock).mockResolvedValue({ id_categoria: 2 });

        const resultado = await categoriaService.update(1, { nombre_categoria: "Cheesecakes" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("actualiza correctamente cuando los datos son válidos", async () => {
        const mock = { id_categoria: 1, nombre_categoria: "Tortas Nuevas", descripcion: null };
        (categoriaRepository.getById as jest.Mock).mockResolvedValue({ id_categoria: 1, productos: [] });
        (categoriaRepository.getByName as jest.Mock).mockResolvedValue(null);
        (categoriaRepository.update as jest.Mock).mockResolvedValue(mock);

        const resultado = await categoriaService.update(1, { nombre_categoria: "Tortas Nuevas" });
        expect(resultado.exito).toBe(true);
    });
});

// ── delete ────────────────────────────────────────────────────
describe("delete", () => {
    test("retorna error 400 si el ID es NaN", async () => {
        const resultado = await categoriaService.delete(NaN);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 404 si la categoria no existe", async () => {
        (categoriaRepository.getById as jest.Mock).mockResolvedValue(null);
        const resultado = await categoriaService.delete(99);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(404);
    });

    test("retorna error 400 si la categoria tiene productos asociados", async () => {
        (categoriaRepository.getById as jest.Mock).mockResolvedValue({
            id_categoria: 1,
            productos: [{ id_producto: 1 }, { id_producto: 2 }],
        });
        const resultado = await categoriaService.delete(1);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("elimina la categoria correctamente cuando no tiene productos", async () => {
        (categoriaRepository.getById as jest.Mock).mockResolvedValue({
            id_categoria: 1,
            productos: [],
        });
        (categoriaRepository.delete as jest.Mock).mockResolvedValue(undefined);

        const resultado = await categoriaService.delete(1);
        expect(resultado.exito).toBe(true);
    });
});
