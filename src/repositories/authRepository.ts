import { prisma } from "@/lib/prisma";



export function findCredentialByEmail(email: string) {
  return prisma.credencial.findUnique({
    where: { email },
    include: {
      cliente: {
        select: {
          id_cliente: true,
          nombre: true,
          apellido: true,
        },
      },
    },
  });
}

export function updateLastAccess(idUsuario: number) {
  return prisma.credencial.update({
    where: { id_usuario: idUsuario },
    data: { ultimo_acceso: new Date() },
  });
}

/*
findCredentialByEmail("[EMAIL_ADDRESS]").then((credencial) => {
  if (credencial) {
    console.log(credencial.cliente.nombre)  
    updateLastAccess(credencial.id_usuario)
  } else {
    console.log("No se encontro el correo")
  }
}) */
