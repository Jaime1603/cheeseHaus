"use client";

import { useState } from "react";
import Link from "next/link";
import "../verificacion/verificacion.css";
import "./pago.css";

const pedido = {
  items: [
    {
      id: 1,
      nombre: "Red Velvet",
      precio: 30000,
      cantidad: 1,
      tamaño: "6x",
      imagen: "/redvelvet.png",
    },
  ],
  subTotal: 30000,
  envio: 5000,
  total: 35000,
};

export default function PagoPage() {
  const [metodoPago, setMetodoPago] = useState<
    "tarjeta" | "pse" | "contraentrega"
  >("tarjeta");

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link href="/" className="checkout-logo">
          CheeseHaus
        </Link>

        <div className="checkout-stepper">
          <div className="checkout-step completado">
            <div className="checkout-step-numero">✓</div>
            <span className="checkout-step-label">Carrito</span>
          </div>

          <div className="checkout-step-linea"></div>

          <div className="checkout-step completado">
            <div className="checkout-step-numero">✓</div>
            <span className="checkout-step-label">Verificación</span>
          </div>

          <div className="checkout-step-linea"></div>

          <div className="checkout-step activo">
            <div className="checkout-step-numero">3</div>
            <span className="checkout-step-label">Confirmación</span>
          </div>
        </div>
      </div>

      <div className="checkout-separador-titulo"></div>

      <div className="checkout-container">
        <div className="checkout-contenido">
          <h1 className="checkout-titulo">Metodo De Pago</h1>
          <h2 className="checkout-seccion-titulo">
            Seleccione el metodo de pago
          </h2>
          <div
            className={`pago-opcion ${metodoPago === "tarjeta" ? "activo" : ""}`}
            onClick={() => setMetodoPago("tarjeta")}
          >
            <div className="pago-opcion-header">
              <span>Tarjeta debito o credito</span>
              <div className="pago-logos">
                <img src="/mastercard.svg" alt="Mastercard" />
                <img src="/visa.svg" alt="Visa" />
              </div>
              <input
                type="radio"
                name="metodo"
                checked={metodoPago === "tarjeta"}
                onChange={() => setMetodoPago("tarjeta")}
              />
            </div>

            {metodoPago === "tarjeta" && (
              <div className="pago-tarjeta-campos">
                <div className="checkout-campo">
                  <label>Numero de la tarjeta</label>
                  <input type="text" placeholder="0000 0000 0000 0000" />
                </div>

                <div className="checkout-campo">
                  <label>Propietario de la tarjeta</label>
                  <input
                    type="text"
                    placeholder="Ingrese el nombre del propietario"
                  />
                </div>
                <div className="pago-fila">
                  <div className="checkout-campo">
                    <label>Fecha de expiración</label>
                    <input type="date" />
                  </div>

                  <div className="checkout-campo">
                    <label>CCV</label>
                    <input type="text" placeholder="123" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className={`pago-opcion ${metodoPago === "pse" ? "activo" : ""}`}
            onClick={() => setMetodoPago("pse")}
          >
            <div className="pago-opcion-header">
              <span>Pago PSE</span>
              <div className="pago-logos">
                <img src="/pse.png" alt="" />
              </div>
              <input
                type="radio"
                name="metodo"
                checked={metodoPago === "pse"}
                onChange={() => setMetodoPago("pse")}
              />
            </div>
          </div>

          <div
            className={`pago-opcion ${
              metodoPago === "contraentrega" ? "activo" : ""
            }`}
            onClick={() => setMetodoPago("contraentrega")}
          >
            <div className="pago-opcion-header">
              <span>Pago Contra Entrega</span>
              <div className="pago-logos">
                <img src="/contraentrega.png" alt="" />
              </div>
              <input
                type="radio"
                name="metodo"
                checked={metodoPago === "contraentrega"}
                onChange={() => setMetodoPago("contraentrega")}
              />
            </div>
          </div>
        </div>

        <div className="checkout-resumen">
          <div className="checkout-resumen-inner">
            {pedido.items.map((item) => (
              <div className="checkout-resumen-item" key={item.id}>
                <div className="checkout-resumen-imagen">
                  <img src={item.imagen} alt={item.nombre} />
                </div>
                <div className="checkout-resumen-info">
                  <span className="checkout-resumen-nombre">{item.nombre}</span>
                  <span className="checkout-resumen-cantidad">
                    {item.tamaño}
                  </span>
                </div>
                <span className="checkout-resumen-precio">
                  ${item.precio.toLocaleString("es-CO")}
                </span>
              </div>
            ))}

            <div className="checkout-resumen-fila">
              <span>Subtotal</span>
              <span>${pedido.subTotal.toLocaleString("es-CO")}</span>
            </div>

            <div className="checkout-resumen-fila">
              <span>Envio</span>
              <span>${pedido.envio.toLocaleString("es-CO")}</span>
            </div>

            <div className="checkout-resumen-separador" />

            <div className="checkout-resumen-fila">
              <span className="checkout-resumen-total">Total</span>
              <span className="checkout-resumen-total">
                ${pedido.total.toLocaleString("es-CO")}
              </span>
            </div>

            <div className="pago-resumen-acciones">
              <button
                className="boton-atras-pago"
                onClick={() => window.history.back()}
              >
                ← Atras
              </button>

              <Link href="/checkout/confirmacion" className="pagar-pago">
                Confirmar Pago
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
