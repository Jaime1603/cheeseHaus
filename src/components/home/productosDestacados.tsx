import ProductoCard from "../productos/productoCard";
import "./productosDestacados.css";

const productosEjemplo = [
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
];

export default function ProductosDestacados() {
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
          {productosEjemplo.map((producto) => (
            <ProductoCard
              key={producto.id}
              id={producto.id}
              nombre={producto.nombre}
              precio={producto.precio}
              imagen={producto.imagen}
              // Le pasamos los datos al componente como props
              // ProductoCard se encarga de renderizarlos
            />
          ))}
        </div>
      </div>
    </section>
  );
}
