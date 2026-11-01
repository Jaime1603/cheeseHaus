import { prisma } from "@/lib/prisma";

export const pedidosRepository = {
  async getPedidos() {
    return await prisma.pedido.findMany({
      include: {
        cliente: {
          select: {
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        detalles: {
          include: {
            producto: {
              select: {
                nombre_producto: true,
                imagen_url: true,
              },
            },
          },
        },
      },
      orderBy: {
        fecha_pedido: "desc",
      },
    });
  },

  async getPedidoById(id: number) {
    return await prisma.pedido.findUnique({
      where: { id_pedido: id },
      include: {
        cliente: true,
        direccion: true,
        detalles: {
          include: {
            producto: {
              select: {
                nombre_producto: true,
                imagen_url: true,
                precio: true,
              },
            },
          },
        },
        pagos: {
          include: {
            metodo_pago: true,
          },
        },
      },
    });
  },

  async getPedidosByClienteId(clienteId: number) {
    return await prisma.pedido.findMany({
      where: { id_cliente: clienteId },
      include: {
        detalles: {
          include: {
            producto: {
              select: {
                nombre_producto: true,
                imagen_url: true,
              },
            },
          },
        },
        pagos: true,
      },
      orderBy: {
        fecha_pedido: "desc",
      },
    });
  },

  async create(datos: {
    id_cliente: number;
    id_direccion: number;
    subtotal: number;
    valor_envio: number;
    total: number;
    estado: string;
    detalles: {
      id_producto: number;
      cantidad: number;
      tamaño: string;
      precio_unitario: number;
    }[];
  }) {
    return await prisma.pedido.create({
      data: {
        id_cliente: datos.id_cliente,
        id_direccion: datos.id_direccion,
        subtotal: datos.subtotal,
        valor_envio: datos.valor_envio,
        total: datos.total,
        estado: datos.estado,
        detalles: {
          create: datos.detalles,
        },
      },

      include: {
        detalles: {
          include: {
            producto: {
              select: {
                nombre_producto: true,
                imagen_url: true,
              },
            },
          },
        },
      },
    });
  },

  async updateEstado(id: number, estado: string) {
    return await prisma.pedido.update({
      where: { id_pedido: id },
      data: { estado },
    });
  },

  async createDireccion(datos: {
    id_cliente: number;
    direccion: string;
    barrio: string;
    ciudad: string;
    telefono: string;
    fecha_entrega: Date;
  }) {
    return await prisma.direccion.create({
      data: datos,
    });
  },

  async createPago(datos: {
    id_pedido: number;
    id_metodo_pago: number;
    estado: string;
    fecha_pago: Date;
    referencia: string;
  }) {
    return await prisma.pago.create({
      data: datos,
    });
  },

  async getMetodoPago(nombre: string) {
    return await prisma.metodoPago.findFirst({
      where: {
        nombre_metodo: {
          equals: nombre,
          mode: "insensitive",
        },
      },
    });
  },

  async deletePedido(id: number) {
    await prisma.detallePedido.deleteMany({
      where: { id_pedido: id },
    });
    await prisma.pago.deleteMany({
      where: { id_pedido: id },
    });

    return await prisma.pedido.delete({
      where: { id_pedido: id },
    });
  },
};
