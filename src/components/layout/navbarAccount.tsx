"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronDown, UserRound } from "lucide-react";

export default function NavbarAccount({
  userName,
  isAdmin,
}: {
  userName: string | null;
  isAdmin: boolean;
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuAbierto) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setMenuAbierto(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [menuAbierto]);

  if (!userName) {
    return (
      <Link className="navbar-icon" href="/login" aria-label="Iniciar sesión">
        <UserRound size={25} strokeWidth={1.5} color="black" />
      </Link>
    );
  }

  return (
    <div className="navbar-account" ref={accountRef}>
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
          {!isAdmin && (
            <Link href="/mis-pedidos" onClick={() => setMenuAbierto(false)}>
              Mis pedidos
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" onClick={() => setMenuAbierto(false)}>
              Regresar al panel
            </Link>
          )}
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
