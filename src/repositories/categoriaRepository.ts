import { prisma } from "@/lib/prisma";



export const categoriaRepository = {

    async getAllCategories() {
        try {
        return await prisma.categoria.findMany({
            orderBy: { id_categoria: "asc" }
        })
    } catch (error) {   
        throw new Error("Error al obtener todas las categorías")
    }
    },

    async getById(id: number) {
        try{
        return await prisma.categoria.findUnique({
            where: { id_categoria: id },
            include: {productos: true}
        })
    } catch (error) {
        throw new Error("Error al obtener la categoría por ID")
    }
    },

    async getByName(nombre: string) {
        try{
        return await prisma.categoria.findFirst({
            where: { nombre_categoria: {equals: nombre, mode: "insensitive"} }
        })
        
    } catch (error) {
        throw new Error("Error al obtener la categoría por nombre")
    }
    },

    async create(datos: {nombre_categoria: string, descripcion: string | null }){
        try{
        return await prisma.categoria.create({
            data: datos
        })
    } catch (error) {
        throw new Error("Error al crear la categoría")
    }
    },

    async update(id:number, datos: {nombre_categoria: string, descripcion: string | null }){
        try{
        return await prisma.categoria.update({
            where: { id_categoria: id },
            data: datos
        })
    } catch (error) {
        throw new Error("Error al actualizar la categoría")
    }
    },

    async delete(id:number) {
        try{
        return await prisma.categoria.delete({
            where: { id_categoria: id}
        })
    } catch (error) {
        throw new Error("Error al eliminar la categoría")
    }
    }
}
 
//console.log(categoriaRepository.getByName("Torta de chocolate"))

