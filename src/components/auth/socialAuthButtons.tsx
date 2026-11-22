"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

const providers = [
  { id: "google", name: "Google", image: "/google.svg" },
  { id: "facebook", name: "Facebook", image: "/facebook.svg" },
] as const;

export default function SocialAuthButtons() {
  const [providerInProgress, setProviderInProgress] = useState<string | null>(
    null,
  );
  const [error, setError] = useState("");

  async function handleSignIn(provider: (typeof providers)[number]["id"]) {
    setError("");
    setProviderInProgress(provider);

    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error || !result?.url) {
        setError("No se pudo iniciar sesión. Inténtalo de nuevo.");
        setProviderInProgress(null);
        return;
      }

      window.location.assign(result.url);
    } catch (error) {
      console.error("Error al iniciar sesión con un proveedor social", error);
      setError("No fue posible conectar con el proveedor. Inténtalo de nuevo.");
      setProviderInProgress(null);
    }
  }

  return (
    <>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      {providers.map((provider) => (
        <button
          key={provider.id}
          className="auth-boton-redes"
          type="button"
          onClick={() => handleSignIn(provider.id)}
          disabled={providerInProgress !== null}
        >
          <img src={provider.image} alt="" />
          <span>
            {providerInProgress === provider.id
              ? "Conectando..."
              : `Continúa con ${provider.name}`}
          </span>
        </button>
      ))}
    </>
  );
}
