// ── Tipo del item ──
export interface ItemCarrito {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  cantidad: number;
  tamaño: string;
  // Siempre string. Si el producto no tiene tamaños se guarda "".
  imagen_url: string;
  // Siempre string. Quien agregue el item debe usar una imagen
  // por defecto cuando la BD devuelva null (ver el detalle).
}

// ── Constantes ──
export const MAX_CANTIDAD = 50;
// Tope por item. Lo usan el botón "+" del detalle y el hook useCarrito.

export const claveCarrito = "cheesehaus-carrito";
export const claveEntrega = "cheesehaus-entrega";
// Nombres bajo los que se guarda cada dato en el navegador.

const eventoCarrito = "cheesehaus-carrito-cambio";
const eventoEntrega = "cheesehaus-entrega-cambio";
// Eventos propios. El evento "storage" del navegador solo avisa a OTRAS
// pestañas, no a la que hizo el cambio. Por eso disparamos uno nuestro.

// ═══════════════════════════════════════════
// CARRITO (localStorage: persiste al cerrar el navegador)
// ═══════════════════════════════════════════

export function parsearCarrito(stored: string): ItemCarrito[] {
  // Convierte el texto guardado en un array de items válidos.
  if (!stored) {
    return [];
    // Texto vacío: no hay carrito guardado.
  }

  try {
    const value: unknown = JSON.parse(stored);
    // "unknown" obliga a verificar el tipo antes de usar el valor.
    // Es más seguro que "any" porque lo guardado pudo ser alterado a mano.

    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter(
      (item): item is ItemCarrito =>
        // La firma "item is ItemCarrito" le dice a TypeScript que lo que
        // pase este filtro tiene la forma de un ItemCarrito.
        typeof item === "object" &&
        item !== null &&
        Number.isInteger(item.id_producto) &&
        item.id_producto > 0 &&
        typeof item.nombre_producto === "string" &&
        typeof item.precio === "number" &&
        Number.isFinite(item.precio) &&
        // isFinite descarta NaN e Infinity.
        Number.isInteger(item.cantidad) &&
        item.cantidad > 0 &&
        typeof item.tamaño === "string" &&
        typeof item.imagen_url === "string",
    );
    // Los items inválidos se descartan en silencio. Por eso el detalle
    // nunca debe guardar imagen_url como null.
  } catch (error) {
    console.error("No se pudo leer el carrito guardado", error);
    return [];
    // Si el JSON está dañado, partimos de un carrito vacío.
  }
}

export function obtenerSnapshotCarrito() {
  // Devuelve el texto crudo del carrito. React lo compara por valor
  // y solo vuelve a renderizar si el texto cambió.
  try {
    return localStorage.getItem(claveCarrito) ?? "";
    // getItem devuelve null si no existe. "?? ''" lo convierte en texto vacío.
  } catch (error) {
    console.error("No se pudo leer el carrito guardado", error);
    return "";
  }
}

export function suscribirseAlCarrito(onChange: () => void) {
  // useSyncExternalStore llama a esta función para enterarse de cambios.
  // "onChange" es el aviso que debemos disparar cuando el carrito cambie.
  if (typeof window === "undefined") {
    return () => {};
    // En el servidor no hay window. Devolvemos una función vacía.
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === claveCarrito) {
      onChange();
      // Cambio hecho desde OTRA pestaña.
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(eventoCarrito, onChange);
  // Cambio hecho desde ESTA pestaña, mediante nuestro evento propio.

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(eventoCarrito, onChange);
    // Función de limpieza: evita listeners duplicados al desmontar.
  };
}

export function guardarCarrito(items: ItemCarrito[]) {
  try {
    localStorage.setItem(claveCarrito, JSON.stringify(items));
    // localStorage solo guarda texto, por eso JSON.stringify.

    window.dispatchEvent(new Event(eventoCarrito));
    // Avisa a todos los componentes suscritos en esta pestaña.
  } catch (error) {
    console.error("No se pudo guardar el carrito", error);
    throw error;
    // Relanzamos el error para que quien llamó pueda mostrar un mensaje.
    // El detalle lo captura con try/catch.
  }
}

export function leerCarrito() {
  return parsearCarrito(obtenerSnapshotCarrito());
  // Lectura puntual. Úsala dentro de acciones (agregar, eliminar),
  // no en el render. Para renderizar usa el hook useCarrito.
}

// ═══════════════════════════════════════════
// DATOS DE ENTREGA (sessionStorage: se borra al cerrar la pestaña)
// ═══════════════════════════════════════════
// Guardan lo que el usuario escribe en la verificación para recuperarlo
// en el pago sin pedirlo otra vez. Es temporal a propósito.

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
  // sessionStorage no dispara "storage" entre pestañas, así que
  // solo escuchamos nuestro evento propio.

  return () => window.removeEventListener(eventoEntrega, onChange);
}

export function guardarDatosEntrega(value: string) {
  // Recibe un texto (normalmente un JSON.stringify del formulario).
  try {
    sessionStorage.setItem(claveEntrega, value);
    window.dispatchEvent(new Event(eventoEntrega));
  } catch (error) {
    console.error("No se pudieron guardar los datos de entrega", error);
    throw error;
  }
}

export function limpiarDatosEntrega() {
  // Se llama al confirmar el pedido para no dejar datos viejos.
  try {
    sessionStorage.removeItem(claveEntrega);
    window.dispatchEvent(new Event(eventoEntrega));
  } catch (error) {
    console.error("No se pudieron limpiar los datos de entrega", error);
  }
  // Aquí no relanzamos el error. Si falla la limpieza, no debe
  // romper el flujo de confirmación del pedido.
}
