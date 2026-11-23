/** @jest-environment node */
jest.mock("@/repositories/pedidosRepository", () => ({
  pedidosRepository: {
    createCheckoutOrder: jest.fn(),
  },
}));

jest.mock("@/repositories/productosRepository", () => ({
  productoRepository: {
    getById: jest.fn(),
  },
}));

import { pedidosService } from "@/services/pedidosService";
import { pedidosRepository } from "@/repositories/pedidosRepository";
import { productoRepository } from "@/repositories/productosRepository";

beforeEach(() => jest.clearAllMocks());

const pedidoValido = {
  id_cliente: 12,
  direccion: "Calle 1 #2-3",
  barrio: "Centro",
  ciudad: "Cali",
  telefono: "3001234567",
  fecha_entrega: "2099-12-30",
  metodoPago: "Contra entrega",
  items: [
    {
      id_producto: 9,
      cantidad: 2,
      tamaño: "8 porciones",
      precio_unitario: 1,
    },
  ],
};

test("creates pending orders with server product prices, not submitted prices", async () => {
  (productoRepository.getById as jest.Mock).mockResolvedValue({
    id_producto: 9,
    activo: true,
    precio: 25000,
    tamaño: "6 porciones, 8 porciones",
  });
  (pedidosRepository.createCheckoutOrder as jest.Mock).mockResolvedValue({
    id_pedido: 31,
    estado: "Pendiente",
  });

  const result = await pedidosService.create(pedidoValido);

  expect(result).toEqual({
    exito: true,
    datos: { id_pedido: 31, estado: "Pendiente" },
  });
  expect(pedidosRepository.createCheckoutOrder).toHaveBeenCalledWith(
    expect.objectContaining({
      id_cliente: 12,
      subtotal: 50000,
      valor_envio: 5000,
      total: 55000,
      detalles: [
        {
          id_producto: 9,
          cantidad: 2,
          tamaño: "8 porciones",
          precio_unitario: 25000,
        },
      ],
    }),
  );
});

test("rejects unavailable products and invalid delivery dates", async () => {
  (productoRepository.getById as jest.Mock).mockResolvedValue({
    id_producto: 9,
    activo: false,
    precio: 25000,
    tamaño: "8 porciones",
  });
  const unavailable = await pedidosService.create(pedidoValido);
  const invalidDate = await pedidosService.create({
    ...pedidoValido,
    fecha_entrega: "2099-02-31",
  });

  expect(unavailable).toMatchObject({ exito: false, codigo: 404 });
  expect(invalidDate).toMatchObject({ exito: false, codigo: 400 });
  expect(pedidosRepository.createCheckoutOrder).not.toHaveBeenCalled();
});
