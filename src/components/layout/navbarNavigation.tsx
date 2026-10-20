"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function NavbarNavigation() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    <>
      <button
        className="navbar-hamburger"
        type="button"
        aria-label={menuAbierto ? "Cerrar navegación" : "Abrir navegación"}
        aria-expanded={menuAbierto}
        onClick={() => setMenuAbierto((abierto) => !abierto)}
      >
        {menuAbierto ? (
          <X size={28} strokeWidth={1.5} color="black" />
        ) : (
          <Menu size={28} strokeWidth={1.5} color="black" />
        )}
      </button>

      <ul className={`navbar-links ${menuAbierto ? "activo" : ""}`}>
        <li>
          <Link href="/productos" onClick={cerrarMenu}>
            Productos
          </Link>
        </li>
        <li>
          <Link href="/quienes-somos" onClick={cerrarMenu}>
            ¿Quienes somos?
          </Link>
        </li>
        <li>
          <Link href="/#contacto" onClick={cerrarMenu}>
            Contacto
          </Link>
        </li>
      </ul>
    </>
  );
}
