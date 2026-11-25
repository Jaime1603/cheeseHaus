import { pedidosService } from "../services/pedidosService";
import { auth } from "@/lib/auth";

import { NextResponse } from "next/server";
import { isRecord } from "@/lib/validation";

async function verificarAdmin() {
  const session = await auth();
  if (!session || session.user.rol !== "ADMIN") return null;
  return session;
}

async function verificarSesion() {
  const session = await auth();
  if (!session) return null;
  return session;
}

// GET /api/admin/pedidos
export async function getAllPedidos(req: Request) {
  try {
    const session = await verificarAdmin();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const clienteParam = searchParams.get("cliente");

    // Sin filtro: todos los pedidos
    if (clienteParam === null) {
      const resultado = await pedidosService.getPedidos();

      return NextResponse.json(resultado.datos, { status: 200 });
    }

    // Con filtro: pedidos de un cliente
    const resultado = await pedidosService.getPedidosByClienteId(
      Number(clienteParam),
    );

    if (!resultado.exito) {
      return NextResponse.json(
        { error: resultado.error },
        { status: resultado.codigo },
      );
    }

    return NextResponse.json(resultado.datos, { status: 200 });
  } catch (error) {
    console.error("Error en el GET de Pedidos", error);
    return NextResponse.json(
      { error: "error interno del servidor" },
      { status: 500 },
    );
  }
}

// GET /api/admin/pedidos/[id]

export async function getPedidosById(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await verificarAdmin();
    if (!session) {
      return NextResponse.json({ error: "No Autorizado" }, { status: 401 });
    }

    const id = Number.parseInt((await params).id, 10);
    const resultado = await pedidosService.getPedidoById(id);

    if (!resultado.exito) {
      return NextResponse.json(
        { error: resultado.error },
        { status: resultado.codigo },
      );
    }
    return NextResponse.json(resultado.datos, { status: 200 });
  } catch (error) {
    console.log("error en el GET de pedidos por ID");
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// GET /api/admin/pedidos/cliente?[id]

//PUT /api/admin/pedidos
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await verificarAdmin();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const id = Number.parseInt((await params).id, 10);
    const body = await req.json();
    const resultado = await pedidosService.updateEstado(id, body);

    if (!resultado.exito) {
      return NextResponse.json(
        { error: resultado.error },
        { status: resultado.codigo },
      );
    }
    return NextResponse.json(resultado.datos, { status: 200 });
  } catch (error) {
    console.log("Error en el PUT de pedidos", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// POST /api/pedidos/cliente
export async function POST(req: Request) {
  try {
    const session = await verificarSesion();
    if (!session) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para realizar un pedido" },
        { status: 401 },
      );
    }

    const clienteId = Number(session.user.id);
    if (!Number.isInteger(clienteId) || clienteId < 1) {
      return NextResponse.json(
        { error: "La sesión no tiene un cliente válido" },
        { status: 401 },
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "El cuerpo de la solicitud no es válido" },
        { status: 400 },
      );
    }

    if (!isRecord(body)) {
      return NextResponse.json(
        { error: "El cuerpo de la solicitud no es válido" },
        { status: 400 },
      );
    }

    const resultado = await pedidosService.create({
      id_cliente: clienteId,
      direccion: body.direccion,
      barrio: body.barrio,
      ciudad: body.ciudad,
      telefono: body.telefono,
      fecha_entrega: body.fecha_entrega,
      metodoPago: body.metodoPago,
      items: body.items,
    });

    if (!resultado.exito) {
      return NextResponse.json(
        { error: resultado.error },
        { status: resultado.codigo },
      );
    }

    return NextResponse.json(resultado.datos, { status: 201 });
  } catch (error) {
    console.log("Error en el POST de pedidos", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await verificarAdmin();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const id = Number.parseInt((await params).id, 10);
    const resultado = await pedidosService.deletePedido(id);

    if (!resultado.exito) {
      return NextResponse.json(
        { error: resultado.error },
        { status: resultado.codigo },
      );
    }
    return NextResponse.json(resultado.datos, { status: 200 });
  } catch (error) {
    console.error("Error en el DELETE de pedidos", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
