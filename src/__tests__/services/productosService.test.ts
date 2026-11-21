/** @jest-environment node */
import { productoService } from "@/services/productosService";
import { productoRepository } from "@/repositories/productosRepository";

jest.mock("@/repositories/productosRepository", () => ({
    productoRepository: {
        getAllProductos: jest.fn(),
        getActivos: jest.fn(),
        getByCategory: jest.fn(),
        getById: jest.fn(),
        getByName: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

beforeEach(() => jest.clearAllMocks());

const bodyValido = {
    nombre_producto: "Cheesecake de fresa",
    descripcion: "Delicioso cheesecake",
    precio: 25000,
    ingredientes: "Queso crema, fresa, azucar",
    imagen_url: "https://img.com/cheesecake.png",
    tamaño: "Grande",
    activo: true,
    id_categoria: 1,
};

// ── getAllProductos ───────────────────────────────────────────
describe("getAllProductos", () => {
    test("retorna todos los productos", async () => {
        (productoRepository.getAllProductos as jest.Mock).mockResolvedValue([bodyValido]);
        const resultado = await productoService.getAllProductos();
        expect(resultado.exito).toBe(true);
        if (resultado.exito) expect(resultado.datos).toHaveLength(1);
    });
});

// ── getActivos ───────────────────────────────────────────────
describe("getActivos", () => {
    test("retorna solo los productos activos", async () => {
        (productoRepository.getActivos as jest.Mock).mockResolvedValue([bodyValido]);
        const resultado = await productoService.getActivos();
        expect(resultado.exito).toBe(true);
    });
});

// ── getByCategory ────────────────────────────────────────────
describe("getByCategory", () => {
    test("retorna error 400 si el ID de categoría es NaN", async () => {
        const resultado = await productoService.getByCategory(NaN);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error si no hay productos en la categoria", async () => {
        (productoRepository.getByCategory as jest.Mock).mockResolvedValue([]);
        const resultado = await productoService.getByCategory(1);
        expect(resultado.exito).toBe(false);
    });

    test("retorna productos de la categoria correctamente", async () => {
        (productoRepository.getByCategory as jest.Mock).mockResolvedValue([bodyValido]);
        const resultado = await productoService.getByCategory(1);
        expect(resultado.exito).toBe(true);
    });
});

// ── getById ───────────────────────────────────────────────────
describe("getById", () => {
    test("retorna error 400 si el ID es NaN", async () => {
        const resultado = await productoService.getById(NaN);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 404 si el producto no existe", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue(null);
        const resultado = await productoService.getById(99);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(404);
    });

    test("retorna el producto correctamente", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue(bodyValido);
        const resultado = await productoService.getById(1);
        expect(resultado.exito).toBe(true);
    });
});

// ── create ────────────────────────────────────────────────────
describe("create", () => {
    test("retorna error 400 si el nombre está vacío", async () => {
        const resultado = await productoService.create({ ...bodyValido, nombre_producto: "" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si el nombre tiene menos de 5 caracteres", async () => {
        const resultado = await productoService.create({ ...bodyValido, nombre_producto: "Cake" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si el nombre tiene más de 50 caracteres", async () => {
        const resultado = await productoService.create({ ...bodyValido, nombre_producto: "A".repeat(51) });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si la descripción está vacía", async () => {
        const resultado = await productoService.create({ ...bodyValido, descripcion: "" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si el precio es 0 o negativo", async () => {
        const resultado = await productoService.create({ ...bodyValido, precio: 0 });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si el precio no es un número válido (ej: 'abc')", async () => {
        const resultado = await productoService.create({ ...bodyValido, precio: "abc" as unknown as number });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) {
            expect(resultado.codigo).toBe(400);
            expect(resultado.error).toBe("El precio es obligatorio y debe ser un numero mayor a 0");
        }
    });

    test("retorna error 400 si los ingredientes están vacíos", async () => {
        const resultado = await productoService.create({ ...bodyValido, ingredientes: "" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si falta el id_categoria", async () => {
        const resultado = await productoService.create({ ...bodyValido, id_categoria: 0 });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si la imagen_url está vacía", async () => {
        const resultado = await productoService.create({ ...bodyValido, imagen_url: "" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si la URL de imagen no es válida", async () => {
        const resultado = await productoService.create({ ...bodyValido, imagen_url: "no-es-url" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si ya existe un producto con ese nombre", async () => {
        (productoRepository.getByName as jest.Mock).mockResolvedValue({ id_producto: 5 });
        const resultado = await productoService.create(bodyValido);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("crea el producto correctamente cuando los datos son válidos", async () => {
        (productoRepository.getByName as jest.Mock).mockResolvedValue(null);
        (productoRepository.create as jest.Mock).mockResolvedValue({ id_producto: 10, ...bodyValido });

        const resultado = await productoService.create(bodyValido);
        expect(resultado.exito).toBe(true);
        if (resultado.exito) expect(resultado.datos).toHaveProperty("id_producto", 10);
    });

    test("crea el producto con activo en false y tamaño/imagen opcionales", async () => {
        (productoRepository.getByName as jest.Mock).mockResolvedValue(null);
        const productoSinActivo = {
            ...bodyValido,
            activo: undefined as unknown as boolean,
            tamaño: undefined as unknown as string,
        };
        (productoRepository.create as jest.Mock).mockResolvedValue({ id_producto: 11, ...productoSinActivo, activo: true });

        const resultado = await productoService.create(productoSinActivo);
        expect(resultado.exito).toBe(true);
        expect(productoRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ activo: true })
        );
    });
});

// ── update ────────────────────────────────────────────────────
describe("update", () => {
    test("retorna error 400 si el ID es NaN", async () => {
        const resultado = await productoService.update(NaN, { nombre_producto: "Nuevo" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 404 si el producto no existe", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue(null);
        const resultado = await productoService.update(99, { nombre_producto: "Nuevo" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(404);
    });

    test("retorna error 400 si el nombre está vacío", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue(bodyValido);
        const resultado = await productoService.update(1, { nombre_producto: "" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si no se envía ningún campo para actualizar", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue(bodyValido);
        const resultado = await productoService.update(1, {});
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 409 si el nuevo nombre ya lo usa otro producto", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue({ ...bodyValido, id_producto: 1 });
        (productoRepository.getByName as jest.Mock).mockResolvedValue({ id_producto: 2 });
        const resultado = await productoService.update(1, { nombre_producto: "Otro producto" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(409);
    });

    test("retorna error 400 si el precio es 0 o negativo", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue(bodyValido);
        const resultado = await productoService.update(1, { precio: -100 });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si la URL de imagen no es válida", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue(bodyValido);
        const resultado = await productoService.update(1, { imagen_url: "no-es-url" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si el nombre tiene más de 50 caracteres en update", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue({ ...bodyValido, id_producto: 1 });
        const resultado = await productoService.update(1, { nombre_producto: "A".repeat(51) });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si el id_categoria es 0 o negativo en update", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue({ ...bodyValido, id_producto: 1 });
        const resultado = await productoService.update(1, { id_categoria: 0 });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("actualiza correctamente todos los campos opcionales a la vez", async () => {
        const productoActualizado = { ...bodyValido, id_producto: 1, descripcion: "Nueva desc", ingredientes: "Nuevos", tamaño: "Mediano", activo: false, id_categoria: 2 };
        (productoRepository.getById as jest.Mock).mockResolvedValue({ ...bodyValido, id_producto: 1 });
        (productoRepository.getByName as jest.Mock).mockResolvedValue(null);
        (productoRepository.update as jest.Mock).mockResolvedValue(productoActualizado);

        const resultado = await productoService.update(1, {
            descripcion: "Nueva desc",
            ingredientes: "Nuevos",
            tamaño: "Mediano",
            activo: false,
            id_categoria: 2,
            precio: 30000,
            imagen_url: "https://img.com/nueva.png",
        });
        expect(resultado.exito).toBe(true);
    });

    test("retorna error 500 si el repositorio no devuelve el producto actualizado", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue({ ...bodyValido, id_producto: 1 });
        (productoRepository.getByName as jest.Mock).mockResolvedValue(null);
        (productoRepository.update as jest.Mock).mockResolvedValue(null);

        const resultado = await productoService.update(1, { precio: 30000 });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(500);
    });

    test("actualiza el tamaño a vacío para que se guarde como null", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue({ ...bodyValido, id_producto: 1 });
        (productoRepository.getByName as jest.Mock).mockResolvedValue(null);
        (productoRepository.update as jest.Mock).mockResolvedValue({ ...bodyValido, id_producto: 1, tamaño: null });

        const resultado = await productoService.update(1, { tamaño: "   " });
        expect(resultado.exito).toBe(true);
        expect(productoRepository.update).toHaveBeenCalledWith(
            1,
            expect.objectContaining({ tamaño: null })
        );
    });

    test("actualiza el producto correctamente", async () => {
        const productoActualizado = { ...bodyValido, id_producto: 1, nombre_producto: "Nuevo Cheesecake" };
        (productoRepository.getById as jest.Mock).mockResolvedValue({ ...bodyValido, id_producto: 1 });
        (productoRepository.getByName as jest.Mock).mockResolvedValue(null);
        (productoRepository.update as jest.Mock).mockResolvedValue(productoActualizado);

        const resultado = await productoService.update(1, { nombre_producto: "Nuevo Cheesecake" });
        expect(resultado.exito).toBe(true);
    });
});

// ── delete ────────────────────────────────────────────────────
describe("delete", () => {
    test("retorna error 400 si el ID es NaN", async () => {
        const resultado = await productoService.delete(NaN);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 404 si el producto no existe", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue(null);
        const resultado = await productoService.delete(99);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(404);
    });

    test("elimina el producto correctamente", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue(bodyValido);
        (productoRepository.delete as jest.Mock).mockResolvedValue(undefined);

        const resultado = await productoService.delete(1);
        expect(resultado.exito).toBe(true);
        if (resultado.exito) expect(resultado.datos.message).toBe("Producto eliminado correctamente");
    });
});
