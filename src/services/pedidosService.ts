import { pedidosRepository } from "../repositories/pedidosRepository";

const estados_validos = [
  "Pendiente",
  "Pagado",
  "Enviado",
  "Entregado",
  "Cancelado",
];
export const pedidosService = {
  async getPedidos() {
    const pedidos = await pedidosRepository.getPedidos();
    return { exito: true, datos: pedidos } as const;
  },

  async getPedidoById(id: number) {
    if (isNaN(id)) {
      return {
        exito: false,
        error: "ID de pedido invalido",
        codigo: 400,
      } as const;
    }

    const pedido = await pedidosRepository.getPedidoById(id);

    if (!pedido) {
      return {
        exito: false,
        error: "Pedido no encontrado",
        codigo: 404,
      } as const;
    }

    return { exito: true, datos: pedido } as const;
  },

  async getPedidosByClienteId(clienteId: number) {
    if (isNaN(clienteId)) {
      return {
        exito: false,
        error: "ID de cliente invalido",
        codigo: 400,
      } as const;
    }

    const pedidos = await pedidosRepository.getPedidosByClienteId(clienteId);
    return { exito: true, datos: pedidos } as const;
  },

  async updateEstado(
    id: number,
    body: {
      estado?: string;
    },
  ) {
    if (isNaN(id)) {
      return {
        exito: false,
        error: "ID de pedido invalido",
        codigo: 400,
      } as const;
    }

    if (!body.estado || body.estado.trim() === "") {
      return {
        exito: false,
        error: "El estado es obligatorio y no puede estar vacio",
        codigo: 400,
      } as const;
    }

    if (!estados_validos.includes(body.estado)) {
      return {
        exito: false,
        error:
          "Estado invalido. Los estados validos son: " +
          estados_validos.join(", "),
        codigo: 400,
      } as const;
    }

    const pedido = await pedidosRepository.getPedidoById(id);

    if (!pedido) {
      return {
        exito: false,
        error: "Pedido no encontrado",
        codigo: 404,
      } as const;
    }

    if (pedido.estado === "Cancelado") {
      return {
        exito: false,
        error: "No se puede cambiar el estado de un pedido cancelado",
        codigo: 409,
      } as const;
    }

    if (pedido.estado === "Entregado") {
      return {
        exito: false,
        error: "No se puede cambiar el estado de un pedido ya entregado",
        codigo: 409,
      } as const;
    }

    const actualizado = await pedidosRepository.updateEstado(id, body.estado);
    return { exito: true, datos: actualizado } as const;
  },

  async create(body: {
    id_cliente: number;
    direccion: string;
    barrio: string;
    ciudad?: string;
    telefono: string;
    fecha_entrega: string;
    metodoPago: string;
    items: {
      id_producto: number;
      cantidad: number;
      tamaño: string;
      precio_unitario: number;
    }[];
  }) {
    if (!body.id_cliente || isNaN(body.id_cliente)) {
      return { exito: false, error: "Cliente invalido", codigo: 400 } as const;
    }

    if (!body.direccion || body.direccion.trim() === "") {
      return {
        exito: false,
        error: "La dirección es obligatoria",
        codigo: 400,
      } as const;
    }

    if (!body.barrio || body.barrio.trim() === "") {
      return {
        exito: false,
        error: "El barrio es obligatorio",
        codigo: 400,
      } as const;
    }

    if (!body.telefono || body.telefono.trim() === "") {
      return {
        exito: false,
        error: "El teléfono es obligatorio",
        codigo: 400,
      } as const;
    }

    if (!body.fecha_entrega) {
      return {
        exito: false,
        error: "La fecha de entrega es obligatoria",
        codigo: 400,
      } as const;
    }

    if (!body.items || body.items.length === 0) {
      return {
        exito: false,
        error: "El pedido debe tener al menos un producto",
        codigo: 400,
      } as const;
    }

    if (!body.metodoPago) {
      return {
        exito: false,
        error: "El método de pago es obligatorio",
        codigo: 400,
      } as const;
    }

    const metodo = await pedidosRepository.getMetodoPago(body.metodoPago);

    if (!metodo) {
      return {
        exito: false,
        error: "Metodo de pago no encontrado",
        codigo: 404,
      } as const;
    }

    // ── Calcular totales ──
    const subtotal = body.items.reduce(
      (acc, item) => acc + item.precio_unitario * item.cantidad,
      0,
      // reduce acumula el total de todos los items
    );
    const valor_envio = 5000;
    // Costo fijo de envío
    const total = subtotal + valor_envio;

    const direccion = await pedidosRepository.createDireccion({
      id_cliente: body.id_cliente,
      direccion: body.direccion.trim(),
      barrio: body.barrio.trim(),
      ciudad: body.ciudad?.trim() || "Cali",
      telefono: body.telefono.trim(),
      fecha_entrega: new Date(body.fecha_entrega),
    });

    const pedido = await pedidosRepository.create({
      id_cliente: body.id_cliente,
      id_direccion: direccion.id_direccion,
      subtotal,
      valor_envio,
      total,
      estado: "Pendiente",
      detalles: body.items,
    });

    // ── Crear el pago asociado ──
    await pedidosRepository.createPago({
      id_pedido: pedido.id_pedido,
      id_metodo_pago: metodo.id_metodo_pago,
      estado: "Pendiente",
      fecha_pago: new Date(),
      referencia: `PED-${pedido.id_pedido}`,
    });

    return { exito: true, datos: pedido } as const;
  },
};
