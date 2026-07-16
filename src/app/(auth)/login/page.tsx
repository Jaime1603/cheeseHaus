// Pagina De Login

import Link from "next/link";
import "../auth.css";

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-overlay">
        <div className="auth-card">
          <h1 className="auth-titulo">Iniciar Sesión</h1>
          <div className="auth-campo">
            <input type="email" placeholder="Email" />
          </div>
          <div className="auth-campo">
            <input type="password" placeholder="Password" />
          </div>
          <div className="auth-link-texto">
            <Link href="#">¿Olvidaste tu contraseña?</Link>
          </div>
          <button className="auth-boton-principal">Iniciar Sesión</button>
          <div className="auth-link-texto">
            <Link href="/registro">Registrarme</Link>
          </div>
          <div className="auth-separador">
            <span> ó </span>
          </div>

          <button className="auth-boton-redes">
            <img src="/google.svg" alt="" />
            <span>Continua con Google</span>
          </button>
          <button className="auth-boton-redes">
            <img src="/facebook.svg" alt="" />
            <span>Continua con Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
}
