"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OrderSummary from "@/components/checkout/orderSummary";
import { guardarDatosEntrega } from "@/lib/carrito";
import { useCarrito } from "@/hooks/useCarrito";
import "./verificacion.css";

export default function VerificacionPage() {
  const router = useRouter();
  const items = useCarrito();
  const [error, setError] = useState("");

  function continuar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Agrega productos al carrito antes de continuar.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const datosEntrega = {
      direccion: formData.get("direccion"),
      barrio: formData.get("barrio"),
      ciudad: formData.get("ciudad"),
      telefono: formData.get("telefono"),
      fecha_entrega: formData.get("fecha_entrega"),
      contacto: {
        nombre: String(formData.get("nombre_contacto") ?? ""),
        apellido: String(formData.get("apellido_contacto") ?? ""),
        telefono: String(formData.get("telefono_contacto") ?? ""),
        cedula: String(formData.get("cedula_contacto") ?? ""),
        correo: String(formData.get("correo_contacto") ?? ""),
      },
    };

    try {
      guardarDatosEntrega(JSON.stringify(datosEntrega));
      router.push("/checkout/pago");
    } catch (storageError) {
      console.error("No se pudo guardar la información de entrega", storageError);
      setError("No fue posible guardar los datos. Inténtalo de nuevo.");
    }
  }

  const fechaMinima = new Date().toISOString().slice(0, 10);

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link href="/" className="checkout-logo">CheeseHaus</Link>
        <div className="checkout-stepper">
          <div className="checkout-step completado">
            <div className="checkout-step-numero">✓</div>
            <span className="checkout-step-label">Carrito</span>
          </div>
          <div className="checkout-step-linea" />
          <div className="checkout-step activo">
            <div className="checkout-step-numero">2</div>
            <span className="checkout-step-label">Verificación</span>
          </div>
          <div className="checkout-step-linea" />
          <div className="checkout-step inactivo">
            <div className="checkout-step-numero">3</div>
            <span className="checkout-step-label">Confirmación</span>
          </div>
        </div>
      </div>
      <div className="checkout-separador-titulo" />

      <div className="checkout-container">
        <form
          className="checkout-contenido"
          id="checkout-details"
          onSubmit={continuar}
        >
          <h1 className="checkout-titulo">Información de entrega</h1>
          {error && <p className="checkout-error" role="alert">{error}</p>}

          {items.length === 0 ? (
            <p>
              Tu carrito está vacío. <Link href="/productos">Ver productos</Link>
            </p>
          ) : (
            <>
              <p className="checkout-seccion-titulo">Información de contacto</p>
              <div className="checkout-fila">
                <div className="checkout-campo">
                  <label htmlFor="contacto-nombre">Nombre</label>
                  <input
                    id="contacto-nombre"
                    name="nombre_contacto"
                    type="text"
                    autoComplete="given-name"
                    required
                    maxLength={50}
                  />
                </div>
                <div className="checkout-campo">
                  <label htmlFor="contacto-apellido">Apellido</label>
                  <input
                    id="contacto-apellido"
                    name="apellido_contacto"
                    type="text"
                    autoComplete="family-name"
                    required
                    maxLength={50}
                  />
                </div>
              </div>
              <div className="checkout-fila">
                <div className="checkout-campo">
                  <label htmlFor="contacto-telefono">Teléfono</label>
                  <input
                    id="contacto-telefono"
                    name="telefono_contacto"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={10}
                    pattern="[0-9]{7,10}"
                    title="Ingresa entre 7 y 10 dígitos."
                  />
                </div>
                <div className="checkout-campo">
                  <label htmlFor="contacto-cedula">Cédula</label>
                  <input
                    id="contacto-cedula"
                    name="cedula_contacto"
                    type="text"
                    required
                    maxLength={50}
                  />
                </div>
              </div>
              <div className="checkout-campo">
                <label htmlFor="contacto-correo">Correo electrónico</label>
                <input
                  id="contacto-correo"
                  name="correo_contacto"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={100}
                />
              </div>

              <p className="checkout-seccion-titulo">Dirección de entrega</p>
              <div className="checkout-campo">
                <label htmlFor="direccion">Dirección</label>
                <input id="direccion" name="direccion" required maxLength={100} />
              </div>
              <div className="checkout-fila">
                <div className="checkout-campo">
                  <label htmlFor="barrio">Barrio</label>
                  <input id="barrio" name="barrio" required maxLength={100} />
                </div>
                <div className="checkout-campo">
                  <label htmlFor="ciudad">Ciudad</label>
                  <input id="ciudad" name="ciudad" defaultValue="Cali" maxLength={100} />
                </div>
              </div>
              <div className="checkout-fila">
                <div className="checkout-campo">
                  <label htmlFor="telefono">Teléfono de entrega</label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    required
                    maxLength={10}
                    pattern="[0-9]{7,10}"
                  />
                </div>
                <div className="checkout-campo">
                  <label htmlFor="fecha_entrega">Fecha de entrega</label>
                  <input
                    id="fecha_entrega"
                    name="fecha_entrega"
                    type="date"
                    min={fechaMinima}
                    required
                  />
                </div>
              </div>
            </>
          )}
        </form>

        <aside className="checkout-resumen">
          <OrderSummary items={items} />
          <div className="checkout-resumen-acciones">
            <button
              className="boton-atras"
              type="button"
              onClick={() => router.back()}
            >
              ← Atrás
            </button>
            {items.length > 0 && (
              <button
                className="pagar"
                type="submit"
                form="checkout-details"
              >
                Continuar
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
