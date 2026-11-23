import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import "./../cuenta.css";

const formatoMoneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function etiquetaEstado(estado: string) {
  switch (estado) {
    case "Pendiente":
      return "Pendiente por recibir";
    case "Pagado":
      return "En preparación";
    case "Enviado":
      return "En camino";
    default:
      return estado;
  }
}

export default async function MisPedidosPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const clienteId = Number(session.user.id);
  if (!Number.isInteger(clienteId) || clienteId < 1) {
    redirect("/login");
  }

  const pedidos = await prisma.pedido.findMany({
    where: { id_cliente: clienteId },
    orderBy: { fecha_pedido: "desc" },
    select: {
      id_pedido: true,
      fecha_pedido: true,
      estado: true,
      total: true,
      direccion: {
        select: { fecha_entrega: true },
      },
      detalles: {
        select: {
          id_detalle: true,
          cantidad: true,
          tamaño: true,
          producto: {
            select: {
              nombre_producto: true,
            },
          },
        },
      },
    },
  });

  return (
    <section className="cuenta-page">
      <header className="cuenta-header">
        <h1 className="cuenta-titulo">Mis pedidos</h1>
        <p className="cuenta-subtitulo">Aquí puedes consultar tus pedidos recientes.</p>
      </header>

      <div className="cuenta-contenido cuenta-pedidos">
        {pedidos.length === 0 ? (
          <p className="cuenta-vacio">Aún no tienes pedidos.</p>
        ) : (
          pedidos.map((pedido) => (
            <article className="cuenta-pedido" key={pedido.id_pedido}>
              <header className="cuenta-pedido-header">
                <div>
                  <h2 className="cuenta-pedido-numero">
                    Pedido #{pedido.id_pedido}
                  </h2>
                  <p className="cuenta-pedido-fecha">
                    {pedido.fecha_pedido.toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </p>
                </div>
                <span className="cuenta-pedido-estado">
                  {etiquetaEstado(pedido.estado)}
                </span>
              </header>

              <ul className="cuenta-pedido-productos">
                {pedido.detalles.map((detalle) => (
                  <li key={detalle.id_detalle}>
                    {detalle.cantidad} × {detalle.producto.nombre_producto}
                    {detalle.tamaño ? ` (${detalle.tamaño})` : ""}
                  </li>
                ))}
              </ul>

              {pedido.direccion.fecha_entrega && (
                <p className="cuenta-pedido-fecha">
                  Entrega solicitada:{" "}
                  {pedido.direccion.fecha_entrega.toLocaleDateString("es-CO", {
                    timeZone: "UTC",
                  })}
                </p>
              )}

              <p className="cuenta-pedido-total">
                <span>Total</span>
                <span>{formatoMoneda.format(pedido.total)}</span>
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
