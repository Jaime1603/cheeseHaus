import "./contacto.css";
import { PhoneCall } from "lucide-react";

export default function Contacto() {
  return (
    <section className="contacto" id="contacto">
      <div className="contacto-container">
        <div className="contacto-form-lado">
          <h2 className="contacto-titulo">Contactanos</h2>
          <p className="contacto-subtitulo">
            ¿Tienes dudas sobre un producto? Escribenos
          </p>

          <div className="contacto-form">
            <div className="contacto-fila">
              <div className="contacto-campo">
                <label>Nombres</label>
                <input type="text" placeholder="Nombres" />
              </div>
              <div className="contacto-campo">
                <label>Apellidos</label>
                <input type="text" placeholder="Apellidos" />
              </div>
            </div>

            <div className="contacto-campo">
              <label>Email</label>
              <input type="email" placeholder="Ej: tunombre@gmail.com" />
            </div>

            <div className="contacto-campo">
              <label>Mensaje</label>
              <textarea placeholder="¿En qué podemos ayudarte?" rows={5} />
            </div>
            <button className="contacto-boton">Enviar</button>
          </div>
        </div>

        {/*informacion de contacto del lado derecho*/}
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
              <img src="/whatsapp.svg" alt="whatsapp" />
              Inicia un chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
