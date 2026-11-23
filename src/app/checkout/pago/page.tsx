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
  const { items } = useCarrito();
  const datosEntrega = useDatosEntrega();
  const hoy = new Date();
  const fechaActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("Tarjeta");
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
            Selecciona el método de pago
          </p>
          {error && <p className="checkout-error" role="alert">{error}</p>}

          <section
            className={`pago-opcion pago-opcion-tarjeta ${metodoPago === "Tarjeta" ? "activo" : ""}`}
            aria-label="Pago con tarjeta"
          >
            <div className="pago-opcion-header">
              <label className="pago-opcion-titulo" htmlFor="metodo-tarjeta">
                Tarjeta débito o crédito
              </label>
              <div className="pago-logos" aria-hidden="true">
                {logosPorMetodo.Tarjeta.map((logo) => (
                  <img key={logo.src} src={logo.src} alt="" />
                ))}
              </div>
              <input
                id="metodo-tarjeta"
                className="pago-metodo-radio"
                type="radio"
                name="metodo"
                value="Tarjeta"
                aria-label="Tarjeta"
                checked={metodoPago === "Tarjeta"}
                onChange={() => setMetodoPago("Tarjeta")}
              />
            </div>

            {metodoPago === "Tarjeta" && (
              <div
                className="pago-tarjeta-campos"
                aria-label="Datos simulados de tarjeta"
              >
                <p className="pago-simulacion-nota" role="note">
                  Simulación, usa datos ficticios, no se realizará ningún cobro
                  ni se guardarán o enviarán los datos de la tarjeta.
                </p>
                <div className="checkout-campo">
                  <label htmlFor="numero-tarjeta">Número de la tarjeta</label>
                  <input
                    id="numero-tarjeta"
                    name="numeroTarjeta"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    required
                    minLength={13}
                    maxLength={23}
                    pattern="[0-9]{4} ?[0-9]{4} ?[0-9]{4} ?[0-9]{1,7}"
                    title="Ingresa entre 13 y 19 dígitos, con o sin espacios."
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div className="checkout-campo">
                  <label htmlFor="titular-tarjeta">Propietario de la tarjeta</label>
                  <input
                    id="titular-tarjeta"
                    name="titularTarjeta"
                    type="text"
                    autoComplete="off"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Ingrese el nombre del propietario"
                  />
                </div>
                <div className="pago-fila">
                  <div className="checkout-campo">
                    <label htmlFor="vencimiento-tarjeta">Fecha de expiración</label>
                    <input
                      id="vencimiento-tarjeta"
                      name="vencimientoTarjeta"
                      type="date"
                      autoComplete="off"
                      min={fechaActual}
                      required
                    />
                  </div>
                  <div className="checkout-campo">
                    <label htmlFor="codigo-tarjeta">CCV</label>
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
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {(["PSE", "Contra entrega"] as const).map((metodo) => (
            <label
              className={`pago-opcion ${metodoPago === metodo ? "activo" : ""}`}
              key={metodo}
            >
              <span>{metodo}</span>
              <div className="pago-opcion-acciones">
                <div className="pago-logos" aria-hidden="true">
                  {logosPorMetodo[metodo].map((logo) => (
                    <img key={logo.src} src={logo.src} alt={logo.alt} />
                  ))}
                </div>
                <input
                  className="pago-metodo-radio"
                  type="radio"
                  name="metodo"
                  value={metodo}
                  checked={metodoPago === metodo}
                  onChange={() => setMetodoPago(metodo)}
                />
              </div>
            </label>
          ))}
          <p className="pago-simulacion-nota" role="note">
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
              {enviando ? "Guardando pedido..." : "Confirmar pago"}
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
