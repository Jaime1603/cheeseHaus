"use client";

import Link from "next/link";
import "./confirmacion.css";
import "../verificacion/verificacion.css";

const pedido = {
  numeroOrden: "14526523",
  fecha: "18 dic 2027",
  metodoPago: "Transferencia bancaria",
  cliente: {
    nombre: "Jaime Gil Londono",
    correo: "gil.jaime03@hotmail.com",
    cedula: "1110040007",
    telefono: "3173142915",
  },
  entrega: {
    direccion: "Calle 66 #1a-50",
    barrio: "Villa del Sol",
    telefono: "312 807 6425",
    fecha_entrega: "18/12/2027",
  },
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

export default function ConfirmacionPage() {
  return (
    <div className="confirmacion-page">
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

          <div className="checkout-step completado">
            <div className="checkout-step-numero">✓</div>
            <span className="checkout-step-label"> Verificación </span>
          </div>

          <div className="checkout-step-linea"></div>

          <div className="checkout-step completado">
            <div className="checkout-step-numero">✓</div>
            <span className="checkout-step-label"> Confirmación </span>
          </div>
        </div>
      </div>

      <div className="checkout-separador-titulo"></div>

      <div className="confirmacion-header">
        <h2 className="confirmacion-info-titulo">Pedido Confirmado</h2>
        <div className="confirmacion-check">✓</div>
        <h1 className="confirmacion-info-titulo">¡Gracias por tu compra!</h1>
        <p className="confirmacion-info-orden">
          Orden N.o {pedido.numeroOrden} • {pedido.fecha}
        </p>
      </div>

      <div className="confirmacion-container">
        <div className="confirmacion-info-grid">
          <div className="confirmacion-tarjeta">
            <span className="confirmacion-tarjeta-titulo">Tu Informacion</span>
            <div className="confirmacion-tarjeta-info">
              <p>{pedido.cliente.nombre}</p>
              <p>{pedido.cliente.correo}</p>
              <p>{pedido.cliente.cedula}</p>
              <p>{pedido.cliente.telefono}</p>
            </div>
          </div>

          <div className="confirmacion-tarjeta">
            <span className="confirmacion-tarjeta-titulo">Entrega</span>
            <div className="confirmacion-tarjeta-info">
              <p>{pedido.entrega.direccion}</p>
              <p>{pedido.entrega.barrio}</p>
              <p>{pedido.entrega.telefono}</p>
              <p>{pedido.entrega.fecha_entrega}</p>
            </div>
          </div>

          <div className="confirmacion-metodo-pago">
            <span className="confirmacion-tarjeta-titulo">Metodo de Pago</span>
            <p>{pedido.metodoPago}</p>
          </div>

          <div className="confirmacion-productos">
            {pedido.items.map((item) => (
              <div key={item.id} className="confirmacion-item">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="confirmacion-item-img"
                />
                <div className="confirmacion-item-info">
                  <span className="confirmacion-item-nombre">
                    {item.nombre}
                  </span>
                  <span className="confirmacion-item-detalle">
                    {item.tamaño} x {item.cantidad}
                  </span>
                </div>
                <span className="confirmacion-item-precio">
                  ${item.precio.toLocaleString("es-CO")}
                </span>
              </div>
            ))}

            <div className="confirmacion-separador" />
            <div className="confirmacion-fila-resumen">
              <span>Envio</span>
              <span>${pedido.envio.toLocaleString("es-CO")}</span>
            </div>
            <div className="confirmacion-separador" />

            <div className="confirmacion-fila-total">
              <span>Total</span>
              <span>${pedido.total.toLocaleString("es-CO")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="confirmacion-acciones">
        <Link href="/" className="boton-atras-confirmacion">
          ← Volver al inicio
        </Link>

        <Link href="/productos" className="boton-continuar-comprando">
          Continuar Comprando
        </Link>
      </div>
    </div>
  );
}
