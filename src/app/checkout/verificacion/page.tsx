"use client";

import "./verificacion.css";
import Link from "next/link";

const pedido = {
  items: [
    {
      id: 1,
      nombre: "Red Velvet",
      precio: 30000,
      cantidad: 1,
      tamaño: "6x",
      imagen: "/redvelvet.png",
    },
  ],
  subTotal: 30000,
  envio: 5000,
  total: 35000,
};

export default function VerificacionPage() {
  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link href="/" className="checkout-logo">
          CheeseHaus
        </Link>

        <div className="checkout-stepper">
          <div className="checkout-step completado">
            <div className="checkout-step-numero">✓</div>
            <span className="checkout-step-label"> Carrito </span>
          </div>

          <div className="checkout-step-linea"></div>

          <div className="checkout-step activo">
            <div className="checkout-step-numero">2</div>
            <span className="checkout-step-label"> Verificación </span>
          </div>

          <div className="checkout-step-linea"></div>

          <div className="checkout-step inactivo">
            <div className="checkout-step-numero">3</div>
            <span className="checkout-step-label"> Confirmación </span>
          </div>
        </div>
      </div>

      <div className="checkout-separador-titulo"></div>

      <div className="checkout-container">
        <div className="checkout-contenido">
          <h1 className="checkout-titulo">Verificación</h1>

          <p className="checkout-seccion-titulo">Información de contacto</p>

          <div className="checkout-fila">
            <div className="checkout-campo">
              <label>Nombre</label>
              <input type="text" placeholder="Ingresa tu nombre" />
            </div>
            <div className="checkout-campo">
              <label>Apellido</label>
              <input type="text" placeholder="Ingresa tu apellido" />
            </div>
          </div>

          <div className="checkout-fila">
            <div className="checkout-campo">
              <label>Telefono</label>
              <input type="text" placeholder="Ingresa tu telefono" />
            </div>
            <div className="checkout-campo">
              <label>Cedula</label>
              <input type="text" placeholder="Ingresa tu cedula" />
            </div>
          </div>

          <div className="checkout-campo">
            <label>Correo</label>
            <input type="email" placeholder="Ingresa tu correo electronico" />
          </div>

          <p className="checkout-seccion-titulo">Dirección de Entrega</p>

          <div className="checkout-campo">
            <label>Dirección</label>
            <input type="text" placeholder="Ingresa tu dirección" />
          </div>

          <div className="checkout-campo">
            <label>Barrio y/o lugar de entrega</label>
            <input type="text" placeholder="Ej: Barrio, casa, edificio, etc." />
          </div>

          <div className="checkout-fila">
            <div className="checkout-campo">
              <label>Telefono para entrega</label>
              <input type="text" placeholder="Ingresa el telefono" />
            </div>

            <div className="checkout-campo">
              <label>Fecha de entrega</label>
              <input type="date" />
            </div>
          </div>
        </div>

        <div className="checkout-resumen">
          <div className="checkout-resumen-inner">
            {pedido.items.map((item) => (
              <div className="checkout-resumen-item" key={item.id}>
                <div className="checkout-resumen-imagen">
                  <img src={item.imagen} alt={item.nombre} />
                </div>
                <div className="checkout-resumen-info">
                  <span className="checkout-resumen-nombre">{item.nombre}</span>
                  <span className="checkout-resumen-cantidad">
                    {item.tamaño}
                  </span>
                </div>
                <span className="checkout-resumen-precio">
                  ${item.precio.toLocaleString("es-CO")}
                </span>
              </div>
            ))}

            <div className="checkout-resumen-fila">
              <span>Subtotal</span>
              <span>${pedido.subTotal.toLocaleString("es-CO")}</span>
            </div>

            <div className="checkout-resumen-fila">
              <span>Envio</span>
              <span>${pedido.envio.toLocaleString("es-CO")}</span>
            </div>

            <div className="checkout-resumen-separador" />

            <div className="checkout-resumen-fila">
              <span className="checkout-resumen-total">Total</span>
              <span className="checkout-resumen-total">
                ${pedido.total.toLocaleString("es-CO")}
              </span>
            </div>

            <div className="checkout-resumen-acciones">
              <button
                className="boton-atras"
                onClick={() => window.history.back()}
              >
                ← Atras
              </button>
              <Link href="/checkout/pago" className="pagar">
                Pagar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
