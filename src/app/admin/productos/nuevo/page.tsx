"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

export default function NuevoProductoPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [tamaño, setTamaño] = useState("");
  const [activo, setActivo] = useState(true);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data));
  }, []);

  async function handleCrear() {
    if (
      !nombre.trim() ||
      !precio ||
      !descripcion ||
      !ingredientes ||
      !categoriaId
    ) {
      setError("Todos los campos obligatorios deben estar llenos");
      return;
    }

    setCargando(true);
    setError("");

    const res = await fetch("/api/admin/productos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre_producto: nombre,
        descripcion,
        precio: parseFloat(precio),
        ingredientes,
        imagen_url: imagenUrl || null,
        tamaño: tamaño || null,
        id_categoria: parseInt(categoriaId),
        activo,
      }),
    });

    if (res.ok) {
      router.push("/admin/productos"); //se redirige a la lista de productos despues de crear
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Error al crear el producto");
    }
    setCargando(false);
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-titulo"> Crear Producto </h1>
          <p className="admin-subtitulo">
            {" "}
            Completa los campos para crear un producto
          </p>
        </div>
        {/*<Link href="/admin/productos" className="admin-boton-secundario">
          Volver
        </Link>*/}
      </div>

      <div className="admin-form-card">
        <h2 className="admin-form-titulo"> Crear producto </h2>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-form-fila">
          <div className="admin-campo">
            <label> Nombre del producto </label>
            <input
              type="text"
              placeholder="ej: Torta de chocolate"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="admin-campo">
            <label> Categoria </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
            >
              <option value="">Selecciona una categoria</option>
              {categorias.map((categoria) => (
                <option
                  key={categoria.id_categoria}
                  value={categoria.id_categoria}
                >
                  {categoria.nombre_categoria}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-form-fila">
          <div className="admin-campo">
            <label> Precio </label>
            <input
              type="number"
              placeholder="Ej: 25000"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>
          <div className="admin-campo">
            <label> Tamaño (Opcional) </label>
            <input
              type="text"
              placeholder="ej: 12 porciones"
              value={tamaño}
              onChange={(e) => setTamaño(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-campo">
          <label> Descripcion </label>
          <textarea
            placeholder="Descripcion del producto"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
          />
        </div>

        <div className="admin-campo">
          <label> Ingredientes </label>
          <textarea
            placeholder="Ej: Harina, azucar, huevos, etc"
            value={ingredientes}
            onChange={(e) => setIngredientes(e.target.value)}
            rows={4}
          />
        </div>

        <div className="admin-campo">
          <label> URL de imagen (Opcional)</label>
          <input
            type="text"
            placeholder="ej: https://ejemplo.com/imagen.jpg"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
          />
        </div>

        <div className="admin-campo-check">
          <input
            type="checkbox"
            id="activo"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
          />
          <label htmlFor="activo">
            {" "}
            Producto activo (visible en el catalogo){" "}
          </label>
        </div>

        <div className="admin-form-botones">
          <Link href="/admin/productos" className="admin-boton-secundario">
            Cancelar
          </Link>
          <button
            className="admin-boton-principal"
            onClick={handleCrear}
            disabled={cargando}
          >
            {cargando ? "Creando..." : "Crear Producto"}
          </button>
        </div>
      </div>
    </div>
  );
}
