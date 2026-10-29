// DETALLE DEL PRODUCTO

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductoCard from "@/components/productos/productoCard";
import "./detalle.css";
import Link from "next/link";

interface Producto {
  id_producto: number;
  nombre_producto: string;
  descripcion: string;
  precio: number;
  ingredientes: string;
  imagen_url: string;
  tamaño: string | null;
  categoria: {
    nombre_categoria: string;
  };
}

interface ProductoRelacionado {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  imagen_url: string;
}

const visibles = 3;

export default function DetalleProducto() {
  const params = useParams();

  const id = params.slug as string;

  const [producto, setProducto] = useState<Producto | null>(null);
  // null mientras carga, después tiene el producto real

  const [relacionados, setRelacionados] = useState<ProductoRelacionado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [tabActivo, setTabActivo] = useState<
    "ingredientes" | "caracteristicas"
  >("ingredientes");
  const [cantidad, setCantidad] = useState(1);
  const [tamaño, setTamaño] = useState("");
  const [posicion, setPosicion] = useState(0);

  const [visibles, setVisibles] = useState(0);

  useEffect(() => {
    async function cargarProducto() {
      try {
        // Cargamos el producto y todos los productos
        // en paralelo para los relacionados
        const [resProducto, resRelacionados] = await Promise.all([
          fetch(`/api/productos/${id}`),
          fetch("/api/productos"),
        ]);

        if (!resProducto.ok) {
          setError("Producto no encontrado");
          return;
        }

        const dataProducto = await resProducto.json();
        const dataRelacionados = await resRelacionados.json();

        setProducto(dataProducto);

        if (dataProducto.tamaño) {
          // Si el producto tiene tamaños los separamos
          // por coma y seleccionamos el primero por defecto
          setTamaño(dataProducto.tamaño.split(",")[0].trim());
        }

        setRelacionados(
          dataRelacionados.filter(
            (p: ProductoRelacionado) =>
              p.id_producto !== dataProducto.id_producto,
            // Excluimos el producto actual de los relacionados
          ),
        );
      } catch (error) {
        setError("Error al cargar el producto");
      } finally {
        setCargando(false);
      }
    }

    cargarProducto();
  }, [id]);
  // El array [id] significa que este efecto se ejecuta
  // cada vez que el id de la URL cambie

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

  const puedeRetroceder = posicion > 0;
  const puedeAvanzar = posicion < relacionados.length - visibles;

  function avanzar() {
    if (puedeAvanzar) setPosicion(posicion + 1);
  }

  function retroceder() {
    if (puedeRetroceder) setPosicion(posicion - 1);
  }

  if (cargando) {
    return (
      <div className="detalle-page">
        <div className="detalle-cargando">
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="detalle-page">
        <div className="detalle-error">
          <p>{error || "Producto no encontrado"}</p>
          <Link href="/productos">← Volver a productos</Link>
        </div>
      </div>
    );
  }

  // ── Renderizado del producto ──
  const tamaños = producto.tamaño
    ? producto.tamaño.split(",").map((t) => t.trim())
    : [];
  // Convertimos el string "6 Porciones, 8 Porciones, 12 Porciones"
  // en un array ["6 Porciones", "8 Porciones", "12 Porciones"]

  return (
    <div className="detalle-page">
      <div className="detalle-breadcrumb">
        <Link href="/">Inicio</Link>
        <span>{" > "}</span>
        <Link href="/productos">Productos</Link>
        <span>{" > "} </span>
        <span>{producto.nombre_producto}</span>
      </div>

      <div className="detalle-container">
        {/* Columna izquierda */}
        <div className="detalle-imagen">
          <img
            src={producto.imagen_url}
            alt={producto.nombre_producto}
            className="detalle-imagen"
          />
        </div>

        {/* Columna derecha */}
        <div className="detalle-info">
          <h1 className="detalle-nombre">{producto.nombre_producto}</h1>
          <p className="detalle-descripcion">{producto.descripcion}</p>

          <p className="detalle-precio">$ {producto.precio.toLocaleString()}</p>

          <div className="detalle-separador"></div>

          {tamaños.length > 0 && (
            <div className="detalle-tamaño-seccion">
              <span className="detalle-label">Tamaño:</span>
              <div className="detalle-tamaños">
                {tamaños.map((t) => (
                  <label key={t} className="detalle-tamaño-opcion">
                    <input
                      type="radio"
                      name="tamaño"
                      value={t}
                      checked={tamaño === t}
                      onChange={() => setTamaño(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          )}

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
            <p>{producto.descripcion}</p>
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
                <div
                  key={relacionado.id_producto}
                  className="detalle-carrusel-item"
                >
                  <ProductoCard
                    id={relacionado.id_producto}
                    nombre={relacionado.nombre_producto}
                    precio={relacionado.precio}
                    imagen={
                      relacionado.imagen_url ||
                      "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400"
                    }
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
