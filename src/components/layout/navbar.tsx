import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import NavbarAccount from "./navbarAccount";
import NavbarNavigation from "./navbarNavigation";
import NavbarCart from "./navbarCart";
import "./navbar.css";

async function NavbarSession() {
  const session = await auth();
  const userName = session?.user
    ? session.user.name?.trim() || session.user.email || "Usuario"
    : null;

  return (
    <NavbarAccount
      userName={userName}
      isAdmin={session?.user?.rol === "ADMIN"}
    />
  );
}

export default function Navbar() {
  return (
    <header className="Navbar-header">
      <div className="Navbar-topbar">Espacio para anuncios</div>
      <nav className="Navbar-container" aria-label="Navegación principal">
        <Link href="/" className="Navbar-logo">
          CheeseHaus
        </Link>

        <NavbarNavigation />

        <div className="navbar-icons">
          <NavbarCart />
          <Suspense fallback={null}>
            <NavbarSession />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
