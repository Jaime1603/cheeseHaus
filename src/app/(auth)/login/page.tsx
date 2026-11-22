// Pagina De Login
"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import SocialAuthButtons from "@/components/auth/socialAuthButtons";
import { isValidEmail } from "@/lib/validation";
import "../auth.css";

function OAuthCallbackError() {
  const searchParams = useSearchParams();
  if (!searchParams.get("error")) {
    return null;
  }

  return (
    <div className="auth-error" role="alert">
      No se pudo completar el inicio de sesión con el proveedor.
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("El correo electrónico y la contraseña son obligatorios");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    setCargando(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Email o contraseña incorrecta");
        return;
      }

      router.refresh();

      const session = await getSession();
      if (session?.user?.rol === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
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

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}
          <Suspense fallback={null}>
            <OAuthCallbackError />
          </Suspense>

          <form onSubmit={handleLogin} noValidate>
            <div className="auth-campo">
              <input
                type="email"
                placeholder="Email"
                aria-label="Correo electrónico"
                autoComplete="email"
                maxLength={100}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="auth-campo">
              <input
                type="password"
                placeholder="Password"
                aria-label="Contraseña"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="auth-link-texto">
              <Link href="/recuperar-contrasena">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button
              className="auth-boton-principal"
              type="submit"
              disabled={cargando}
            >
              {cargando ? "Iniciando Sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="auth-link-texto">
            <Link href="/registro">Registrarme</Link>
          </div>
          <div className="auth-separador">
            <span> ó </span>
          </div>
          <SocialAuthButtons />
        </div>
      </div>
    </div>
  );
}
