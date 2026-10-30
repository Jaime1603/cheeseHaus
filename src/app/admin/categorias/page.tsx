"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string;
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCategorias();
  }, []);

  async function cargarCategorias() {
    const res = await fetch("/api/admin/categorias");
    const data = await res.json();
    setCategorias(data);
  }

  async function handleCrear() {
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setCargando(true);
    setError("");

    const res = await fetch("/api/admin/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_categoria: nombre, descripcion }),
    });

    if (res.ok) {
      cargarCategorias();
      setNombre("");
      setDescripcion("");
    } else {
      const data = await res.json();
      setError(data.error);
    }
    setCargando(false);
  }

  async function handleEliminar(id: number) {
    if (!confirm("¿Estas seguro de eliminar esta categoria?")) return;

    const res = await fetch("/api/admin/categorias", {
      method: "DELETE",
    });

    if (res.ok) cargarCategorias();
  }

  async function handleEditar(id: number) {
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setCargando(true);

    const res = await fetch("/api/admin/categorias", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_categoria: nombre, descripcion }),
    });

    if (res.ok) {
      cargarCategorias();
      setNombre("");
      setDescripcion("");
      setEditandoId(null);
    }
    setCargando(false);
  }

  function activarEdicion(categoria: Categoria) {
    setEditandoId(categoria.id_categoria);
    setNombre(categoria.nombre_categoria);
    setDescripcion(categoria.descripcion || "");
  }

  return (
    <div>
      <h1 className="admin-titulo"> Categorias</h1>
      <p className="admin-subtitulo"> Gestiona las categorias de productos </p>

      <div className="admin-form-card">
        <h2 className="admin-form-titulo">
          {editandoId ? "Editar categoria" : "Nueva categoria"}
        </h2>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-form-fila">
          <div className="admin-campo">
            <label> Nombre </label>
            <input
              type="text"
              placeholder="ej: Tortas, cheesecake"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="admin-campo">
            <label> Descripcion (Opcional)</label>
            <input
              type="text"
              placeholder="Descripcion breve"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
        </div>
        <div className="admin-form-botones">
          {editandoId && (
            <button
              className="admin-boton-secundario"
              onClick={() => {
                setEditandoId(null);
                setNombre("");
                setDescripcion("");
              }}
            >
              Cancelar
            </button>
          )}
          <button
            className="admin-boton-principal"
            onClick={() =>
              editandoId ? handleEditar(editandoId) : handleCrear()
            }
            disabled={cargando}
          >
            {cargando
              ? "Guardando..."
              : editandoId
                ? "Guardar Cambios"
                : "Crear Categoria"}
          </button>
        </div>
      </div>

      <div className="admin-tabla-card">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th> ID </th>
              <th> Nombre </th>
              <th> Descripcion </th>
              <th> Acciones </th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id_categoria}>
                <td>{categoria.id_categoria}</td>
                <td>{categoria.nombre_categoria}</td>
                <td>{categoria.descripcion}</td>
                <td>
                  <div className="admin-acciones">
                  <button
                    className="admin-boton-editar"
                    onClick={() => activarEdicion(categoria)}
                  >
                    Editar
                  </button>
                  <button
                    className="admin-boton-eliminar"
                    onClick={() => handleEliminar(categoria.id_categoria)}
                  >
                    Eliminar
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
