import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { authController } from "@/controllers/authController";
import { isValidEmail } from "@/lib/validation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        return authController.login(credentials?.email, credentials?.password);
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" && account?.provider !== "facebook") {
        return true;
      }

      const email = user.email?.trim().toLowerCase();
      if (!email || email.length > 100 || !isValidEmail(email)) {
        return false;
      }

      const credential = await prisma.credencial.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
        include: {
          cliente: {
            select: { id_cliente: true },
          },
        },
      });

      if (credential) {
        if (!credential.activo) {
          return false;
        }

        if (!credential.email_verificado_en) {
          await prisma.credencial.update({
            where: { id_usuario: credential.id_usuario },
            data: { email_verificado_en: new Date() },
          });
        }

        user.id = credential.cliente.id_cliente.toString();
        user.rol = credential.rol;
        user.email = credential.email;
        return true;
      }

      const [nombre = "Cliente", ...apellidos] = (user.name ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      const cliente = await prisma.cliente.create({
        data: {
          nombre: nombre.slice(0, 50),
          apellido: apellidos.join(" ").slice(0, 50),
          email,
          telefono_cliente: "",
          cedula: "",
          credenciales: {
            create: {
              email,
              password_hash: null,
              activo: true,
              email_verificado_en: new Date(),
            },
          },
        },
        select: {
          id_cliente: true,
          credenciales: {
            select: { rol: true },
          },
        },
      });

      user.id = cliente.id_cliente.toString();
      user.rol = cliente.credenciales?.rol ?? "Cliente";
      user.email = email;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = typeof token.id === "string" ? token.id : "";
      session.user.rol =
        typeof token.rol === "string" ? token.rol : "Cliente";
      return session;
    },
  },
});
