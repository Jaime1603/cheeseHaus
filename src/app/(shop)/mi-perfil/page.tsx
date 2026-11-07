import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import "./../cuenta.css";

export default async function MiPerfilPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const clienteId = Number(session.user.id);
  if (!Number.isInteger(clienteId) || clienteId < 1) {
    redirect("/login");
  }

  const cliente = await prisma.cliente.findUnique({
    where: { id_cliente: clienteId },
    select: {
      nombre: true,
      apellido: true,
      telefono_cliente: true,
      cedula: true,
      credenciales: {
        select: {
          email: true,
        },
      },
      direcciones: {
        select: {
          direccion: true,
          barrio: true,
          ciudad: true,
        },
        take: 1,
      },
    },
  });

  if (!cliente) {
    return (
      <section className="cuenta-page">
        <header className="cuenta-header">
          <h1 className="cuenta-titulo">Mi perfil</h1>
          <p className="cuenta-subtitulo">No encontramos los datos de tu perfil.</p>
        </header>
      </section>
    );
  }

  const direccion = cliente.direcciones[0];

  return (
    <section className="cuenta-page">
      <header className="cuenta-header">
        <h1 className="cuenta-titulo">Mi perfil</h1>
        <p className="cuenta-subtitulo">Consulta la información de tu cuenta.</p>
      </header>

      <div className="cuenta-contenido">
        <article className="cuenta-card">
          <h2 className="cuenta-card-titulo">Datos personales</h2>
          <dl className="cuenta-datos">
            <div className="cuenta-dato">
              <dt>Nombre</dt>
              <dd>{cliente.nombre} {cliente.apellido}</dd>
            </div>
            <div className="cuenta-dato">
              <dt>Correo electrónico</dt>
              <dd>{cliente.credenciales?.email ?? "No registrado"}</dd>
            </div>
            <div className="cuenta-dato">
              <dt>Teléfono</dt>
              <dd>{cliente.telefono_cliente || "No registrado"}</dd>
            </div>
            <div className="cuenta-dato">
              <dt>Cédula</dt>
              <dd>{cliente.cedula || "No registrada"}</dd>
            </div>
            {direccion && (
              <div className="cuenta-dato">
                <dt>Dirección</dt>
                <dd>
                  {[direccion.direccion, direccion.barrio, direccion.ciudad]
                    .filter(Boolean)
                    .join(", ")}
                </dd>
              </div>
            )}
          </dl>
        </article>
      </div>
    </section>
  );
}
