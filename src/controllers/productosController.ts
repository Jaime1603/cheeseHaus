import { productoService } from "@/services/productosService";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { error } from "console";

async function verificarAdmin() {
    const session = await auth()
    if(!session || session.user.rol !== "ADMIN") return null; 
    return session;   
}

//GET /api/admin/productos
export async function GET(req: NextRequest) {
    try {
        const session = verificarAdmin()
        if(!session){
            return NextResponse.json({error: "No Autorizado"}, {status: 401})
        }

        const resultado = await productoService.getAllProductos()
        if(!resultado.exito){
            return NextResponse.json({error: resultado.error}, {status: resultado.codigo})
        }

        return NextResponse.json(resultado.datos, {status: 200})
        
        
    } catch(error) {
        console.error("Error al obtener los productos", error);
        return NextResponse.json({error: "Error interno del servidor"}, {status: 500})
    }
}

//POST /api/admin/productos
 export async function POST(req: NextRequest){

    try {
        const session = await verificarAdmin()
        if(!session) {
            return NextResponse.json({error: "No Autorizado"}, {status: 401})
        }

        const body = await req.json()
        const resultado = await productoService.create(body)

        if (!resultado.exito) {
            return NextResponse.json({error: resultado.error}, {status: resultado.codigo})
        }
        return NextResponse.json(resultado.datos, {status: 201})

    } catch(error){
        console.error("Error al crear el producto", error);
        return NextResponse.json({error: "Error interno del servidor"}, {status: 500})
    }

 }

 //GET POR ID /api/admi/productos/[id]

 export async function getById(req: Request, {params} : { params : Promise<{id: string}>}){

    try{
        const session = await verificarAdmin()
        if(!session) {
            return NextResponse.json({error: "No Autorizado"}, {status: 401})
        }

        const id = parseInt((await params).id)

        const resultado = await productoService.getById(id)

        if(!resultado.exito){
            return NextResponse.json({error: resultado.error}, {status: resultado.codigo})
        }

        return NextResponse.json(resultado.datos, {status: 200})

    } catch(error){
        console.error("Error al obtener el producto por ID", error);
        return NextResponse.json({error: "Error interno del servidor"}, {status: 500})
    }

 }

 //GET POR CATEGORIA /api/admin/productos/

 //PUT /api/admin/productos/[id]

 export async function PUT(req: Request, {params} : {params : Promise<{id: string}>}){
    try{

        const session = await verificarAdmin()
        if(!session) {
            return NextResponse.json({error: "No Autorizado"}, {status: 401})
        }

        const id = parseInt((await params).id)
        const body = await req.json()

        const resultado = await productoService.update(id, body)

        if (!resultado.exito) {
            return NextResponse.json({error: resultado.error}, {status: resultado.codigo})
        }

        return NextResponse.json(resultado.datos, {status: 200})


    
    } catch (error) {
        console.error("Error al actualizar el producto", error);
        return NextResponse.json({error: "Error interno del servidor"}, {status: 500})
    }
  }

  // DELETE /api/admin/productos/[id]

  export async function DELETE(req:Request, {params} : {params : Promise< {id: string}>}) {
    try{

        const session = await verificarAdmin()
        if(!session) {
            return NextResponse.json({error: "No Autorizado"}, {status: 401})
        }

        const id = parseInt((await params).id)
        const resultado = await productoService.delete(id)

        if (!resultado.exito){
            return NextResponse.json({error: resultado.error}, {status: resultado.codigo})
        }

        return NextResponse.json(resultado.datos, {status: 200})

    } catch (error) {
        console.error("Error al eliminar el producto", error);
        return NextResponse.json({error: "Error interno del servidor"}, {status: 500})  
    }
  }