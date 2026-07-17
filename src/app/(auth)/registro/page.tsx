//Pagina de Registro

import Link from "next/link";

import "../auth.css";

export default function RegistroPage() {
  return (
    <div className="auth-page">
      <div className="auth-overlay">
        <div className="auth-card-registro">
          <h1 className="auth-titulo">Registrarse</h1>

          <div className="auth-fila">
            <div className="auth-campo">
              <input type="text" placeholder="Nombres" />
            </div>

            <div className="auth-campo">
              <input type="text" placeholder="Apellidos" />
            </div>
          </div>

          <div className="auth-campo">
            <input type="email" placeholder="Email" />
          </div>

          <div className="auth-campo">
            <input type="password" placeholder="Contraseña" />
          </div>

          <button className="auth-boton-principal-registro">Registrarme</button>
          <div className="auth-link-texto">
            ¿Ya tienes una cuenta?
            <br />
            <Link href="/login">Inicia Sesión</Link>
          </div>

          <div className="auth-separador">
            <span>ó</span>
          </div>

          <div className="auth-fila-boton">
            <button className="auth-boton-redes">
              <img src="/google.svg" alt="Google" />
              <span>Continua con Google</span>
            </button>
            <button className="auth-boton-redes">
              <img src="/facebook.svg" alt="Facebook" />
              <span>Continua con Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
