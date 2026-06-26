// CONFIGURACION NEXTAUTH

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" },

    pages: { signIn: "/login" },

    providers: [
        Credentials({
            name: "Credenciales",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Contraseña", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                const credencial = await prisma.credencial.findUnique({
                    where: { email },
                    include: { cliente: true },
                });

                if (credencial && bcrypt.compareSync(password, credencial.password_hash)) {
                    return {
                        id: credencial.id_usuario.toString(),
                        email: credencial.email,
                        name: credencial.cliente 
                            ? `${credencial.cliente.nombre} ${credencial.cliente.apellido}` 
                            : undefined,
                    };
                }
                return null;
            },
        }),
    ],
});