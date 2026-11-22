//Pagina de Registro
"use client";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SocialAuthButtons from "@/components/auth/socialAuthButtons";
import { isValidEmail } from "@/lib/validation";
import "../auth.css";

export default function RegistroPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [cargando, setCargando] = useState(false);
  const envioEnCurso = useRef(false);

  async function handleRegistro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (envioEnCurso.current) {
      return;
    }

    setError("");

    if (!nombre.trim() || !apellido.trim() || !email.trim() || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    envioEnCurso.current = true;
    setCargando(true);
    try {
      const response = await fetch("/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "No fue posible crear la cuenta");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al registrar usuario", error);
      setError("Error de conexión");
    } finally {
      envioEnCurso.current = false;
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-overlay">
        <div className="auth-card-registro">
          <h1 className="auth-titulo">Registrarse</h1>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleRegistro} noValidate>
            <div className="auth-fila">
              <div className="auth-campo">
                <input
                  type="text"
                  placeholder="Nombres"
                  aria-label="Nombres"
                  autoComplete="given-name"
                  maxLength={50}
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="auth-campo">
                <input
                  type="text"
                  placeholder="Apellidos"
                  aria-label="Apellidos"
                  autoComplete="family-name"
                  maxLength={50}
                  required
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
            </div>

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
                placeholder="Contraseña"
                aria-label="Contraseña"
                autoComplete="new-password"
                minLength={6}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="auth-boton-principal-registro"
              type="submit"
              disabled={cargando}
            >
              {cargando ? "Registrando..." : "Registrarme"}
            </button>
          </form>

          <div className="auth-link-texto">
            ¿Ya tienes una cuenta?
            <br />
            <Link href="/login">Inicia Sesión</Link>
          </div>

          <div className="auth-separador">
            <span>ó</span>
          </div>
          <div className="auth-fila-boton">
            <SocialAuthButtons />
          </div>
        </div>
      </div>
    </div>
  );
}
