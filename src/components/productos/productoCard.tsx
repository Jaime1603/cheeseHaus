import Link from "next/link";
import "./productoCard.css";

interface ProductoCardProps {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
}

export default function ProductoCard({
  id,
  nombre,
  precio,
  imagen,
}: ProductoCardProps) {
  return (
    <Link href={`/producto/${id}`} className="producto-card">
      <div className="producto-imagen-container">
        <img src={imagen} alt={nombre} className="producto-imagen" />
      </div>

      <div className="producto-info">
        <span className="producto-nombre">{nombre}</span>
        <span className="producto-precio">
          $ {precio.toLocaleString("es-CO")}
        </span>
      </div>
    </Link>
  );
}
