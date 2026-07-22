// LISTA DE PRODUCTOS

import Link from "next/link";
import "./productos.css";
import ProductoCard from "@/components/productos/productoCard";

const productos = [
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

  {
    id: 7,
    nombre: "Brownie con helado",
    precio: 20000,
    imagen: "/redvelvet.png",
  },

  {
    id: 8,
    nombre: "Brownie con helado",
    precio: 20000,
    imagen: "/brookie.png",
  },
];

export default function ProductosPage() {
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
        <div className="productos-grid">
          {productos.map((producto) => (
            <ProductoCard
              key={producto.id}
              id={producto.id}
              nombre={producto.nombre}
              precio={producto.precio}
              imagen={producto.imagen}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
