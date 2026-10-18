"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronDown, UserRound } from "lucide-react";

export default function NavbarAccount({
  userName,
}: {
  userName: string | null;
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  if (!userName) {
    return (
      <Link className="navbar-icon" href="/login" aria-label="Iniciar sesión">
        <UserRound size={25} strokeWidth={1.5} color="black" />
      </Link>
    );
  }

  return (
    <div className="navbar-account">
      <button
        className="navbar-account-trigger"
        type="button"
        aria-expanded={menuAbierto}
        aria-controls="navbar-account-menu"
        onClick={() => setMenuAbierto((abierto) => !abierto)}
      >
        <span>Hola, {userName}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {menuAbierto && (
        <div className="navbar-account-menu" id="navbar-account-menu">
          <Link href="/mi-perfil" onClick={() => setMenuAbierto(false)}>
            Mi perfil
          </Link>
          <Link href="/mis-pedidos" onClick={() => setMenuAbierto(false)}>
            Mis pedidos
          </Link>
          <button
            type="button"
            onClick={() => signOut({ redirectTo: "/" })}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
