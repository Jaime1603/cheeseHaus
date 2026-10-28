//RUTA PUBLICA PARA LOS CLIENTES

import { NextResponse } from "next/server"
import { productoService } from "@/services/productosService"

export async function GET() {
    try{

        const resultado = await productoService.getActivos()

        if (!resultado.exito){
            return NextResponse.json({error: resultado.error}, {status: resultado.codigo})
        }

        return NextResponse.json(resultado.datos, {status: 200})

    } catch (error) {
        console.error("Error al obtener los productos", error)
        return NextResponse.json({error: "Error interno del servidor"}, {status: 500})
    }
    
}