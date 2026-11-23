export interface ItemCarrito {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  cantidad: number;
  tamaño: string;
  imagen_url: string;
}

export const claveCarrito = "cheesehaus-carrito";
export const claveEntrega = "cheesehaus-entrega";
const eventoCarrito = "cheesehaus-carrito-cambio";
const eventoEntrega = "cheesehaus-entrega-cambio";

export function parsearCarrito(stored: string): ItemCarrito[] {
  if (!stored) {
    return [];
  }

  try {
    const value: unknown = JSON.parse(stored);
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter(
      (item): item is ItemCarrito =>
        typeof item === "object" &&
        item !== null &&
        Number.isInteger(item.id_producto) &&
        item.id_producto > 0 &&
        typeof item.nombre_producto === "string" &&
        typeof item.precio === "number" &&
        Number.isFinite(item.precio) &&
        Number.isInteger(item.cantidad) &&
        item.cantidad > 0 &&
        typeof item.tamaño === "string" &&
        typeof item.imagen_url === "string",
    );
  } catch (error) {
    console.error("No se pudo leer el carrito guardado", error);
    return [];
  }
}

export function obtenerSnapshotCarrito() {
  try {
    return localStorage.getItem(claveCarrito) ?? "";
  } catch (error) {
    console.error("No se pudo leer el carrito guardado", error);
    return "";
  }
}

export function suscribirseAlCarrito(onChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === claveCarrito) {
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(eventoCarrito, onChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(eventoCarrito, onChange);
  };
}

export function guardarCarrito(items: ItemCarrito[]) {
  try {
    localStorage.setItem(claveCarrito, JSON.stringify(items));
    window.dispatchEvent(new Event(eventoCarrito));
  } catch (error) {
    console.error("No se pudo guardar el carrito", error);
    throw error;
  }
}

export function leerCarrito() {
  return parsearCarrito(obtenerSnapshotCarrito());
}

export function obtenerSnapshotEntrega() {
  try {
    return sessionStorage.getItem(claveEntrega) ?? "";
  } catch (error) {
    console.error("No se pudieron leer los datos de entrega", error);
    return "";
  }
}

export function suscribirseAEntrega(onChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(eventoEntrega, onChange);
  return () => window.removeEventListener(eventoEntrega, onChange);
}

export function guardarDatosEntrega(value: string) {
  sessionStorage.setItem(claveEntrega, value);
  window.dispatchEvent(new Event(eventoEntrega));
}

export function limpiarDatosEntrega() {
  sessionStorage.removeItem(claveEntrega);
  window.dispatchEvent(new Event(eventoEntrega));
}
