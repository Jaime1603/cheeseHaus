"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  obtenerSnapshotCarrito,
  obtenerSnapshotEntrega,
  parsearCarrito,
  suscribirseAEntrega,
  suscribirseAlCarrito,
} from "@/lib/carrito";
import { isRecord } from "@/lib/validation";

export interface DatosEntrega {
  direccion: string;
  barrio: string;
  ciudad: string;
  telefono: string;
  fecha_entrega: string;
  contacto: DatosContacto | null;
}

export interface DatosContacto {
  nombre: string;
  apellido: string;
  telefono: string;
  cedula: string;
  correo: string;
}

export function useCarrito() {
  const snapshot = useSyncExternalStore(
    suscribirseAlCarrito,
    obtenerSnapshotCarrito,
    () => "",
  );
  return useMemo(() => parsearCarrito(snapshot), [snapshot]);
}

export function useDatosEntrega() {
  const snapshot = useSyncExternalStore(
    suscribirseAEntrega,
    obtenerSnapshotEntrega,
    () => "",
  );

  return useMemo<DatosEntrega | null>(() => {
    if (!snapshot) {
      return null;
    }

    try {
      const value: unknown = JSON.parse(snapshot);
      if (
        isRecord(value) &&
        typeof value.direccion === "string" &&
        typeof value.barrio === "string" &&
        typeof value.ciudad === "string" &&
        typeof value.telefono === "string" &&
        typeof value.fecha_entrega === "string"
      ) {
        const contacto = value.contacto;
        const datosContacto =
          isRecord(contacto) &&
          typeof contacto.nombre === "string" &&
          typeof contacto.apellido === "string" &&
          typeof contacto.telefono === "string" &&
          typeof contacto.cedula === "string" &&
          typeof contacto.correo === "string"
            ? {
                nombre: contacto.nombre,
                apellido: contacto.apellido,
                telefono: contacto.telefono,
                cedula: contacto.cedula,
                correo: contacto.correo,
              }
            : null;

        return {
          direccion: value.direccion,
          barrio: value.barrio,
          ciudad: value.ciudad,
          telefono: value.telefono,
          fecha_entrega: value.fecha_entrega,
          contacto: datosContacto,
        };
      }

      return null;
    } catch (error) {
      console.error("Los datos guardados de entrega no son válidos", error);
      return null;
    }
  }, [snapshot]);
}