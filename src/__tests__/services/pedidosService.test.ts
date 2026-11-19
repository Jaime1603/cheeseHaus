/** @jest-environment node */
import { pedidosService } from "@/services/pedidosService";
import { pedidosRepository } from "@/repositories/pedidosRepository";
import { productoRepository } from "@/repositories/productosRepository";

jest.mock("@/repositories/pedidosRepository", () => ({
    pedidosRepository: {
        getPedidos: jest.fn(),
        getPedidoById: jest.fn(),
        getPedidosByClienteId: jest.fn(),
        updateEstado: jest.fn(),
        create: jest.fn(),
        createDireccion: jest.fn(),
        createPago: jest.fn(),
        getMetodoPago: jest.fn(),
        deletePedido: jest.fn(),
    },
}));

jest.mock("@/repositories/productosRepository", () => ({
    productoRepository: {
        getById: jest.fn(),
    },
}));

beforeEach(() => jest.clearAllMocks());

const pedidoMock = {
    id_pedido: 1,
    id_cliente: 3,
    estado: "Pendiente",
    subtotal: 50000,
    valor_envio: 5000,
    total: 55000,
    detalles: [],
    pagos: [],
};

const bodyPedidoValido = {
    id_cliente: 3,
    direccion: "Calle 10 # 5-20",
    barrio: "San Antonio",
    ciudad: "Cali",
    telefono: "3101234567",
    fecha_entrega: "2026-12-01",
    metodoPago: "Efectivo",
    items: [
        { id_producto: 1, cantidad: 2, tamaño: "Grande", precio_unitario: 25000 },
    ],
};

// ── getPedidos ────────────────────────────────────────────────
describe("getPedidos", () => {
    test("retorna lista de pedidos correctamente", async () => {
        (pedidosRepository.getPedidos as jest.Mock).mockResolvedValue([pedidoMock]);
        const resultado = await pedidosService.getPedidos();
        expect(resultado.exito).toBe(true);
        if (resultado.exito) expect(resultado.datos).toHaveLength(1);
    });
});

// ── getPedidoById ─────────────────────────────────────────────
describe("getPedidoById", () => {
    test("retorna error 400 si el ID es NaN", async () => {
        const resultado = await pedidosService.getPedidoById(NaN);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 404 si el pedido no existe", async () => {
        (pedidosRepository.getPedidoById as jest.Mock).mockResolvedValue(null);
        const resultado = await pedidosService.getPedidoById(99);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(404);
    });

    test("retorna el pedido correctamente", async () => {
        (pedidosRepository.getPedidoById as jest.Mock).mockResolvedValue(pedidoMock);
        const resultado = await pedidosService.getPedidoById(1);
        expect(resultado.exito).toBe(true);
    });
});

// ── getPedidosByClienteId ─────────────────────────────────────
describe("getPedidosByClienteId", () => {
    test("retorna error 400 si el ID de cliente es NaN", async () => {
        const resultado = await pedidosService.getPedidosByClienteId(NaN);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna pedidos del cliente correctamente", async () => {
        (pedidosRepository.getPedidosByClienteId as jest.Mock).mockResolvedValue([pedidoMock]);
        const resultado = await pedidosService.getPedidosByClienteId(3);
        expect(resultado.exito).toBe(true);
    });
});

// ── updateEstado ──────────────────────────────────────────────
describe("updateEstado", () => {
    test("retorna error 400 si el ID es NaN", async () => {
        const resultado = await pedidosService.updateEstado(NaN, { estado: "Pagado" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 404 si el pedido no existe", async () => {
        (pedidosRepository.getPedidoById as jest.Mock).mockResolvedValue(null);
        const resultado = await pedidosService.updateEstado(99, { estado: "Pagado" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(404);
    });

    test("retorna error 400 si el estado está vacío", async () => {
        (pedidosRepository.getPedidoById as jest.Mock).mockResolvedValue(pedidoMock);
        const resultado = await pedidosService.updateEstado(1, { estado: "" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si el estado no es válido", async () => {
        (pedidosRepository.getPedidoById as jest.Mock).mockResolvedValue(pedidoMock);
        const resultado = await pedidosService.updateEstado(1, { estado: "Inventado" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 409 si el pedido ya está cancelado", async () => {
        (pedidosRepository.getPedidoById as jest.Mock).mockResolvedValue({ ...pedidoMock, estado: "Cancelado" });
        const resultado = await pedidosService.updateEstado(1, { estado: "Pagado" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(409);
    });

    test("retorna error 409 si el pedido ya fue entregado", async () => {
        (pedidosRepository.getPedidoById as jest.Mock).mockResolvedValue({ ...pedidoMock, estado: "Entregado" });
        const resultado = await pedidosService.updateEstado(1, { estado: "Pagado" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(409);
    });

    test("actualiza el estado correctamente", async () => {
        (pedidosRepository.getPedidoById as jest.Mock).mockResolvedValue(pedidoMock);
        (pedidosRepository.updateEstado as jest.Mock).mockResolvedValue({ ...pedidoMock, estado: "Pagado" });
        const resultado = await pedidosService.updateEstado(1, { estado: "Pagado" });
        expect(resultado.exito).toBe(true);
    });
});

// ── create ────────────────────────────────────────────────────
describe("create", () => {
    test("retorna error 400 si falta id_cliente", async () => {
        const resultado = await pedidosService.create({ ...bodyPedidoValido, id_cliente: 0 });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si la dirección está vacía", async () => {
        const resultado = await pedidosService.create({ ...bodyPedidoValido, direccion: "" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si el barrio está vacío", async () => {
        const resultado = await pedidosService.create({ ...bodyPedidoValido, barrio: "" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si el teléfono está vacío", async () => {
        const resultado = await pedidosService.create({ ...bodyPedidoValido, telefono: "" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si no hay fecha de entrega", async () => {
        const resultado = await pedidosService.create({ ...bodyPedidoValido, fecha_entrega: "" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si el pedido no tiene items", async () => {
        const resultado = await pedidosService.create({ ...bodyPedidoValido, items: [] });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si falta el método de pago", async () => {
        const resultado = await pedidosService.create({ ...bodyPedidoValido, metodoPago: "" });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 400 si un item tiene id_producto inválido", async () => {
        const resultado = await pedidosService.create({
            ...bodyPedidoValido,
            items: [{ id_producto: -1, cantidad: 1, tamaño: "Grande", precio_unitario: 25000 }],
        });
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 404 si el producto de un item no existe", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue(null);
        const resultado = await pedidosService.create(bodyPedidoValido);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(404);
    });

    test("retorna error 404 si el método de pago no existe", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue({ id_producto: 1 });
        (pedidosRepository.getMetodoPago as jest.Mock).mockResolvedValue(null);
        const resultado = await pedidosService.create(bodyPedidoValido);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(404);
    });

    test("crea el pedido correctamente cuando todo es válido", async () => {
        (productoRepository.getById as jest.Mock).mockResolvedValue({ id_producto: 1 });
        (pedidosRepository.getMetodoPago as jest.Mock).mockResolvedValue({ id_metodo_pago: 1 });
        (pedidosRepository.createDireccion as jest.Mock).mockResolvedValue({ id_direccion: 10 });
        (pedidosRepository.create as jest.Mock).mockResolvedValue({ ...pedidoMock, id_pedido: 5 });
        (pedidosRepository.createPago as jest.Mock).mockResolvedValue(undefined);

        const resultado = await pedidosService.create(bodyPedidoValido);
        expect(resultado.exito).toBe(true);
    });

    test("crea el pedido sin ciudad y usa 'Cali' por defecto", async () => {
        const bodysSinCiudad = { ...bodyPedidoValido, ciudad: undefined };
        (productoRepository.getById as jest.Mock).mockResolvedValue({ id_producto: 1 });
        (pedidosRepository.getMetodoPago as jest.Mock).mockResolvedValue({ id_metodo_pago: 1 });
        (pedidosRepository.createDireccion as jest.Mock).mockResolvedValue({ id_direccion: 10 });
        (pedidosRepository.create as jest.Mock).mockResolvedValue({ ...pedidoMock, id_pedido: 6 });
        (pedidosRepository.createPago as jest.Mock).mockResolvedValue(undefined);

        const resultado = await pedidosService.create(bodysSinCiudad);
        expect(resultado.exito).toBe(true);
        expect(pedidosRepository.createDireccion).toHaveBeenCalledWith(
            expect.objectContaining({ ciudad: "Cali" })
        );
    });
});

// ── deletePedido ──────────────────────────────────────────────
describe("deletePedido", () => {
    test("retorna error 400 si el ID es NaN", async () => {
        const resultado = await pedidosService.deletePedido(NaN);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(400);
    });

    test("retorna error 404 si el pedido no existe", async () => {
        (pedidosRepository.getPedidoById as jest.Mock).mockResolvedValue(null);
        const resultado = await pedidosService.deletePedido(99);
        expect(resultado.exito).toBe(false);
        if (!resultado.exito) expect(resultado.codigo).toBe(404);
    });

    test("elimina el pedido correctamente", async () => {
        (pedidosRepository.getPedidoById as jest.Mock).mockResolvedValue(pedidoMock);
        (pedidosRepository.deletePedido as jest.Mock).mockResolvedValue(undefined);
        const resultado = await pedidosService.deletePedido(1);
        expect(resultado.exito).toBe(true);
        if (resultado.exito) expect(resultado.datos.message).toBe("Pedido eliminado correctamente");
    });
});
