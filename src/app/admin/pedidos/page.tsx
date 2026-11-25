"use client";

import { useEffect, useState } from "react";

interface pedido {
  id_pedido: number;
  fecha_pedido: string;
  total: number;
  estado: string;
  cliente: {
    nombre: string;
    apellido: string;
  };
}

export default function PedidosAdminPage() {
  const [pedidos, setPedidos] = useState<pedido[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/admin/pedidos")
      .then((res) => res.json())
      .then((data) => {
        setPedidos(data);
        setCargando(false);
      })
      .catch((error) => console.error("Error al cargar pedidos", error));
  }, []);

  function colorEstado(estado: string) {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "estado-pendiente";
      case "pagado":
        return "estado-pagado";
      case "enviado":
        return "estado-enviado";
      case "entregado":
        return "estado-entregado";
      case "cancelado":
        return "estado-cancelado";
      default:
        return "";
    }
  }

  return (
    <div>
      <h1 className="admin-titulo">Pedidos</h1>
      <p className="admin-subtitulo">Historial de pedidos de CheeseHaus</p>

       {cargando ? (
        <p className="admin-cargando">Cargando Pedidos...</p>
      ) : (     
      <div className="admin-tabla-card admin-pedidos-tabla-card">
        <table className="admin-tabla admin-pedidos-tabla">
          <thead>
            <tr>
              <th> N. Orden </th>
              <th> Cliente </th>
              <th> Fecha </th>
              <th> Total </th>
              <th> Estado </th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id_pedido}>
                <td data-label="N. Orden">#{pedido.id_pedido}</td>
                <td data-label="Cliente">
                  {pedido.cliente.nombre} {pedido.cliente.apellido}
                </td>
                <td data-label="Fecha">
                  {new Date(pedido.fecha_pedido).toLocaleDateString("es-CO")}
                </td>
                <td data-label="Total">
                  $ {pedido.total.toLocaleString("es-CO")}
                </td>
                <td data-label="Estado">
                  <span
                    className={`admin-estado ${colorEstado(pedido.estado)}`}
                  >
                    {pedido.estado}
                  </span>
                </td>
              </tr>
            ))}

            {pedidos.length === 0 && (
              <tr>
                <td colSpan={5} className="admin-tabla-vacia">
                  No hay pedidos creados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       )}
    </div>
  );
}
