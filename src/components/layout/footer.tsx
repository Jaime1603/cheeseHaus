import Link from "next/link";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Columna 1 */}
        <div className="footer-brand">
          <span className="footer-logo"> CheeseHaus | </span>
          <span className="footer-tagline"> Reposteria Artesanal </span>
        </div>

        {/* Columna 2 */}
        <div className="footer-nav">
          <Link href="#"> Productos</Link>
          <Link href="#"> Quienes Somos</Link>
          <Link href="#"> Contactanos</Link>
        </div>

        {/* Columna 3 */}
        <div className="footer-legal ">
          <Link href="#">Terminos de envio</Link>
          <Link href="#">Politicas de privacidad</Link>
          <Link href="#">Terminos y Condiciones</Link>
        </div>

        {/* Columna 4 */}
        <div className="footer-contact">
          <span>Cali, Colombia</span>
          <span>Lun-Sab 9am - 6pm</span>
          <span>3128076425</span>
          <span>atencion_cliente@CheeseHaus.com</span>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="footer-bottom">
        <span className="footer-copyright">
          Todos los derechos reservados CheeseHaus © 2026
        </span>
        <div className="footer-social">
          <a href="https://wa.me/573128076425" target="_blank" rel="noopener noreferrer">
            <img src="/whatsapp.svg" alt="link de whatsapp" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src="/instagram.svg" alt="link de instagram" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src="/tiktok.svg" alt="link de tiktok" />
          </a>
        </div>
      </div>
    </footer>
  );
}
