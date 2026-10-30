import { productoService } from "@/services/productosService";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";



async function verificarAdmin() {
    const session = await auth()
    if(!session || session.user.rol !== "ADMIN") return null; 
    return session;   
}

//GET /api/admin/productos
export async function GET(request: Request) {

    const session = await verificarAdmin()
    if(!session) {
        return NextResponse.json({error: "No Autorizado"}, {status: 401})
    }

    const {searchParams} = new URL(request.url)
    const categoriaParam = searchParams.get("categoria")

    // Sin filtro: todos los productos
    if (!categoriaParam) {
        const resultado = await productoService.getAllProductos()

        return NextResponse.json(resultado.datos, { status: 200 })
    }

    // Con filtro: productos de una categoría
    const resultado = await productoService.getByCategory(
        parseInt(categoriaParam),
    );

    if (!resultado.exito) {
        return NextResponse.json(
      { error: resultado.error },
      { status: resultado.codigo },
    );
    }

    return NextResponse.json(resultado.datos, { status: 200 });
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
        console.error("Error en POST productos", error);
        return NextResponse.json({error: "Error interno del servidor"}, {status: 500})
    }

 }

 //GET publico por ID /api/productos/[id]

 export async function getById(req: Request, {params} : { params : Promise<{id: string}>}){

    try{
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

 //GET administrativo por ID /api/admin/productos/[id]

 export async function getByIdAdmin(req: Request, context: { params: Promise<{id: string}> }){
    try {
        const session = await verificarAdmin()
        if(!session) {
            return NextResponse.json({error: "No Autorizado"}, {status: 401})
        }

        return getById(req, context)
    } catch (error) {
        console.error("Error al autorizar la consulta administrativa del producto", error);
        return NextResponse.json({error: "Error interno del servidor"}, {status: 500})
    }
 }

 //GET POR CATEGORIA /api/admin/productos/categoria/[id_categoria]

 export async function getByCategory(req:Request){

    try {
    const {searchParams} = new URL(req.url)
    const id_categoria = searchParams.get("id_categoria")

    const session = await verificarAdmin()
    if (!session) {
        return NextResponse.json({error: "No Autorizado"}, {status: 401})
    }

    if (!id_categoria){
        return NextResponse.json({error: "Falta id de categoria"}, {status: 400})
    }

    const resultado = await productoService.getByCategory(parseInt(id_categoria))

    if(!resultado.exito){
        return NextResponse.json({error: resultado.error}, {status: resultado.codigo})
    }
    return NextResponse.json(resultado.datos, {status: 200})
    }catch (error) {
        console.error("Error al obtener productos por categoria", error);
        return NextResponse.json({error: "Error interno del servidor"}, {status: 500})
    }

    
 }

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