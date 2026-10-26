import { categoriaRepository } from "@/repositories/categoriaRepository";

type respuestaService<T> = 
| { exito: true; datos: T[] }
| { exito: false; error: string; codigo: number }


export const categoriaService = {


    async getAllCategories(): Promise<respuestaService<any>> {
        const categorias = await categoriaRepository.getAllCategories()
        return {exito: true , datos: categorias} as const  
    },

    async getById(id: number) {

        if(isNaN(id)){
            return {exito:false, error: "ID invalido", codigo: 400} as const
        } 
 
        const categoria = await categoriaRepository.getById(id)

        if(!categoria){
            return {exito: false, error: "Categoria no encontrada", codigo: 404} as const
        }
        
        return {exito: true, datos: categoria} as const  
    
        
    },

    //Creacion de una categoria
    async create(body: {nombre_categoria: string, descripcion?: string }) {

        //valida el input del nombre de la categoria

        if(!body.nombre_categoria || body.nombre_categoria.trim() === "") {
            return {exito: false, error: "El nombre es obligatorio", codigo: 400 } as const 
        }

        if(body.nombre_categoria.trim().length > 30) {
            return { exito: false, error: "El nombre de la categoria no puede tener mas de 30 caracteres", codigo: 400} as const
        }

        if(body.nombre_categoria.trim().length < 3) {
            return { exito: false, error: "El nombre de la categoria debe tener al menos 3 caracteres", codigo: 400} as const
        }

        // Valida que no exista una categoria con el mismo nombre
        const existente = await categoriaRepository.getByName(body.nombre_categoria.trim())
        if(existente) {
            return {exito: false, error: "Ya existe una categoria con ese nombre", codigo: 400} as const  
        }
        
        //Crea la categoria
        const nuevaCategoria = await categoriaRepository.create({
            nombre_categoria: body.nombre_categoria.trim(),
            descripcion: body.descripcion?.trim() || null
        })
        return {exito: true, datos: nuevaCategoria} as const;
    },

    // Actualizacion de una categoria
    async update(id:number,body: {nombre_categoria: string, descripcion?: string }){
        
        if(isNaN(id)) {
            return {exito: false, error: "El ID es invalido", codigo: 400}   as const
        }

        if(!body.nombre_categoria || body.nombre_categoria.trim() === "") {
            return {exito: false, error: "El nombre de la categoria es obligatorio", codigo: 400} as const
        }

        if(body.nombre_categoria.trim().length > 30) {
            return {exito: false, error: "El nombre de la categoria no puede tener mas de 30 caracteres", codigo: 400} as const
        }

        if(body.nombre_categoria.trim().length < 3) {
            return {exito: false, error: "El nombre de la categoria debe tener al menos 3 caracteres", codigo: 400} as const
        }

        //Verifica que ay exista la categoria
        const existente = await categoriaRepository.getById(id)
        if(!existente) {
            return {exito: false, error: "Categoria no encontrada", codigo: 404} as const  
        } 

        //Verifica duplicados
        const duplicado = await categoriaRepository.getByName(
            body.nombre_categoria.trim()
        )

        if(duplicado && duplicado.id_categoria !== id){
            return {exito: false, error: "Ya existe una categoria con ese nombre", codigo: 400}   as const
        }

        //Actualiza la categoria
        const categoriaActualizada = await categoriaRepository.update(id, {
            nombre_categoria: body.nombre_categoria.trim(),
            descripcion: body.descripcion?.trim() || null
        })

        return {exito: true, datos: categoriaActualizada} as const;

    },

    //Eliminacion de una categoria
    async delete(id:number) {

        if(isNaN(id)){
            return {exito:false, error:"ID invalido", codigo: 400}  as const  
        }

        const existente = await categoriaRepository.getById(id)
        if(!existente) {
            return {exito: false, error: "Categoria no encontrada", codigo: 404}   as const
        }

        //Verifica que no tengas productos asociados
        if(existente.productos.length > 0) {
            return {exito: false, error: `No se puede eliminar esta categoria porque tiene ${existente.productos.length} producto(s) asociado(s)` , codigo: 400}   as const
        }

        //Elimina la categoria
        await categoriaRepository.delete(id)
        return {exito: true, datos: {message: "Categoria eliminada correctamente"}} as const;
    }


   
    
} 

