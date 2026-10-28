import { productoRepository } from "@/repositories/productosRepository";
import type { Prisma } from '@prisma/client'


type RespuestaService<T> = 
    | { exito: true; datos: T }
    | { exito: false; error: string; codigo: number };

export const productoService = {

    async getAllProductos(){ 
        const productos = await productoRepository.getAllProductos();
        return {exito: true, datos: productos} as const; 
    },

    // activos para el catalogo publico
    async getActivos() : Promise<RespuestaService<any>>{
        const productos = await productoRepository.getActivos()
        return {exito: true, datos: productos} as const
    },

    // Produtos por categoria
    async getByCategory(id_categoria: number){
        if(isNaN(id_categoria)){
            return {exito: false, error: "ID de categoria invalido", codigo: 400} as const
        }

        const productos = await productoRepository.getByCategory(id_categoria)
        
        if(productos.length === 0){
            return {exito: false, error: "No hay productos en esta categoria"} as const
        }
        
        return {exito: true, datos: productos} as const
    },

    //Obtener producto por ID
    async getById(id: number){
        if(isNaN(id)){
            return {exito: false, error: "ID de producto invalido", codigo: 400} as const
        }

        const productos = await productoRepository.getById(id)
        if(!productos){
            return {exito: false, error: "Producto no encontrado", codigo: 404} as const
        }

        return {exito: true, datos: productos} as const
        
    },

    //Crear productos
    async create(body: {
        nombre_producto: string,
        descripcion: string,
        precio: number,
        ingredientes: string,
        imagen_url: string,
        tamaño: string,
        activo: boolean,
        id_categoria: number,
    }) {

        if(!body.nombre_producto || body.nombre_producto.trim() === ""){
            return {exito: false, error: "El nombre del producto es obligatorio", codigo: 400} as const
        }

        if (body.nombre_producto.trim().length < 5){
            return {exito: false, error: "El nombre del producto debe tener al menos 5 caracteres", codigo: 400} as const
        }

        if (body.nombre_producto.trim().length > 50){
            return {exito: false, error: "El nombre del producto debe tener maximo 50 caracteres", codigo: 400} as const
        }

        if(!body.descripcion || body.descripcion.trim() === ""){
            return {exito: false, error: "La descripcion es obligatoria", codigo: 400} as const
        }

        if(!body.precio || isNaN(body.precio) || body.precio <=0){
            return {exito: false, error: "El precio es obligatorio y debe ser un numero mayor a 0", codigo: 400} as const
        }

        if(!body.ingredientes || body.ingredientes.trim() === ""){
            return {exito: false, error: "Los ingredientes son obligatorios", codigo: 400} as const
        }

        if (!body.id_categoria || isNaN(body.id_categoria)){
            return {exito: false, error: "El id de la categoria es obligatorio y debe ser un numero mayor a 0", codigo: 400} as const
        } 

        
        if (!body.imagen_url || body.imagen_url.trim() === "") {
            return { exito: false, error: "La URL de la imagen es obligatoria", codigo: 400 } as const;
        }
        
        try {
            new URL(body.imagen_url);
        } catch (error) {
            return { exito: false, error: "La URL de la imagen no es valida", codigo: 400 } as const;
        }

        const existente = await productoRepository.getByName(
            body.nombre_producto.trim()
        )
        if(existente){
            return {exito: false, error: "Ya existe un producto con este nombre", codigo: 400} as const
        }

        // CREAR //

        const nuevoProducto = await productoRepository.create({
            nombre_producto: body.nombre_producto.trim(),
            descripcion: body.descripcion.trim(),
            precio: body.precio,
            ingredientes: body.ingredientes.trim(),
            imagen_url: body.imagen_url?.trim(),
            tamaño: body.tamaño?.trim(),
            activo: body.activo ?? true,
            id_categoria: body.id_categoria,
        })
        return {exito: true, datos: nuevoProducto} as const;
    },

    // Actualizar produdcto
    async update(id: number, body: {
        id_categoria?: number;
        nombre_producto?: string;
        descripcion?: string;
        precio?: number;
        imagen_url?: string;
        ingredientes?: string;
        tamaño?: string;
        activo?: boolean;
    }){

        if (isNaN(id)) {
            return {exito: false, error: "ID invalido", codigo: 400} as const
        }

        const existente = await productoRepository.getById(id)

        if(!existente){
            return {exito: false, error: "Producto no encontrado", codigo: 404} as const
        }

        if (body.nombre_producto !== undefined ){
            if (body.nombre_producto.trim() === ""){
                return {exito: false, error: "El nombre no puede estar vacio", codigo: 400} as const
            }

            if(body.nombre_producto.trim().length > 50){
                return {exito: false, error: "El nombre no puede tener mas de 50 caracteres", codigo: 400} as const
            }

           const duplicado = await productoRepository.getByName(body.nombre_producto.trim())
           
           if (duplicado && duplicado.id_producto !== id){
            return {exito: false, error: "Ya existe un producto con este nombre", codigo: 409} as const
           }
        }

        if(body.precio !== undefined){
            if(body.precio <= 0 || isNaN(body.precio)){
                return {exito: false, error: "El precio debe ser un numero mayor a 0", codigo: 400} as const
            }
        }

        if (body.imagen_url !== undefined && body.imagen_url.trim() !== ""){
            try {
                new URL(body.imagen_url)
            } catch (error){
                return {exito: false, error: "La URL de la imagen no es valida", codigo: 400} as const
            }
        }

        if(body.id_categoria !== undefined && (isNaN(body.id_categoria) || body.id_categoria <= 0)){
            return {exito: false, error: "El ID de la categoria es invalido", codigo: 400} as const
        }

        // ── Construir objeto de actualización ──
    const datosActualizar: Prisma.ProductoUncheckedUpdateInput = {}
    

    if (body.nombre_producto !== undefined){
      datosActualizar.nombre_producto = body.nombre_producto.trim()
    }
    if (body.descripcion !== undefined){
      datosActualizar.descripcion = body.descripcion.trim()
    }
    if (body.precio !== undefined){
      datosActualizar.precio = body.precio
    }
    if (body.ingredientes !== undefined){
      datosActualizar.ingredientes = body.ingredientes.trim()
    }
    if (body.imagen_url !== undefined){
      datosActualizar.imagen_url = body.imagen_url.trim()
    }
    if (body.tamaño !== undefined){
      datosActualizar.tamaño = body.tamaño.trim() || null
    }
    if (body.id_categoria !== undefined){
      datosActualizar.id_categoria = body.id_categoria
    }
    if (body.activo !== undefined){
      datosActualizar.activo = body.activo
    }

    if (Object.keys(datosActualizar).length === 0) {
    return {
        exito: false,
        error: "Debes enviar al menos un campo para actualizar",
        codigo: 400,
    } as const;
    }
        
    const productoActulizado = await productoRepository.update(id, datosActualizar)

    if(!productoActulizado){
        return {exito: false, error: "No se pudo actualizar el producto", codigo: 500} as const
    } 
    
    return {exito: true, datos: productoActulizado} as const

    },

    //eliminar productos
    async delete(id: number) {
        if(isNaN(id)){
            return {exito: false, error: "ID invalido", codigo: 400} as const
        }

        const existente = await productoRepository.getById(id)
        if(!existente){
            return {exito: false, error: "Producto no encontrado", codigo: 404} as const
        }

        await productoRepository.delete(id)
        return {exito: true, datos: {message: "Producto eliminado correctamente"}} as const

    }

} 