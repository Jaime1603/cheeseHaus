"use client";

import { useMemo, useState } from "react";
import ProductoCard from "@/components/productos/productoCard";
import type { ProductoConCategoria } from "@/services/productosService";

type OrdenProductos = "relevancia" | "nombre" | "precio-asc" | "precio-desc";

export default function ProductoGrid({
  productos,
}: {
  productos: ProductoConCategoria[];
}) {
  const [orden, setOrden] = useState<OrdenProductos>("relevancia");
  const [categoria, setCategoria] = useState("");

  const categorias = useMemo(
    () =>
      Array.from(
        new Map(
          productos.map((producto) => [
            producto.categoria.id_categoria,
            producto.categoria.nombre_categoria,
          ]),
        ),
      ).sort((a, b) => a[1].localeCompare(b[1], "es")),
    [productos],
  );

  const productosVisibles = useMemo(() => {
    const resultado = productos.filter(
      (producto) =>
        !categoria || producto.categoria.id_categoria.toString() === categoria,
    );

    switch (orden) {
      case "nombre":
        resultado.sort((a, b) =>
          a.nombre_producto.localeCompare(b.nombre_producto, "es", {
            sensitivity: "base",
          }),
        );
        break;
      case "precio-asc":
        resultado.sort((a, b) => a.precio - b.precio);
        break;
      case "precio-desc":
        resultado.sort((a, b) => b.precio - a.precio);
        break;
    }

    return resultado;
  }, [categoria, orden, productos]);

  function limpiarFiltros() {
    setCategoria("");
    setOrden("relevancia");
  }

  return (
    <>
      <div className="productos-toolbar">
        <label>
          <span className="visually-hidden">Ordenar productos</span>
          <select
            className="productos-orden"
            value={orden}
            onChange={(event) => {
              const value = event.target.value;
              if (
                value === "relevancia" ||
                value === "nombre" ||
                value === "precio-asc" ||
                value === "precio-desc"
              ) {
                setOrden(value);
              }
            }}
          >
            <option value="relevancia">Ordenar por: Relevancia</option>
            <option value="nombre">Nombre: A-Z</option>
            <option value="precio-asc">Precio: Menor a mayor</option>
            <option value="precio-desc">Precio: Mayor a menor</option>
          </select>
        </label>

        <label>
          <span className="visually-hidden">Filtrar por categoría</span>
          <select
            className="productos-categoria"
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(([id, nombre]) => (
              <option key={id} value={id.toString()}>
                {nombre}
              </option>
            ))}
          </select>
        </label>

        {(categoria || orden !== "relevancia") && (
          <button
            className="productos-limpiar"
            type="button"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {productosVisibles.length === 0 ? (
        <div className="productos-vacio">
          <p>No hay productos en esta categoría.</p>
        </div>
      ) : (
        <div className="productos-grid" aria-live="polite">
          {productosVisibles.map((producto) => (
            <ProductoCard
              key={producto.id_producto}
              id={producto.id_producto}
              nombre={producto.nombre_producto}
              precio={producto.precio}
              imagen={producto.imagen_url}
            />
          ))}
        </div>
      )}
    </>
  );
}
