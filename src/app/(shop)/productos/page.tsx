// LISTA DE PRODUCTOS

import Link from "next/link";
import "./productos.css";
import ProductoCard from "@/components/productos/productoCard";

async function getProductos() {
  const res = await fetch("http:localhost:3000/api/productos", {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }
  return res.json();
}

export default async function ProductosPage() {
  const productos = await getProductos();

  return (
    <div className="productos-page">
      <div className="productos-banner">
        <div className="productos-banner-overlay">
          <div className="productos-banner-container">
            <h1 className="productos-banner-titulo">
              Todos nuestros productos
            </h1>

            <p className="productos-banner-texto">
              ¿No te decides? Conoce todos nuestros productos e inspírate a
              probarlos todos.
            </p>

            <p className="productos-banner-texto">
              Puedes ordenar online y lo llevaremos hasta tu casa.
            </p>

            <p className="productos-banner-texto">
              ¡DESCUBRE LA MAGIA DE CHEESEHAUS!
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb --> indica la pagina en la que estamos */}
      <div className="productos-breadcrumb">
        <Link href="/">Inicio</Link>
        <span>{" > "}</span>
        <Link href="/productos">Productos</Link>
      </div>

      {/* barra de ordenamiento */}
      <div className="productos-toolbar">
        <select className="productos-orden">
          <option value="Relevancia">Ordenar por: Relevancia</option>
          <option value="Precio-asc">Precio: Menor a Mayor</option>
          <option value="Precio-desc">Precio: Mayor a Menor</option>
          <option value="Nombre">Nombre: A-Z</option>
        </select>
      </div>

      <div className="productos-container">
        {productos.length === 0 ? (
          <div className="productos-vacio">
            <p> No hay productos disponibles</p>
          </div>
        ) : (
          <div className="productos-grid">
            {productos.map(
              (producto: {
                id_producto: number;
                nombre_producto: string;
                precio: number;
                imagen_url: string | null;
              }) => (
                <ProductoCard
                  key={producto.id_producto}
                  id={producto.id_producto}
                  nombre={producto.nombre_producto}
                  precio={producto.precio}
                  imagen={
                    producto.imagen_url ||
                    "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400"
                  }
                  // Si no tiene imagen usamos una por defecto
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
