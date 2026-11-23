import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ConfirmationActions,
  ConfirmationContactCard,
} from "@/components/checkout/confirmationCustomerInfo";
import "./confirmacion.css";
import "../verificacion/verificacion.css";

const formatoMoneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string }>;
}) {
  const session = await auth();
  const clienteId = Number(session?.user?.id);
  if (!Number.isInteger(clienteId) || clienteId < 1) {
    redirect("/login");
  }

  const { pedido: pedidoParam } = await searchParams;
  const pedidoId = Number(pedidoParam);
  if (!Number.isInteger(pedidoId) || pedidoId < 1) {
    redirect("/mis-pedidos");
  }

  const pedido = await prisma.pedido.findFirst({
    where: { id_pedido: pedidoId, id_cliente: clienteId },
    include: {
      direccion: true,
      detalles: {
        include: {
          producto: {
            select: { nombre_producto: true, imagen_url: true },
          },
        },
      },
      pagos: { include: { metodo_pago: true } },
    },
  });
  if (!pedido) {
    redirect("/mis-pedidos");
  }

  return (
    <div className="confirmacion-page">
      <div className="checkout-header">
        <Link href="/" className="checkout-logo">CheeseHaus</Link>
      </div>
      <div className="checkout-separador-titulo" />
      <header className="confirmacion-header">
        <h1 className="confirmacion-info-titulo">¡Gracias por tu compra!</h1>
        <p className="confirmacion-info-orden">
          Pedido #{pedido.id_pedido} ·{" "}
          {pedido.fecha_pedido.toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          })}
        </p>
        <p className="confirmacion-info-estado" role="status">
          Estado:{" "}
          {pedido.estado === "Pendiente"
            ? "Pendiente por recibir"
            : pedido.estado}
        </p>
      </header>

      <main className="confirmacion-container">
        <section className="confirmacion-info-grid">
          <ConfirmationContactCard />
          <article className="confirmacion-tarjeta">
            <h2 className="confirmacion-tarjeta-titulo">Entrega</h2>
            <div className="confirmacion-tarjeta-info">
              <p>{pedido.direccion.direccion}</p>
              <p>{pedido.direccion.barrio}, {pedido.direccion.ciudad}</p>
              <p>{pedido.direccion.telefono}</p>
              {pedido.direccion.fecha_entrega && (
                <p>
                  Fecha solicitada:{" "}
                  {pedido.direccion.fecha_entrega.toLocaleDateString("es-CO", {
                    timeZone: "UTC",
                  })}
                </p>
              )}
            </div>
          </article>
          <article className="confirmacion-metodo-pago">
            <h2 className="confirmacion-tarjeta-titulo">Método seleccionado</h2>
            <p>{pedido.pagos[0]?.metodo_pago.nombre_metodo ?? "No especificado"}</p>
            <p>El pago no se procesó en línea.</p>
          </article>
          <section className="confirmacion-productos">
            {pedido.detalles.map((detalle) => (
              <div className="confirmacion-item" key={detalle.id_detalle}>
                <img
                  src={detalle.producto.imagen_url}
                  alt={detalle.producto.nombre_producto}
                  className="confirmacion-item-img"
                />
                <div className="confirmacion-item-info">
                  <span className="confirmacion-item-nombre">
                    {detalle.producto.nombre_producto}
                  </span>
                  <span className="confirmacion-item-detalle">
                    {detalle.tamaño || "Tamaño estándar"} × {detalle.cantidad}
                  </span>
                </div>
                <span className="confirmacion-item-precio">
                  {formatoMoneda.format(
                    detalle.precio_unitario * detalle.cantidad,
                  )}
                </span>
              </div>
            ))}
            <div className="confirmacion-separador" />
            <div className="confirmacion-fila-resumen">
              <span>Envío</span>
              <span>{formatoMoneda.format(pedido.valor_envio)}</span>
            </div>
            <div className="confirmacion-fila-total">
              <span>Total</span>
              <span>{formatoMoneda.format(pedido.total)}</span>
            </div>
          </section>
        </section>
      </main>
      <ConfirmationActions />
    </div>
  );
}
