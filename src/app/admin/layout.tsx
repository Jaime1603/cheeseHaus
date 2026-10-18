import Link from "next/link";
import "./layout.css";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-logo">CheeseHaus</span>
          <span className="admin-sidebar-subtitulo">Panel Administrador</span>
        </div>

        <nav className="admin-nav">
          <Link href="/admin" className="admin-nav-link">
            Dashboard
          </Link>
          <Link href="/admin/productos" className="admin-nav-link">
            Productos
          </Link>
          <Link href="/admin/categorias" className="admin-nav-link">
            Categorías
          </Link>
          <Link href="/admin/pedidos" className="admin-nav-link">
            Pedidos
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-back-site">
            Volver al sitio
          </Link>
        </div>
      </aside>
      <main className="admin-contenido">{children}</main>
    </div>
  );
}
