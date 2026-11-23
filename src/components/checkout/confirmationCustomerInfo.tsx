"use client";

import Link from "next/link";
import { useDatosEntrega } from "@/hooks/useCarrito";
import { limpiarDatosEntrega } from "@/lib/carrito";

export function ConfirmationContactCard() {
  const datos = useDatosEntrega();
  const contacto = datos?.contacto;

  return (
    <article className="confirmacion-tarjeta">
      <h2 className="confirmacion-tarjeta-titulo">Tu información</h2>
      {contacto ? (
        <div className="confirmacion-tarjeta-info">
          <p>Nombre: {contacto.nombre} {contacto.apellido}</p>
          <p>Cédula: {contacto.cedula}</p>
          <p>Teléfono: {contacto.telefono}</p>
          <p>Correo: {contacto.correo}</p>
        </div>
      ) : (
        <p role="status">No hay información de contacto para este pedido.</p>
      )}
    </article>
  );
}

function limpiarDatosCheckout() {
  try {
    limpiarDatosEntrega();
  } catch (error) {
    console.error("No se pudieron limpiar los datos de contacto", error);
  }
}

export function ConfirmationActions() {
  return (
    <div className="confirmacion-acciones">
      <Link
        href="/mis-pedidos"
        className="boton-atras-confirmacion"
        onClick={limpiarDatosCheckout}
      >
        Ver mis pedidos
      </Link>
      <Link
        href="/productos"
        className="boton-continuar-comprando"
        onClick={limpiarDatosCheckout}
      >
        Continuar comprando
      </Link>
    </div>
  );
}
