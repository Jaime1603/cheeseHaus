import { render, screen } from "@testing-library/react";
import MisPedidosPage from "@/app/(shop)/mis-pedidos/page";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/prisma", () => ({
  prisma: {
    pedido: { findMany: jest.fn() },
  },
}));
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

test("shows only the signed-in customer's orders and their pending delivery", async () => {
  (auth as jest.Mock).mockResolvedValue({
    user: { id: "12", rol: "Cliente" },
  });
  (prisma.pedido.findMany as jest.Mock).mockResolvedValue([
    {
      id_pedido: 31,
      fecha_pedido: new Date("2026-11-20T12:00:00Z"),
      estado: "Pendiente",
      total: 55000,
      direccion: { fecha_entrega: new Date("2026-11-25T12:00:00Z") },
      detalles: [
        {
          id_detalle: 4,
          cantidad: 2,
          tamaño: "8 porciones",
          producto: { nombre_producto: "Cheesecake" },
        },
      ],
    },
  ]);

  render(await MisPedidosPage());

  expect(prisma.pedido.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { id_cliente: 12 },
      orderBy: { fecha_pedido: "desc" },
    }),
  );
  expect(screen.getByText("Pedido #31")).toBeInTheDocument();
  expect(screen.getByText("Pendiente por recibir")).toBeInTheDocument();
  expect(screen.getByText("2 × Cheesecake (8 porciones)")).toBeInTheDocument();
});
