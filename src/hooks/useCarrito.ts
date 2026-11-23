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
        return {
          direccion: value.direccion,
          barrio: value.barrio,
          ciudad: value.ciudad,
          telefono: value.telefono,
          fecha_entrega: value.fecha_entrega,
        };
      }

      return null;
    } catch (error) {
      console.error("Los datos guardados de entrega no son válidos", error);
      return null;
    }
  }, [snapshot]);
}