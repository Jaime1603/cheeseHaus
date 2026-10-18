import Link from "next/link";
import { auth } from "@/lib/auth";
import NavbarAccount from "./navbarAccount";
import NavbarNavigation from "./navbarNavigation";
import "./navbar.css";
import { Handbag } from "lucide-react";

export default async function Navbar() {
  const session = await auth();
  const userName = session?.user
    ? session.user.name?.trim() || session.user.email || "Usuario"
    : null;

  return (
    <header className="Navbar-header">
      <div className="Navbar-topbar">Espacio para anuncios</div>
      <nav className="Navbar-container" aria-label="Navegación principal">
        <Link href="/" className="Navbar-logo">
          CheeseHaus
        </Link>

        <NavbarNavigation />

        <div className="navbar-icons">
          <Link className="navbar-icon" href="/carrito" aria-label="Carrito">
            <Handbag size={25} strokeWidth={1.5} color="black" />
          </Link>
          <NavbarAccount userName={userName} />
        </div>
      </nav>
    </header>
  );
}
