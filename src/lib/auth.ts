// CONFIGURACION NEXTAUTH

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const credencial = await prisma.credencial.findUnique({
          where: { email: credentials.email as string },

          include: { cliente: true },
        });

        if (!credencial || !credencial.activo) {
          // Si no existe el email en la base de datos
          // o si la cuenta está desactivada, rechazamos
          return null;
        }

        const passwordValida = await bcrypt.compare(
          credentials.password as string,
          // Contraseña que escribió el usuario (texto plano)
          credencial.password_hash,
          // Contraseña encriptada guardada en la base de datos
          // bcrypt.compare las compara de forma segura
        );

        if (!passwordValida) {
          return null;
        }

        await prisma.credencial.update({
          where: { id_usuario: credencial.id_usuario },
          data: { ultimo_acceso: new Date() },
          // new Date() obtiene la fecha y hora actual
        });

        return {
          id: credencial.id_cliente.toString(),
          email: credencial.email,
          name: `${credencial.cliente.nombre} ${credencial.cliente.apellido}`,
          rol: credencial.rol,
        };
      },
    }),
  ],

  callbacks: {
    // Los callbacks permiten personalizar el comportamiento de NextAuth

    async jwt({ token, user }) {
      // Se ejecuta cada vez que se crea o actualiza el token JWT
      // "user" solo existe en el primer login

      if (user) {
        token.id = user.id;
        token.rol = (user as any).rol;
        // Agregamos el id del cliente y el rol al token
        // para poder identificar al usuario y su rol en cualquier parte de la app
      }
      return token;
      // Retornamos el token modificado
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as string;
        // Hacemos disponible el id del cliente y su rol en session.user.id y session.user.rol
      }
      return session;
      // Retornamos la sesión modificada
    },
  },
});
