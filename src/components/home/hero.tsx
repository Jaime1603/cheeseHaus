import Link from "next/link";
import "./hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">
            <span>Reposteria Artesanal</span>
            <span>Hecha con amor</span>
          </h1>

          <Link href="/productos" className="hero-button">
            Descubre Mas...
          </Link>
        </div>
      </div>
    </section>
  );
}
