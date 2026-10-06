import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {

        const body = await req.json();
        
        const {nombre, apellido, email, password} = body;

        
        //validaciones
        if (!nombre || !apellido || !email || !password) {
            return NextResponse.json(
                {error: "Todos los campos son obligatorios"},
                {status: 400})
        }

        if (password.length < 6) {
            return NextResponse.json(
                {error: "La contraseña debe tener al menos 6 caracteres"},
                {status: 400})
        }

        const credencialExistente = await prisma.credencial.findUnique({
            where: {email}
        })

        if (credencialExistente) {
            return NextResponse.json(
                {error: "El usuario ya existe"},
                {status: 409})
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const nuevoCliente = await prisma.cliente.create({
            data:{
                nombre,
                apellido,
                email,
                telefono_cliente: "",
                cedula: "",
                credenciales:{
                    create:{
                        email,
                        password_hash: passwordHash,
                        activo: true,
                    
                    }
                }
            }
        })
        return NextResponse.json(
                {
                    message: "Usuario creado exitosamente",
                    clienteId: nuevoCliente.id_cliente
                },
                {status: 201}
            )

    } catch (error) {
        console.log("Error al registrar usuario", error);
        return NextResponse.json(
            {error: "Error interno del servidor"},
            {status: 500}
        )
    }
}