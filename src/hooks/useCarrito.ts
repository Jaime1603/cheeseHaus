"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  guardarCarrito,
  leerCarrito,
  obtenerSnapshotCarrito,
  obtenerSnapshotEntrega,
  parsearCarrito,
  suscribirseAEntrega,
  suscribirseAlCarrito,
  type ItemCarrito,
} from "@/lib/carrito";
import { isRecord } from "@/lib/validation";

const COSTO_ENVIO = 5000;

interface ContactoEntrega {
  nombre: string;
  apellido: string;
  telefono: string;
  cedula: string;
  correo: string;
}

export interface DatosEntregaCheckout {
  direccion: string;
  barrio: string;
  ciudad: string;
  telefono: string;
  fecha_entrega: string;
  contacto: ContactoEntrega;
}

function parsearDatosEntrega(snapshot: string): DatosEntregaCheckout | null {
  if (!snapshot) {
    return null;
  }

  let value: unknown;
  try {
    value = JSON.parse(snapshot);
  } catch (error) {
    console.error("No se pudieron interpretar los datos de entrega", error);
    return null;
  }

  if (!isRecord(value) || !isRecord(value.contacto)) {
    console.error("Los datos guardados de entrega no tienen un formato válido");
    return null;
  }

  const contacto = value.contacto;
  if (
    typeof value.direccion !== "string" ||
    typeof value.barrio !== "string" ||
    typeof value.ciudad !== "string" ||
    typeof value.telefono !== "string" ||
    typeof value.fecha_entrega !== "string" ||
    typeof contacto.nombre !== "string" ||
    typeof contacto.apellido !== "string" ||
    typeof contacto.telefono !== "string" ||
    typeof contacto.cedula !== "string" ||
    typeof contacto.correo !== "string"
  ) {
    console.error("Los datos guardados de entrega no tienen un formato válido");
    return null;
  }

  return {
    direccion: value.direccion,
    barrio: value.barrio,
    ciudad: value.ciudad,
    telefono: value.telefono,
    fecha_entrega: value.fecha_entrega,
    contacto: {
      nombre: contacto.nombre,
      apellido: contacto.apellido,
      telefono: contacto.telefono,
      cedula: contacto.cedula,
      correo: contacto.correo,
    },
  };
}

export function useCarrito() {
  const snapshot = useSyncExternalStore(
    suscribirseAlCarrito,
    // 1) Cómo suscribirse: React la llama una vez y nos avisa
    //    cada vez que se dispara el evento del carrito.

    obtenerSnapshotCarrito,
    // 2) Cómo leer el valor actual en el navegador. Devuelve el
    //    texto crudo. Como es un string, React lo compara por valor
    //    y solo vuelve a renderizar si el contenido cambió.

    () => "",
    // 3) Valor en el servidor, donde no existe localStorage.
    //    Así el primer render coincide con el del navegador
    //    y no hay error de hidratación.
  );

  const items = useMemo(() => parsearCarrito(snapshot), [snapshot]);
  // Convertimos el texto en array solo cuando el texto cambia.

  function agregarItem(nuevo: ItemCarrito) {
    const actuales = leerCarrito();
    // Leemos el carrito justo en el momento de la acción, no el
    // "items" del render, que podría estar desactualizado.

    const existe = actuales.some(
      (i) => i.id_producto === nuevo.id_producto && i.tamaño === nuevo.tamaño,
    );

    guardarCarrito(
      existe
        ? actuales.map((i) =>
            i.id_producto === nuevo.id_producto && i.tamaño === nuevo.tamaño
              ? { ...i, cantidad: i.cantidad + nuevo.cantidad }
              : i,
          )
        : [...actuales, nuevo],
    );
    // guardarCarrito escribe en localStorage y dispara el evento
    // que avisa a todos los componentes suscritos.
  }

  function cambiarCantidad(id_producto: number, tamaño: string, delta: number) {
    guardarCarrito(
      leerCarrito().map((i) =>
        i.id_producto === id_producto && i.tamaño === tamaño
          ? { ...i, cantidad: Math.max(1, i.cantidad + delta) }
          : i,
      ),
    );
  }

  function eliminarItem(id_producto: number, tamaño: string) {
    guardarCarrito(
      leerCarrito().filter(
        (i) => !(i.id_producto === id_producto && i.tamaño === tamaño),
      ),
    );
  }

  function vaciarCarrito() {
    guardarCarrito([]);
  }

  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);
  const envio = items.length > 0 ? COSTO_ENVIO : 0;
  const total = subtotal + envio;

  return {
    items,
    agregarItem,
    cambiarCantidad,
    eliminarItem,
    vaciarCarrito,
    subtotal,
    envio,
    total,
    totalItems,
  };
}

export function useDatosEntrega(): DatosEntregaCheckout | null {
  const snapshot = useSyncExternalStore(
    suscribirseAEntrega,
    obtenerSnapshotEntrega,
    () => "",
  );

  return useMemo(() => parsearDatosEntrega(snapshot), [snapshot]);
}
