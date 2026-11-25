"use client";

import { useRef, useState, type FormEvent } from "react";
import { PhoneCall } from "lucide-react";
import "./contacto.css";

export default function Contacto() {
  const [enviando, setEnviando] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState("");
  const [enlaceWhatsapp, setEnlaceWhatsapp] = useState("");
  const [esError, setEsError] = useState(false);
  const envioEnCurso = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (envioEnCurso.current) {
      return;
    }

    setMensajeEstado("");
    setEnlaceWhatsapp("");
    setEsError(false);

    const form = event.currentTarget;
    const datos = new FormData(form);

    envioEnCurso.current = true;
    setEnviando(true);
    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombres: datos.get("nombres"),
          apellidos: datos.get("apellidos"),
          email: datos.get("email"),
          mensaje: datos.get("mensaje"),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setEsError(true);
        setMensajeEstado(data.error ?? "No fue posible procesar el mensaje");
        return;
      }

      setMensajeEstado(
        "Tu mensaje está listo. Continúa por WhatsApp para completar el envío.",
      );
      setEnlaceWhatsapp(data.whatsappUrl);
      form.reset();
    } catch (error) {
      console.error("Error al procesar el mensaje de contacto", error);
      setEsError(true);
      setMensajeEstado("No fue posible procesar el mensaje. Inténtalo de nuevo.");
    } finally {
      envioEnCurso.current = false;
      setEnviando(false);
    }
  }

  return (
    <section className="contacto" id="contacto">
      <div className="contacto-container">
        <div className="contacto-form-lado">
          <h2 className="contacto-titulo">Contactanos</h2>
          <p className="contacto-subtitulo">
            ¿Tienes dudas sobre un producto? Escribenos
          </p>

          <form className="contacto-form" onSubmit={handleSubmit}>
            <div className="contacto-fila">
              <div className="contacto-campo">
                <label htmlFor="contacto-nombres">Nombres</label>
                <input
                  id="contacto-nombres"
                  name="nombres"
                  type="text"
                  placeholder="Nombres"
                  autoComplete="given-name"
                  maxLength={80}
                  required
                />
              </div>
              <div className="contacto-campo">
                <label htmlFor="contacto-apellidos">Apellidos</label>
                <input
                  id="contacto-apellidos"
                  name="apellidos"
                  type="text"
                  placeholder="Apellidos"
                  autoComplete="family-name"
                  maxLength={80}
                  required
                />
              </div>
            </div>

            <div className="contacto-campo">
              <label htmlFor="contacto-email">Email</label>
              <input
                id="contacto-email"
                name="email"
                type="email"
                placeholder="Ej: tunombre@gmail.com"
                autoComplete="email"
                maxLength={254}
                required
              />
            </div>

            <div className="contacto-campo">
              <label htmlFor="contacto-mensaje">Mensaje</label>
              <textarea
                id="contacto-mensaje"
                name="mensaje"
                placeholder="¿En qué podemos ayudarte?"
                rows={5}
                maxLength={2000}
                required
              />
            </div>

            {mensajeEstado && (
              <p
                className={`contacto-estado${esError ? " contacto-estado-error" : ""}`}
                role={esError ? "alert" : "status"}
              >
                {mensajeEstado}
              </p>
            )}
            {enlaceWhatsapp && (
              <a
                className="contacto-whatsapp contacto-whatsapp-envio"
                href={enlaceWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/whatsapp.svg" alt="" />
                Continuar en WhatsApp para enviar tu mensaje
              </a>
            )}

            <button className="contacto-boton" type="submit" disabled={enviando}>
              {enviando ? "Procesando..." : "Enviar"}
            </button>
          </form>
        </div>

        <div className="contacto-info-lado">
          <div className="contacto-info-item">
            <span className="contacto-info-titulo">Llamanos</span>
            <span>
              <PhoneCall />
              Disponible de Lunes - viernes de 8:00am - 4:00pm
            </span>
          </div>

          <div className="contacto-info-item">
            <span className="contacto-info-titulo"> Chatea Con Nosotros</span>
            <span> Habla con nuestro equipo</span>

            <a
              href="https://wa.me/573128076425"
              target="_blank"
              rel="noopener noreferrer"
              className="contacto-whatsapp"
            >
              <img src="/whatsapp.svg" alt="" />
              Inicia un chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
