import { pedidosRepository } from "../repositories/pedidosRepository";
import { productoRepository } from "../repositories/productosRepository";
import { isRecord } from "@/lib/validation";

type RespuestaService<T> =
  | { exito: true; datos: T }
  | { exito: false; error: string; codigo: number };

const estados_validos = [
  "Pendiente",
  "Pagado",
  "Enviado",
  "Entregado",
  "Cancelado",
];
const metodosPagoValidos = ["Tarjeta", "PSE", "Contra entrega"];
export const pedidosService = {
  async getPedidos() {
    const pedidos = await pedidosRepository.getPedidos();
    return { exito: true, datos: pedidos } as const;
  },

  async getPedidoById(id: number) {
    if (Number.isNaN(id)) {
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
    if (Number.isNaN(clienteId)) {
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
    if (Number.isNaN(id)) {
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
    direccion: unknown;
    barrio: unknown;
    ciudad: unknown;
    telefono: unknown;
    fecha_entrega: unknown;
    metodoPago: unknown;
    items: unknown;
  }) {
    if (!Number.isInteger(body.id_cliente) || body.id_cliente < 1) {
      return { exito: false, error: "Cliente invalido", codigo: 400 } as const;
    }

    if (typeof body.direccion !== "string" || !body.direccion.trim()) {
      return {
        exito: false,
        error: "La dirección es obligatoria",
        codigo: 400,
      } as const;
    }
    if (body.direccion.trim().length > 100) {
      return {
        exito: false,
        error: "La dirección debe tener máximo 100 caracteres",
        codigo: 400,
      } as const;
    }

    if (typeof body.barrio !== "string" || !body.barrio.trim()) {
      return {
        exito: false,
        error: "El barrio es obligatorio",
        codigo: 400,
      } as const;
    }
    if (body.barrio.trim().length > 100) {
      return {
        exito: false,
        error: "El barrio debe tener máximo 100 caracteres",
        codigo: 400,
      } as const;
    }

    if (
      typeof body.telefono !== "string" ||
      !/^\d{7,10}$/.test(body.telefono.trim())
    ) {
      return {
        exito: false,
        error: "El teléfono debe tener entre 7 y 10 dígitos",
        codigo: 400,
      } as const;
    }

    const fechaEntrega =
      typeof body.fecha_entrega === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(body.fecha_entrega)
        ? new Date(`${body.fecha_entrega}T12:00:00`)
        : null;
    if (
      !fechaEntrega ||
      Number.isNaN(fechaEntrega.getTime()) ||
      fechaEntrega.toISOString().slice(0, 10) !== body.fecha_entrega ||
      body.fecha_entrega < new Date().toISOString().slice(0, 10)
    ) {
      return {
        exito: false,
        error: "La fecha de entrega no es válida",
        codigo: 400,
      } as const;
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return {
        exito: false,
        error: "El pedido debe tener al menos un producto",
        codigo: 400,
      } as const;
    }

    if (
      typeof body.metodoPago !== "string" ||
      !metodosPagoValidos.includes(body.metodoPago) ||
      body.metodoPago.length > 50
    ) {
      return {
        exito: false,
        error: "El método de pago no es válido",
        codigo: 400,
      } as const;
    }

    const detalles: {
      id_producto: number;
      cantidad: number;
      tamaño: string | null;
      precio_unitario: number;
    }[] = [];

    for (const item of body.items) {
      if (
        !isRecord(item) ||
        !Number.isInteger(item.id_producto) ||
        Number(item.id_producto) <= 0 ||
        !Number.isInteger(item.cantidad) ||
        Number(item.cantidad) <= 0 ||
        Number(item.cantidad) > 50 ||
        (item.tamaño !== undefined && typeof item.tamaño !== "string")
      ) {
        return {
          exito: false,
          error: "Los productos o sus cantidades no son válidos",
          codigo: 400,
        } as const;
      }

      const producto = await productoRepository.getById(
        Number(item.id_producto),
      );
      if (!producto || !producto.activo) {
        return {
          exito: false,
          error: `El producto con ID ${String(item.id_producto)} no está disponible`,
          codigo: 404,
        } as const;
      }

      const tamaño =
        typeof item.tamaño === "string" ? item.tamaño.trim() : "";
      const tamañosDisponibles =
        producto.tamaño?.split(",").map((value) => value.trim()) ?? [];
      if (tamañosDisponibles.length > 0 && !tamañosDisponibles.includes(tamaño)) {
        return {
          exito: false,
          error: `Selecciona un tamaño válido para ${producto.nombre_producto}`,
          codigo: 400,
        } as const;
      }

      detalles.push({
        id_producto: producto.id_producto,
        cantidad: Number(item.cantidad),
        tamaño: tamaño || null,
        precio_unitario: producto.precio,
      });
    }

    const subtotal = detalles.reduce(
      (acc, item) => acc + item.precio_unitario * item.cantidad,
      0,
    );
    const valor_envio = 5000;
    const total = subtotal + valor_envio;
    const pedido = await pedidosRepository.createCheckoutOrder({
      id_cliente: body.id_cliente,
      direccion: body.direccion.trim(),
      barrio: body.barrio.trim(),
      ciudad:
        typeof body.ciudad === "string" && body.ciudad.trim()
          ? body.ciudad.trim().slice(0, 100)
          : "Cali",
      telefono: body.telefono.trim(),
      fecha_entrega: fechaEntrega,
      metodo_pago: body.metodoPago,
      subtotal,
      valor_envio,
      total,
      detalles,
    });

    return { exito: true, datos: pedido } as const;
  },

  async deletePedido(id: number) {
    if (Number.isNaN(id)) {
      return {
        exito: false,
        error: "ID de pedido invalido",
        codigo: 400,
      } as const;
    }

    const existente = await pedidosRepository.getPedidoById(id);

    if (!existente) {
      return {
        exito: false,
        error: "El pedido no existe",
        codigo: 404,
      } as const;
    }

    await pedidosRepository.deletePedido(id);
    return {
      exito: true,
      datos: { message: "Pedido eliminado correctamente" },
    } as const;
  },
};
