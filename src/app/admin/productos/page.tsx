"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  activo: boolean;
  imagen_url: string;
  categoria: {
    nombre_categoria: string;
  };
}

export default function ProductosAdminPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    setCargando(true);
    const res = await fetch("/api/admin/productos");
    const data = await res.json();
    setProductos(data);
    setCargando(false);
  }

  async function handleEliminar(id: number) {
    if (!confirm("¿Estas seguro de eliminar este producto?")) return;

    const res = await fetch(`/api/admin/productos/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      cargarProductos();
    }
  }

  async function toggleActivo(id: number, estadoActual: boolean) {
    const res = await fetch(`/api/admin/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !estadoActual }),
    });

    if (res.ok) {
      cargarProductos();
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-titulo">Productos</h1>
          <p className="admin-subtitulo">
            {" "}
            Gestiona los productos del catálogo{" "}
          </p>
        </div>
        <Link href="/admin/productos/nuevo" className="admin-boton-principal">
          + Nuevo Producto
        </Link>
      </div>

      {cargando ? (
        <p className="admin-cargando">Cargando productos... </p>
      ) : (
        <div className="admin-tabla-card">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th> ID </th>
                <th> Imagen </th>
                <th> Nombre </th>
                <th> Categoria </th>
                <th> Precio </th>
                <th> Activo </th>
                <th> Acciones </th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id_producto}>
                  <td>{producto.id_producto}</td>
                  <td>
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre_producto}
                      className="admin-tabla-imagen"
                    />
                  </td>
                  <td>{producto.nombre_producto}</td>
                  <td>{producto.categoria.nombre_categoria}</td>
                  <td>{producto.precio.toLocaleString("es-CO")}</td>
                  <td>
                    <button
                      className={`admin-toggle ${producto.activo ? "activo" : "inactivo"}`}
                      onClick={() =>
                        toggleActivo(producto.id_producto, !producto.activo)
                      }
                    >
                      {producto.activo ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="admin-tabla-acciones">
                    <Link
                      href={`/admin/productos/${producto.id_producto}`}
                      className="admin-boton-editar"
                    >
                      Editar
                    </Link>
                    <button
                      className="admin-boton-eliminar"
                      onClick={() => handleEliminar(producto.id_producto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-tabla-vacia">
                    No hay productos creados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
