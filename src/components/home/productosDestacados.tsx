"use client";

import { useState, useEffect } from "react";
import ProductoCard from "../productos/productoCard";
import "./productosDestacados.css";

interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  imagen_url: string;
}

export default function ProductosDestacados() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data.slice(0, 3)))
      .catch(() => setProductos([]));
  }, []);

  if (productos.length === 0) return null;

  return (
    <section className="destacados">
      <div className="destacados-container">
        <h2 className="destacados-titulo">
          Encuentra el regalo o gusto
          <br />
          <span>
            {" "}
            perfecto para cualquier <br />
            situación
          </span>
        </h2>

        <div className="destacados-grid">
          {productos.map((producto) => (
            <ProductoCard
              key={producto.id_producto}
              id={producto.id_producto}
              nombre={producto.nombre_producto}
              precio={producto.precio}
              imagen={producto.imagen_url}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
