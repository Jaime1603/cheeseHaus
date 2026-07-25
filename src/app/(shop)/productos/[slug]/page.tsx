// DETALLE DEL PRODUCTO

"use client";

import { useState } from "react";
import ProductoCard from "@/components/productos/productoCard";
import "./detalle.css";
import Link from "next/link";

const producto = {
  id: 1,
  nombre: "Torta Red Velvet",
  descripcion: `Un clásico que conquista corazones. Su color rojo intenso 
    y su textura suave como terciopelo envuelven un relleno cremoso de 
    queso que aporta el balance perfecto.`,
  descripcion2: `Cada rebanada es una mezcla de pasión, dulzura y elegancia, 
    pensada para celebrar el amor, la amistad y los momentos especiales.`,
  precio: 40000,
  imagen: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600",
  ingredientes:
    "Harina, cacao, azúcar, huevos, suero de leche, vainilla, queso crema y mantequilla.",
  caracteristicas:
    "Bizcocho suave y aterciopelado, ligero sabor a cacao y equilibrio perfecto con cremosa cobertura de queso. Textura húmeda y sabor delicadamente dulce.",
  tamaños: ["6 Porciones", "8 Porciones", "12 Porciones"],
};

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

export default function DetalleProducto() {
  const [tabActivo, setTabActivo] = useState<
    "ingredientes" | "caracteristicas"
  >("ingredientes");

  const [posicion, setPosicion] = useState(0);

  const [cantidad, setCantidad] = useState(1);

  const [tamaño, setTamaño] = useState(producto.tamaños[0]);

  const puedeRetroceder = posicion > 0;
  const puedeAvanzar = posicion < relacionados.length - visibles;

  function avanzar() {
    if (puedeAvanzar) setPosicion(posicion + 1);
  }

  function retroceder() {
    if (puedeRetroceder) setPosicion(posicion - 1);
  }

  return (
    <div className="detalle-page">
      <div className="detalle-breadcrumb">
        <Link href="/">Inicio</Link>
        <span>{" > "}</span>
        <Link href="/productos">Productos</Link>
        <span>{" > "} </span>
        <span>{producto.nombre}</span>
      </div>

      <div className="detalle-container">
        {/* Columna izquierda */}
        <div className="detalle-imagen">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="detalle-imagen"
          />
        </div>

        {/* Columna derecha */}
        <div className="detalle-info">
          <h1 className="detalle-nombre">{producto.nombre}</h1>
          <p className="detalle-descripcion">{producto.descripcion}</p>
          <p className="detalle-descripcion">{producto.descripcion2}</p>
          <p className="detalle-precio">$ {producto.precio.toLocaleString()}</p>

          <div className="detalle-separador"></div>

          <div className="detalle-tamaño-seccion">
            <span className="detalle-label">Tamaño</span>
            <div className="detalle-tamaños">
              {producto.tamaños.map((t) => (
                <label key={t} className="detalle-tamaño-opcion">
                  <input
                    type="radio"
                    name="tamaño"
                    value={t}
                    checked={t === tamaño}
                    onChange={() => setTamaño(t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div className="detalle-cantidad-seccion">
            <span className="detalle-label">Cantidad:</span>
            <div className="detalle-cantidad">
              <button
                className="detalle-cantidad-btn"
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              >
                -
              </button>
              <span className="detalle-cantidad-valor">{cantidad}</span>
              <button
                className="detalle-cantidad-btn"
                onClick={() => setCantidad(cantidad + 1)}
              >
                +
              </button>
            </div>
          </div>

          <button className="detalle-boton-carrito">Añadir al Carrito</button>
        </div>
      </div>

      <div className="detalle-tabs-seccion">
        <div className="detalle-tabs">
          <button
            className={`detalle-tab ${tabActivo === "ingredientes" ? "activo" : ""}`}
            onClick={() => setTabActivo("ingredientes")}
          >
            Ingredientes
          </button>
          <button
            className={`detalle-tab ${tabActivo === "caracteristicas" ? "activo" : ""}`}
            onClick={() => setTabActivo("caracteristicas")}
          >
            Características
          </button>
        </div>
        <div className="detalle-tab-contenido">
          {tabActivo === "ingredientes" ? (
            <p>{producto.ingredientes}</p>
          ) : (
            <p>{producto.caracteristicas}</p>
          )}
        </div>
      </div>

      <div className="detalle-relacionados">
        <h2 className="detalle-relacionados-titulo">
          ¡También podría interesarte!
        </h2>

        <div className="detalle-carrusel">
          {/* Flecha izquierda */}
          <button
            className={`detalle-flecha ${!puedeRetroceder ? "desactivado" : ""}`}
            onClick={retroceder}
            disabled={!puedeRetroceder}
          >
            ←
          </button>

          <div className="detalle-carrusel-ventana">
            <div
              className="detalle-carrusel-track"
              style={{
                transform: `translateX(calc(-${posicion} * (100% / ${visibles} + 0.5rem)))`,
              }}
            >
              {relacionados.map((relacionado) => (
                <div key={relacionado.id} className="detalle-carrusel-item">
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

          {/* Flecha derecha */}
          <button
            className={`detalle-flecha ${!puedeAvanzar ? "desactivado" : ""}`}
            onClick={avanzar}
            disabled={!puedeAvanzar}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
