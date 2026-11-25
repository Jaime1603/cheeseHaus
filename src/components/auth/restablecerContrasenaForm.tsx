"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function RestablecerContrasenaForm({
  token,
}: {
  token: string;
}) {
  const [password, setPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMensaje("");

    if (!token) {
      setError("El enlace de recuperación no es válido.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmacion) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);
    try {
      const response = await fetch("/api/auth/restablecer-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "No fue posible cambiar la contraseña.");
        return;
      }

      setMensaje(data.message);
      setPassword("");
      setConfirmacion("");
    } catch (requestError) {
      console.error("Error al restablecer la contraseña", requestError);
      setError("No fue posible procesar la solicitud. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-overlay">
        <div className="auth-card">
          <h1 className="auth-titulo">Nueva contraseña</h1>
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

          {mensaje ? (
            <Link href="/login" className="auth-boton-principal">
              Iniciar sesión
            </Link>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="auth-campo">
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  aria-label="Nueva contraseña"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <div className="auth-campo">
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  aria-label="Confirmar contraseña"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={confirmacion}
                  onChange={(event) => setConfirmacion(event.target.value)}
                />
              </div>
              <button
                className="auth-boton-principal"
                type="submit"
                disabled={cargando}
              >
                {cargando ? "Guardando..." : "Cambiar contraseña"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
