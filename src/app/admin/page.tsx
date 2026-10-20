import "./dashboard.css"
import { prisma } from "@/lib/prisma"
// Importamos Prisma directamente porque esta es
// una Server Component, se ejecuta en el servidor
// y puede hablar con la BD sin pasar por una API

async function obtenerEstadisticas() {
  // Función async que consulta la BD
  // Se ejecuta en el servidor antes de renderizar la página

  const [totalProductos, totalCategorias, totalPedidos] = await Promise.all([
    // Promise.all ejecuta las 3 consultas en paralelo
    // es más rápido que ejecutarlas una por una

    prisma.producto.count(),
    // count() cuenta el total de registros

    prisma.categoria.count(),

    prisma.pedido.count(),
  ])

  return { totalProductos, totalCategorias, totalPedidos }
}

export default async function AdminPage() {
  // async porque necesitamos esperar los datos de la BD
  // antes de renderizar la página

  const { totalProductos, totalCategorias, totalPedidos } = await obtenerEstadisticas()

  return (
    <div>
      <h1 className="admin-titulo">Dashboard</h1>
      <p className="admin-subtitulo">Resumen general de CheeseHaus</p>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <span className="dashboard-card-numero">{totalProductos}</span>
          <span className="dashboard-card-label">Productos</span>
          <span className="dashboard-card-icono">🎂</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-numero">{totalCategorias}</span>
          <span className="dashboard-card-label">Categorías</span>
          <span className="dashboard-card-icono">📁</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-numero">{totalPedidos}</span>
          <span className="dashboard-card-label">Pedidos</span>
          <span className="dashboard-card-icono">📦</span>
        </div>

      </div>
    </div>
  )
}