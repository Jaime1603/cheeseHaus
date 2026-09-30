"use client";

import "./carrito.css";
import ProductoCard from "@/components/productos/productoCard";
import { useEffect, useState } from "react";
import Link from "next/link";

const itemsIniciales = [
  {
    id: 1,
    nombre: "Red Velvet",
    precio: 30000,
    cantidad: 1,
    tamaño: "6 porciones",
    imagen: "/redvelvet.png",
  },
];

const relacionados = [
  {
    id: 1,
    nombre: "Torta Red Velvet",
    precio: 25000,
    imagen: "/redvelvet.png",
  },
  {
    id: 2,
    nombre: "CheeseCake",
    precio: 20000,
    imagen: "/cheesecakes.png",
  },
  {
    id: 3,
    nombre: "Brookie",
    precio: 20000,
    imagen: "/brookie.png",
  },

  {
    id: 4,
    nombre: "Brownie con helado",
    precio: 20000,
    imagen: "/brookie.png",
  },

  {
    id: 5,
    nombre: "Cheesecake de Maracuya",
    precio: 20000,
    imagen: "/cheesecakes.png",
  },

  {
    id: 6,
    nombre: "Brownie con helado",
    precio: 20000,
    imagen: "/brookie.png",
  },
];

const visibles = 3;
const costo_envio = 5000;

export default function Carrito() {
  const [items, setItems] = useState(itemsIniciales);

  const [posicion, setPosicion] = useState(0);

  function cambiarCantidad(id: number, delta: number) {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
          : item,
      ),
    );
  }

  function eliminarItem(id: number) {
    setItems(items.filter((item) => item.id !== id));
  }

  const subTotal = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const [visibles, setVisibles] = useState(3);

  useEffect(() => {
    function actualizarVisibles() {
      if (window.innerWidth <= 480) {
        setVisibles(2);
      } else {
        setVisibles(3);
      }
    }

    actualizarVisibles();

    window.addEventListener("resize", actualizarVisibles);

    return () => {
      window.removeEventListener("resize", actualizarVisibles);
    };
  }, []);

  const total = subTotal + costo_envio;

  const puedeRetroceder = posicion > 0;

  const puedeAvanzar = posicion < relacionados.length - visibles;

  function avanzar() {
    if (puedeAvanzar) setPosicion(posicion + 1);
  }

  function retroceder() {
    if (puedeRetroceder) setPosicion(posicion - 1);
  }

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
            <span>Producto</span>
            <span>Tamaño</span>
            <span>Cantidad</span>
            <span>Precio</span>
          </div>

          {items.length === 0 ? (
            // Si el carrito está vacío mostramos un mensaje
            <div className="carrito-vacio">
              <p>Tu carrito está vacío</p>
              <Link href="/productos" className="carrito-vacio-link">
                Ver productos
              </Link>
            </div>
          ) : (
            // Si hay items los mostramos
            items.map((item) => (
              <div key={item.id} className="carrito-item">
                {/* Imagen y nombre */}
                <div className="carrito-item-producto">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="carrito-item-imagen"
                  />
                  <span className="carrito-item-nombre">{item.nombre}</span>
                </div>

                {/* Tamaño */}
                <span className="carrito-item-tamaño">{item.tamaño}</span>

                {/* Contador de cantidad */}
                <div className="carrito-item-cantidad">
                  <button
                    className="carrito-cantidad-btn"
                    onClick={() => cambiarCantidad(item.id, -1)}
                  >
                    -
                  </button>
                  <span>{item.cantidad}</span>
                  <button
                    className="carrito-cantidad-btn"
                    onClick={() => cambiarCantidad(item.id, 1)}
                  >
                    +
                  </button>
                </div>

                {/* Precio y botón eliminar */}
                <div className="carrito-item-precio-col">
                  <span className="carrito-item-precio">
                    $ {(item.precio * item.cantidad).toLocaleString("es-CO")}
                    {/* Precio total del item = precio unitario * cantidad */}
                  </span>
                  <button
                    className="carrito-item-eliminar"
                    onClick={() => eliminarItem(item.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Columna derecha — resumen del pedido */}
        <div className="carrito-resumen">
          <h2 className="carrito-resumen-titulo">Total del pedido</h2>

          <div className="carrito-resumen-fila">
            <span>Subtotal</span>
            <span>$ {subTotal.toLocaleString("es-CO")}</span>
          </div>

          <div className="carrito-resumen-fila">
            <span>Envío</span>
            <span>$ {costo_envio.toLocaleString("es-CO")}</span>
          </div>

          <div className="carrito-resumen-separador" />

          <div className="carrito-resumen-fila total">
            <span>Total</span>
            <span>$ {total.toLocaleString("es-CO")}</span>
          </div>

          <Link
            href="/checkout/verificacion"
            className="carrito-boton-verificar"
          >
            Verificar
          </Link>
        </div>
      </div>

      <div className="carrito-separador"></div>

      {/* Carrusel de productos relacionados */}
      <div className="carrito-relacionados">
        <h2 className="carrito-relacionados-titulo">
          También podría interesarte
        </h2>

        <div className="carrito-carrusel">
          <button
            className={`carrito-flecha ${!puedeRetroceder ? "desactivado" : ""}`}
            onClick={retroceder}
          >
            ←
          </button>

          <div className="carrito-carrusel-ventana">
            <div
              className="carrito-carrusel-track"
              style={{
                transform: `translateX(calc(-${posicion} * (100% / ${visibles} + 0.5rem)))`,
              }}
            >
              {relacionados.map((relacionado) => (
                <div key={relacionado.id} className="carrito-carrusel-item">
                  <ProductoCard
                    id={relacionado.id}
                    nombre={relacionado.nombre}
                    precio={relacionado.precio}
                    imagen={relacionado.imagen}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className={`carrito-flecha ${!puedeAvanzar ? "desactivado" : ""}`}
            onClick={avanzar}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
