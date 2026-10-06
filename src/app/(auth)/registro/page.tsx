//Pagina de Registro
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import "../auth.css";

export default function RegistroPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [cargando, setCargando] = useState(false);

  async function handleRegistro() {
    setError("");

    setCargando(true);

    try {
      const response = await fetch("/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return;
      }

      console.log("Usuario creado", data);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.log("Error al registrar usuario", error);
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-overlay">
        <div className="auth-card-registro">
          <h1 className="auth-titulo">Registrarse</h1>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-fila">
            <div className="auth-campo">
              <input
                type="text"
                placeholder="Nombres"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="auth-campo">
              <input
                type="text"
                placeholder="Apellidos"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
          </div>

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
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="auth-boton-principal-registro"
            onClick={handleRegistro}
            disabled={cargando}
          >
            {cargando ? "Registrando..." : "Registrarme"}
          </button>
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
