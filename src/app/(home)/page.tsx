// Pagina de inicio

import Hero from "@/components/home/hero";
import ProductosDestacados from "@/components/home/productosDestacados";
import Contacto from "@/components/home/contacto";
import Link from "next/link";
import { auth } from "@/lib/auth";
import "./home.css";

async function Home() {
  const session = await auth();

  return (
    <div className="home-page">
      {session?.user?.rol === "ADMIN" && (
        <div className="home-admin-actions">
          <Link href="/admin">Regresar al panel</Link>
        </div>
      )}
      <Hero />
      <ProductosDestacados />
      <Contacto />
    </div>
  );
}

export default Home;
