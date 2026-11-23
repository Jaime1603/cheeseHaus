"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OrderSummary from "@/components/checkout/orderSummary";
import { guardarCarrito } from "@/lib/carrito";
import { useCarrito, useDatosEntrega } from "@/hooks/useCarrito";
import "../verificacion/verificacion.css";
import "./pago.css";

type MetodoPago = "Tarjeta" | "PSE" | "Contra entrega";

const logosPorMetodo: Record<MetodoPago, { src: string; alt: string }[]> = {
  Tarjeta: [
    { src: "/mastercard.svg", alt: "Mastercard" },
    { src: "/visa.svg", alt: "Visa" },
  ],
  PSE: [{ src: "/pse.png", alt: "PSE" }],
  "Contra entrega": [{ src: "/contraentrega.png", alt: "Pago contra entrega" }],
};

export default function PagoPage() {
  const router = useRouter();
  const items = useCarrito();
  const datosEntrega = useDatosEntrega();
  const hoy = new Date();
  const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("Contra entrega");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function confirmarPedido(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!datosEntrega || items.length === 0) {
      setError("Faltan datos de entrega o productos en el carrito.");
      return;
    }

    setEnviando(true);
    try {
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          direccion: datosEntrega.direccion,
          barrio: datosEntrega.barrio,
          ciudad: datosEntrega.ciudad,
          telefono: datosEntrega.telefono,
          fecha_entrega: datosEntrega.fecha_entrega,
          metodoPago,
          items: items.map((item) => ({
            id_producto: item.id_producto,
            cantidad: item.cantidad,
            tamaño: item.tamaño,
          })),
        }),
      });
      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "No fue posible guardar el pedido.";
        setError(message);
        return;
      }

      const pedidoId =
        typeof data === "object" &&
        data !== null &&
        "id_pedido" in data &&
        typeof data.id_pedido === "number"
          ? data.id_pedido
          : null;
      if (!pedidoId) {
        setError("El servidor no devolvió el número del pedido.");
        return;
      }

      try {
        guardarCarrito([]);
      } catch (storageError) {
        console.error("No se pudo vaciar el carrito después del pedido", storageError);
      }
      router.replace(`/checkout/confirmacion?pedido=${pedidoId}`);
    } catch (requestError) {
      console.error("Error al crear el pedido", requestError);
      setError("No fue posible guardar el pedido. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="checkout-page pago-page">
      <div className="checkout-header">
        <Link href="/" className="checkout-logo">CheeseHaus</Link>
        <div className="checkout-stepper">
          <div className="checkout-step completado">
            <div className="checkout-step-numero">✓</div>
            <span className="checkout-step-label">Carrito</span>
          </div>
          <div className="checkout-step-linea" />
          <div className="checkout-step completado">
            <div className="checkout-step-numero">✓</div>
            <span className="checkout-step-label">Verificación</span>
          </div>
          <div className="checkout-step-linea" />
          <div className="checkout-step activo">
            <div className="checkout-step-numero">3</div>
            <span className="checkout-step-label">Confirmación</span>
          </div>
        </div>
      </div>
      <div className="checkout-separador-titulo" />

      <div className="checkout-container">
        <form className="pago-contenido" onSubmit={confirmarPedido}>
          <h1 className="checkout-titulo">Método de pago</h1>
          <p className="checkout-seccion-titulo">
            Selecciona el método que usarás al recibir el pedido
          </p>
          {error && <p className="checkout-error" role="alert">{error}</p>}

          {(["Tarjeta", "PSE", "Contra entrega"] as const).map((metodo) => (
            <label
              className={`pago-opcion ${metodoPago === metodo ? "activo" : ""}`}
              key={metodo}
            >
              <span>{metodo}</span>
              <div className="pago-opcion-acciones">
                <input
                  type="radio"
                  name="metodo"
                  value={metodo}
                  checked={metodoPago === metodo}
                  onChange={() => setMetodoPago(metodo)}
                />
                <div className="pago-logos" aria-hidden="true">
                  {logosPorMetodo[metodo].map((logo) => (
                    <img key={logo.src} src={logo.src} alt={logo.alt} />
                  ))}
                </div>
              </div>
            </label>
          ))}
          {metodoPago === "Tarjeta" && (
            <section className="pago-tarjeta-campos" aria-label="Datos simulados de tarjeta">
              <h2 className="checkout-seccion-titulo">Datos de tarjeta</h2>
              <p role="note">
                Simulación: usa datos ficticios. No se realizará ningún cobro ni
                se guardarán o enviarán los datos de la tarjeta.
              </p>
              <div className="checkout-campo">
                <label htmlFor="titular-tarjeta">Nombre del titular</label>
                <input
                  id="titular-tarjeta"
                  name="titularTarjeta"
                  type="text"
                  autoComplete="off"
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="Como aparece en la tarjeta"
                />
              </div>
              <div className="checkout-campo">
                <label htmlFor="numero-tarjeta">Número de tarjeta</label>
                <input
                  id="numero-tarjeta"
                  name="numeroTarjeta"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  minLength={13}
                  maxLength={19}
                  pattern="[0-9]{13,19}"
                  title="Ingresa entre 13 y 19 dígitos, sin espacios."
                  placeholder="13 a 19 dígitos"
                />
              </div>
              <div className="pago-fila">
                <div className="checkout-campo">
                  <label htmlFor="vencimiento-tarjeta">Vencimiento</label>
                  <input
                    id="vencimiento-tarjeta"
                    name="vencimientoTarjeta"
                    type="month"
                    autoComplete="off"
                    min={mesActual}
                    required
                  />
                </div>
                <div className="checkout-campo">
                  <label htmlFor="codigo-tarjeta">CVV / CVC</label>
                  <input
                    id="codigo-tarjeta"
                    name="codigoTarjeta"
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    required
                    minLength={3}
                    maxLength={4}
                    pattern="[0-9]{3,4}"
                    title="Ingresa 3 o 4 dígitos."
                    placeholder="3 o 4 dígitos"
                  />
                </div>
              </div>
            </section>
          )}
          <p role="note">
            El pago es una simulación. El pedido se guardará con estado pendiente
            y no se realizará ningún cobro.
          </p>

          <div className="pago-resumen-acciones">
            <button
              className="boton-atras-pago"
              type="button"
              onClick={() => router.back()}
            >
              ← Atrás
            </button>
            <button
              className="pagar-pago"
              type="submit"
              disabled={enviando || !datosEntrega || items.length === 0}
            >
              {enviando ? "Guardando pedido..." : "Confirmar pedido"}
            </button>
          </div>
        </form>

        <aside className="checkout-resumen">
          {items.length === 0 ? (
            <p>Tu carrito está vacío. <Link href="/productos">Ver productos</Link></p>
          ) : (
            <OrderSummary items={items} />
          )}
        </aside>
      </div>
    </div>
  );
}
