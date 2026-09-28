"use client";

import { useState } from "react";
import Link from "next/link";
import "./Navbar.css";
import { UserRound, Handbag, Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <header className="Navbar-header">
      <div className="Navbar-topbar">Espacio para anuncios</div>
      <nav className="Navbar-container">
        <Link href="/" className="Navbar-logo" onClick={cerrarMenu}>
          CheeseHaus
        </Link>

        <button className="navbar-hamburger" onClick={toggleMenu}>
          {menuAbierto ? (
            <X size={28} strokeWidth={1.5} color="black" />
          ) : (
            <Menu size={28} strokeWidth={1.5} color="black" />
          )}
        </button>

        {/*Menu de navegacion */}

        <ul className={`navbar-links ${menuAbierto ? "activo" : ""}`}>
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
            <Link href="/#contacto">Contacto</Link>
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
