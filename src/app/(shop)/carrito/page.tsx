"use client";

import "./carrito.css";
import ProductoCard from "@/components/productos/productoCard";
import { useEffect, useState } from "react";
import Link from "next/link";
import { guardarCarrito } from "@/lib/carrito";
import { useCarrito } from "@/hooks/useCarrito";

interface ProductoRelacionado {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  imagen_url: string | null;
  tamaño: string | null;
}

const VISIBLES = 3;
const IMAGEN_DEFECTO =
  "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400";

export default function CarritoPage() {
  const { items, cambiarCantidad, eliminarItem, subtotal, envio, total } =
    useCarrito();
  // Ya no hay datos hardcodeados ni useState para los items.
  // El estado vive en el contexto.

  const [relacionados, setRelacionados] = useState<ProductoRelacionado[]>([]);
  const [posicion, setPosicion] = useState(0);

  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => setRelacionados(data))
      .catch(() => setRelacionados([]));
  }, []);

  const puedeRetroceder = posicion > 0;
  const puedeAvanzar = posicion < relacionados.length - VISIBLES;

  return (
    <div className="carrito-page">
      <div className="carrito-banner">
        <div className="carrito-banner-overlay">
          <h1 className="carrito-banner-titulo">Carrito</h1>
        </div>
      </div>

      <div className="carrito-container">
        <div className="carrito-items">
          <div className="carrito-tabla-header">
            <span>Item</span>
            <span>Tamaño</span>
            <span>Cantidad</span>
            <span>Precio</span>
          </div>

          {items.length === 0 ? (
            <div className="carrito-vacio">
              <p>Tu carrito está vacío</p>
              <Link href="/productos" className="carrito-vacio-link">
                Ver productos
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id_producto}-${item.tamaño ?? "unico"}`}
                // La key también combina producto y tamaño. Con solo
                // id_producto habría keys repetidas.
                className="carrito-item"
              >
                <div className="carrito-item-producto">
                  <img
                    src={item.imagen_url}
                    alt={item.nombre_producto}
                    className="carrito-item-imagen"
                  />
                  <span className="carrito-item-nombre">
                    {item.nombre_producto}
                  </span>
                </div>

                <span className="carrito-item-tamaño">
                  {item.tamaño || "—"}
                </span>

                <div className="carrito-item-cantidad">
                  <button
                    className="carrito-cantidad-btn"
                    onClick={() =>
                      cambiarCantidad(item.id_producto, item.tamaño, -1)
                    }
                  >
                    −
                  </button>
                  <span>{item.cantidad}</span>
                  <button
                    className="carrito-cantidad-btn"
                    onClick={() =>
                      cambiarCantidad(item.id_producto, item.tamaño, 1)
                    }
                  >
                    +
                  </button>
                </div>

                <div className="carrito-item-precio-col">
                  <span className="carrito-item-precio">
                    $ {(item.precio * item.cantidad).toLocaleString("es-CO")}
                  </span>
                  <button
                    className="carrito-item-eliminar"
                    onClick={() => eliminarItem(item.id_producto, item.tamaño)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="carrito-resumen">
          <h2 className="carrito-resumen-titulo">Total del pedido</h2>

          <div className="carrito-resumen-fila">
            <span>Subtotal</span>
            <span>$ {subtotal.toLocaleString("es-CO")}</span>
          </div>

          <div className="carrito-resumen-fila">
            <span>Envío</span>
            <span>$ {envio.toLocaleString("es-CO")}</span>
          </div>

          <div className="carrito-resumen-separador" />

          <div className="carrito-resumen-fila total">
            <span>Total</span>
            <span>$ {total.toLocaleString("es-CO")}</span>
          </div>

          {items.length > 0 ? (
            <Link
              href="/checkout/verificacion"
              className="carrito-boton-verificar"
            >
              Verificar
            </Link>
          ) : (
            <span
              className="carrito-boton-verificar"
              style={{ opacity: 0.4, cursor: "not-allowed" }}
            >
              Verificar
            </span>
          )}
          {/* Con el carrito vacío no dejamos avanzar al checkout. */}
        </div>
      </div>

      {relacionados.length > 0 && (
        <div className="carrito-relacionados">
          <h2 className="carrito-relacionados-titulo">
            También podría interesarte
          </h2>

          <div className="carrito-carrusel">
            <button
              className={`carrito-flecha ${!puedeRetroceder ? "desactivado" : ""}`}
              onClick={() => puedeRetroceder && setPosicion(posicion - 1)}
            >
              ‹
            </button>

            <div className="carrito-carrusel-ventana">
              <div
                className="carrito-carrusel-track"
                style={{
                  transform: `translateX(calc(-${posicion} * (100% / ${VISIBLES} + 0.5rem)))`,
                }}
              >
                {relacionados.map((p) => (
                  <div key={p.id_producto} className="carrito-carrusel-item">
                    <ProductoCard
                      id={p.id_producto}
                      nombre={p.nombre_producto}
                      precio={p.precio}
                      imagen={p.imagen_url || IMAGEN_DEFECTO}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`carrito-flecha ${!puedeAvanzar ? "desactivado" : ""}`}
              onClick={() => puedeAvanzar && setPosicion(posicion + 1)}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
