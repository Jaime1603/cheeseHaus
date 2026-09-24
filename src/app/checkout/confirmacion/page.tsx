"use client";

import Link from "next/link";
import "./confirmacion.css";
import "../verificacion/verificacion.css";

const pedido = {
  numeroOrden: "14526523",
  fecha: "18 Dic 2026",
  metodoPago: "Transferencia bancaria",
  cliente: {
    nombre: "Maria Paula Hernandez",
    correo: "hernandez.medina.maria12@gmail.com",
    cedula: "1109543297",
    telefono: "3128076425",
  },
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

export default function ConfirmacionPage() {
  return (
    <div className="confirmacion-page">
      <div className="checkout-header">
        <Link href="/" className="checkout-logo">
          CheeseHaus
        </Link>

        <div className="checkout-stepper">
          <div className="checkout-step completado">
            <div className="checkout-step-numero">✓</div>
            <span className="checkout-step-label"> Carrito </span>
          </div>

          <div className="checkout-step-linea"></div>

          <div className="checkout-step completado">
            <div className="checkout-step-numero">✓</div>
            <span className="checkout-step-label"> Verificación </span>
          </div>

          <div className="checkout-step-linea"></div>

          <div className="checkout-step completado">
            <div className="checkout-step-numero">✓</div>
            <span className="checkout-step-label"> Confirmación </span>
          </div>
        </div>
      </div>

      <div className="checkout-separador-titulo"></div>

      <div className="confirmacion-header">
        <h2 className="confirmacion-info-titulo">Pedido Confirmado</h2>
        <div className="confirmacion-check">✓</div>
        <h1 className="confirmacion-info-titulo">¡Gracias por tu compra!</h1>
        <p className="confirmacion-info-orden">
          Orden No. 14526523 | 18 Dic 2026
        </p>
      </div>

      <div className="confirmacion-container">
        <div className="confirmacion-resumen"></div>
      </div>

      <div className="confirmacion-acciones">
        <Link href="/" className="boton-atras-confirmacion">
          ← Volver al inicio
        </Link>

        <Link href="/productos" className="boton-continuar-comprando">
          Continuar Comprando
        </Link>
      </div>
    </div>
  );
}
