// Pagina de inicio

import Hero from "@/components/home/hero";
import ProductosDestacados from "@/components/home/productosDestacados";
import Contacto from "@/components/home/contacto";

function Home() {
  return (
    <div>
      <Hero />
      <ProductosDestacados />
      <Contacto />
    </div>
  );
}

export default Home;
