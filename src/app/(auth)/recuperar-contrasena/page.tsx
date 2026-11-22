"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { isValidEmail } from "@/lib/validation";
import "../auth.css";

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMensaje("");

    const correo = email.trim().toLowerCase();
    if (!isValidEmail(correo)) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    setCargando(true);
    try {
      const response = await fetch("/api/auth/recuperar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: correo }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "No fue posible procesar la solicitud");
        return;
      }

      setMensaje(data.message);
    } catch (error) {
      console.error("Error al solicitar recuperación de contraseña", error);
      setError("No fue posible procesar la solicitud. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-overlay">
        <div className="auth-card">
          <h1 className="auth-titulo">Recuperar contraseña</h1>
          <p>Ingresa el correo asociado a tu cuenta.</p>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}
          {mensaje && (
            <div className="auth-success" role="status">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-campo">
              <input
                type="email"
                placeholder="Email"
                aria-label="Correo electrónico"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <button
              className="auth-boton-principal"
              type="submit"
              disabled={cargando}
            >
              {cargando ? "Procesando..." : "Solicitar recuperación"}
            </button>
          </form>

          <div className="auth-link-texto">
            <Link href="/login">Volver a iniciar sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
