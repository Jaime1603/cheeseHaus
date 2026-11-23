"use client";

import { createContext, useState, useEffect, useContext } from "react";

export interface itemCarrito {
  id_producto: string;
  nombre: string;
  precio: number;
  imagen: string;
  tamaño: string | null;
  cantidad: number;
}

interface CarritoContextType {
  items: itemCarrito[];
  agregarItem: (item: itemCarrito) => void;
  eliminarItem: (id_producto: string, tamaño: string | null) => void;
  cambiarCantidad: (
    id_producto: string,
    tamaño: string | null,
    delta: number,
  ) => void;
  vaciarCarrito: () => void;
  subtotal: number;
  envio: number;
  total: number;
  totalItems: number;
}

const CLAVE_STORAGE = "cheesehaus-carrito";

const COSTO_ENVIO = 5000;

const CarritoContext = createContext<CarritoContextType | null>(null);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<itemCarrito[]>([]);

  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      if (guardado) setItems(JSON.parse(guardado));
    } catch {}
    setCargando(true);
  }, []);

  useEffect(() => {
    if (!cargando) return;

    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
  }, [items, cargando]);

  function agregarItem(nuevo: itemCarrito) {
    setItems((actuales) => {
      // Usamos la forma función de setItems para trabajar con el
      // valor más reciente y no con uno desactualizado.

      const existe = actuales.some(
        (i) => i.id_producto === nuevo.id_producto && i.tamaño === nuevo.tamaño,
      );
      if (existe) {
        return actuales.map((i) =>
          i.id_producto === nuevo.id_producto && i.tamaño === nuevo.tamaño
            ? { ...i, cantidad: i.cantidad + nuevo.cantidad }
            : i,
        );
      }
      return [...actuales, nuevo];
    });
  }

  function cambiarCantidad(
    id_producto: string,
    tamaño: string | null,
    delta: number,
  ) {
    // delta es +1 o -1.
    setItems((actuales) =>
      actuales.map((i) =>
        i.id_producto === id_producto && i.tamaño === tamaño
          ? { ...i, cantidad: Math.max(1, i.cantidad + delta) }
          : i,
      ),
    );
  }

  function eliminarItem(id_producto: string, tamaño: string | null) {
    setItems((actuales) =>
      actuales.filter(
        (i) => !(i.id_producto === id_producto && i.tamaño === tamaño),
      ),
    );
  }
  function vaciarCarrito() {
    setItems([]);
    
  }

  // VALORES CALCULADOS // 
  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);
  const envio = items.length > 0 ? COSTO_ENVIO : 0;
  const total = subtotal + envio;

    return (
    <CarritoContext.Provider
      value={{
        items, agregarItem, cambiarCantidad, eliminarItem,
        vaciarCarrito, subtotal, envio, total, totalItems,
      }}
    >
      {children}
    </CarritoContext.Provider>
  )
}

// ── Hook para usar el carrito en cualquier componente ──
export function useCarrito() {
  const contexto = useContext(CarritoContext)

  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider")
    // Si olvidas envolver la app con el Provider, este mensaje
    // te lo dice de inmediato.
  }

  return contexto
  
}
