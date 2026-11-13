"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [tamaño, setTamaño] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [activo, setActivo] = useState(true);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categorias").then((res) => res.json()),
      fetch(`/api/admin/productos/${id}`).then((res) => res.json()),
    ]).then(([categoriasData, productoData]) => {
      setCategorias(categoriasData);
      setNombre(productoData.nombre_producto);
      setDescripcion(productoData.descripcion);
      setPrecio(productoData.precio.toString());
      setIngredientes(productoData.ingredientes);
      setImagenUrl(productoData.imagen_url);
      setTamaño(productoData.tamaño);
      setCategoriaId(productoData.id_categoria.toString());
      setActivo(productoData.activo);
    });
  }, [id]);

  async function handleEditar() {
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

    const res = await fetch(`/api/admin/productos/${id}`, {
      method: "PUT",
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
      router.push("/admin/productos"); // cuando se edite el producto redirige de nuevo a la pagina productos
    } else {
      const data = await res.json();
      setError(data.error || "Error al editar");
    }
    setCargando(false);
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-titulo">Editar producto</h1>
          <p className="admin-subtitulo">
            Modifica la informacion de este producto
          </p>
        </div>
        
      </div>

      <div className="admin-form-card">
        {error && <p className="admin-error"> {error}</p>}
        <div className="admin-form-fila">
          <div className="admin-campo">
            <label>Nombre del producto</label>
            <input
              type="text"
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
            <label>Precio *</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>
          <div className="admin-campo">
            <label>Tamaño (opcional)</label>
            <input
              type="text"
              value={tamaño}
              onChange={(e) => setTamaño(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-campo">
          <label>Descripción *</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
          />
        </div>

        <div className="admin-campo">
          <label>Ingredientes *</label>
          <textarea
            value={ingredientes}
            onChange={(e) => setIngredientes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="admin-campo">
          <label>URL de imagen (opcional)</label>
          <input
            type="text"
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
          <label htmlFor="activo">Producto activo</label>
        </div>

        <div className="admin-form-botones">
          <Link href="/admin/productos" className="admin-boton-secundario">
            Cancelar
          </Link>
          <button
            className="admin-boton-principal"
            onClick={handleEditar}
            
          >
            {cargando ? "Guardar Cambios" : "Guardando..."}
          </button>
        </div>
      </div>
    </div>
  );
}
