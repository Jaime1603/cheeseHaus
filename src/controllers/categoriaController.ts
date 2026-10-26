import { categoriaService } from "@/services/categoriaService" 
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

async function verificarAdmin(){
    const session = await auth()
        if (!session || session.user.rol !== "ADMIN") return null; 
            return session;   
        
}

// Peticion GET /api/admin/categorias
export async function GET(){

    try {
    const session = await verificarAdmin()
    if (!session) {
        return NextResponse.json({error: "No Autorizado"} , {status: 401})
    }

    const resultado = await categoriaService.getAllCategories()
    if(!resultado.exito) {
        return NextResponse.json(
            {error: resultado.error}, 
            {status: resultado.codigo}   
        )   
    }

    return NextResponse.json(resultado.datos, {status: 200})  
    } catch (error) {
        console.error("Error obteniendo todas las categorias", error);
        return NextResponse.json({error: "Error al obtener todas las categorias"} , {status: 500})  
    }
}

//Peticion GET /api/admin/categorias/[id]
export async function getById(req: Request, {params}: {params: Promise<{id: string}>}){
    try {
        const session = await verificarAdmin()
        if(!session){
            return NextResponse.json({error: "No Autorizado"}, {status: 401}) 
        }

        const id = parseInt((await params).id)

        const resultado = await categoriaService.getById(id)
        if(!resultado.exito) {
            return NextResponse.json(
                {error: resultado.error}, 
                {status: resultado.codigo}   
            )   
        }

        return NextResponse.json(resultado.datos, {status: 200})  

    } catch (error) {
        console.error("Error al obtener la categoria por ID", error);
        return NextResponse.json({error: "Error interno del servidor"} , {status: 500})  
    }
}

//Peticion POST /api/admin/categorias
export async function POST(req: Request) {
    
    try {
        const session = await verificarAdmin()
        if(!session) {
            return NextResponse.json({error: "No Autorizado"}, {status: 401}) 
        }

        const body = await req.json()

        const resultado = await categoriaService.create(body)
        if (!resultado.exito) {
            return NextResponse.json({error: resultado.error}, {status: resultado.codigo})  
        }

        return NextResponse.json(resultado.datos, {status: 201})

    } catch (error) {
        console.error("Error en POST categoria", error);
        return NextResponse.json({error: "Error interno del servidor"} , {status: 500})  
    }
} 

//Peticion PUT /api/admin/categorias/[id]
export async function PUT (req: Request, {params} : {params : Promise<{id: string}>}){

    try{ 
        const session = await verificarAdmin()
        if (!session) {
            return NextResponse.json({error: "No Autorizado"}, {status: 401}) 
        }

        const id = parseInt((await params).id)
        const body = await req.json()

        const resultado = await categoriaService.update(id, body)

        if(!resultado.exito) {
            return NextResponse.json({error: resultado.error}, {status: resultado.codigo})  
        }

        return NextResponse.json(resultado.datos, {status: 200})


    } catch (error) {
        console.error("Error en PUT categorias", error);
        return NextResponse.json({error: "Error interno del servidor"}, {status: 500})
    }
}

//Peticion DELETE /api/admin/categorias/[id]
export async function DELETE(req: Request, {params} : {params: Promise<{id: string}>}){
    
    try{
        const session = await verificarAdmin()
        if (!session) {
            return NextResponse.json({error: "No Autorizado"}, {status: 401}) 
        }

        const id = parseInt((await params).id)

        const resultado = await categoriaService.delete(id)
        
        if(!resultado.exito) {
            return NextResponse.json({error: resultado.error}, {status: resultado.codigo})
        }
        
        return NextResponse.json(resultado.datos, {status: 200})

    } catch(error){
        console.error("Error en DELETE categoria", error);
        return NextResponse.json({error: "Error interno del servidor"}, {status: 500})
    }
}