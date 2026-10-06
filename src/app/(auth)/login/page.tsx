// Pagina De Login
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import Link from "next/link";
import "../auth.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleLogin() {
    setError("");

    setCargando(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (email.length === 0 || password.length === 0) {
        setError("Email y contraseña son obligatorios");
        return;
      }

      if (result?.error) {
        setError("Email o contraseña incorrecta");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.log("Error al iniciar sesión", error);
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-overlay">
        <div className="auth-card">
          <h1 className="auth-titulo">Iniciar Sesión</h1>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-campo">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-campo">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="auth-link-texto">
            <Link href="/registro">¿Olvidaste tu contraseña?</Link>
          </div>
          <button
            className="auth-boton-principal"
            onClick={handleLogin}
            disabled={cargando}
          >
            {cargando ? "Iniciando Sesión..." : "Iniciar Sesión"}
          </button>

          <div className="auth-link-texto">
            <Link href="/registro">Registrarme</Link>
          </div>
          <div className="auth-separador">
            <span> ó </span>
          </div>

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
  );
}
