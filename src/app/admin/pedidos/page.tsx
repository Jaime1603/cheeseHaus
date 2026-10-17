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
      });
  }, []);

  function colorEstado(estado: string) {
    switch (estado) {
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

      {/* {cargando ? (
        <p className="admin-cargando">Cargando Pedidos...</p>
      ) : (     */}
      <div className="admin-tabla-card">
        <table className="admin-tabla">
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
                <td>#{pedido.id_pedido}</td>
                <td>
                  {pedido.cliente.nombre} {pedido.cliente.apellido}
                </td>
                <td>
                  {new Date(pedido.fecha_pedido).toLocaleDateString("es-CO")}
                </td>
                <td>$ {pedido.total.toLocaleString("es-CO")}</td>
                <td>
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
                <td colSpan={6} className="admin-tabla-vacia">
                  No hay pedidos creados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* )}*/}
    </div>
  );
}
