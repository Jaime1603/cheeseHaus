import Link from "next/link";
import "./navbar.css";
import { UserRound, Handbag } from "lucide-react";

export default function Navbar() {
  return (
    <header className="Navbar-header">
      <div className="Navbar-topbar">Espacio para anuncios</div>
      <nav className="Navbar-container">
        <Link href="/" className="Navbar-logo">
          CheeseHaus
        </Link>

        {/*Menu de navegacion */}

        <ul className="navbar-links">
          <li>
            {" "}
            <Link href="/productos">Productos</Link>
          </li>

          <li>
            {" "}
            <Link href="/quienes-somos">¿Quienes somos?</Link>
          </li>

          <li>
            {" "}
            <Link href="/contacto">Contacto</Link>
          </li>
        </ul>

        <div className="navbar-icons">
          <Link className="navbar-icon" href="/carrito">
            <Handbag size={25} strokeWidth={1.5} color="black" />
          </Link>
          <Link className="navbar-icon" href="/login">
            <UserRound size={25} strokeWidth={1.5} color="black" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
