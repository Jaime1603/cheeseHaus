import Link from "next/link";
import { connection } from "next/server";
import { productoService } from "@/services/productosService";
import ProductoGrid from "@/components/productos/productoGrid";
import "./productos.css";

export default async function ProductosPage() {
  await connection();
  const resultado = await productoService.getActivos();
  if (!resultado.exito) {
    throw new Error(resultado.error);
  }
  const productos = resultado.datos;

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

      <div className="productos-container">
        {productos.length === 0 ? (
          <div className="productos-vacio">
            <p> No hay productos disponibles</p>
          </div>
        ) : (
          <ProductoGrid productos={productos} />
        )}
      </div>
    </div>
  );
}
