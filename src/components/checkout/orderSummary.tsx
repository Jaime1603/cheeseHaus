import type { ItemCarrito } from "@/lib/carrito";

const formatoMoneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function OrderSummary({ items }: { items: ItemCarrito[] }) {
  const subtotal = items.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0,
  );
  const envio = items.length > 0 ? 5000 : 0;

  return (
    <div className="checkout-resumen-inner">
      {items.map((item) => (
        <div
          className="checkout-resumen-item"
          key={`${item.id_producto}-${item.tamaño}`}
        >
          <div className="checkout-resumen-imagen">
            <img src={item.imagen_url} alt={item.nombre_producto} />
          </div>
          <div className="checkout-resumen-info">
            <span className="checkout-resumen-nombre">
              {item.nombre_producto}
            </span>
            <span className="checkout-resumen-cantidad">
              {item.tamaño || "Tamaño estándar"} × {item.cantidad}
            </span>
          </div>
          <span className="checkout-resumen-precio">
            {formatoMoneda.format(item.precio * item.cantidad)}
          </span>
        </div>
      ))}

      <div className="checkout-resumen-fila">
        <span>Subtotal</span>
        <span>{formatoMoneda.format(subtotal)}</span>
      </div>
      <div className="checkout-resumen-fila">
        <span>Envío</span>
        <span>{formatoMoneda.format(envio)}</span>
      </div>
      <div className="checkout-resumen-separador" />
      <div className="checkout-resumen-fila">
        <span className="checkout-resumen-total">Total</span>
        <span className="checkout-resumen-total">
          {formatoMoneda.format(subtotal + envio)}
        </span>
      </div>
    </div>
  );
}
