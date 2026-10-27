import { prisma } from "@/lib/prisma";

export const productoRepository = {
  // Obtener todos los productos
  async getAllProductos() {
    try {
      return await prisma.producto.findMany({
        include: {
          categoria: {
            select: {
              id_categoria: true,
              nombre_categoria: true,
            },
          },
        },
        orderBy: { id_producto: "asc" },
      });
    } catch (error) {
      throw new Error("error al obtener los productos");
    }
  },

  //Obtener productos activos
  async getActivos() {
    try {
      return await prisma.producto.findMany({
        where: {
          activo: true,
        },
        include: {
          categoria: {
            select: {
              id_categoria: true,
              nombre_categoria: true,
            },
          },
        },
        orderBy: { id_producto: "asc" },
      });
    } catch (error) {
      throw new Error("Error al obtener los productos activos");
    }
  },

  //Obtener productos por categoria
  async getByCategory(id_categoria: number) {
    try {
      return await prisma.producto.findMany({
        where: {
          id_categoria: id_categoria,
          activo: true,
        },
        include: {
          categoria: {
            select: {
              id_categoria: true,
              nombre_categoria: true,
            },
          },
        },
        orderBy: { id_producto: "asc" },
      });
    } catch (error) {
      throw new Error("Error al obtener los productos por categoria");
    }
  },

  //Obtener producto por ID
  async getById(id: number) {
    try {
      return await prisma.producto.findUnique({
        where: { id_producto: id },
        include: {
          categoria: {
            select: {
              id_categoria: true,
              nombre_categoria: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error("Erro al obtener el producto por ID ");
    }
  },

  //Obtener producto por nombre
  async getByName(nombre: string ){
    try{
        return await prisma.producto.findFirst({
            where: { nombre_producto: { 
                equals: nombre,
                 mode: "insensitive" } 
                }
        })

    } catch (error) {
        throw new Error("Error al obtener el producto por el nombre")
    }
  },
   
  //Crear producto
  async create(datos: {
    id_categoria: number,
    nombre_producto: string,
    descripcion: string,
    precio: number,
    imagen_url: string,
    ingredientes: string,
    tamaño: string | null,
    activo: boolean,
  } ) {

    try{

        return await prisma.producto.create({
            data: datos,
            include : {
                categoria: {
                    select :{
                        id_categoria: true,
                        nombre_categoria: true
                    }
                }
            }
        })

    } catch (error) {
        throw new Error ("Error al crear el producto")
    }
  },

  //Actualizar producto
  async update( id : number, datos: Partial<{
    id_categoria: number,
    nombre_producto: string,
    descripcion: string,
    precio: number,
    imagen_url: string,
    ingredientes: string,
    tamaño: string | null,
    activo: boolean,
  }>){

    try{

        return await prisma.producto.update({
            where: {id_producto: id},
            data: datos,
            include: {
                categoria: {
                    select: {
                        id_categoria: true,
                        nombre_categoria: true,
                    }
                }
            }
        })

    } catch (error){
        throw new Error("Error al actualizar el producto")
    }

  },

  //Eliminar producto
  async delete(id: number) {
    try {

        return await prisma.producto.delete({
            where : {id_producto: id}
        })

    }catch(error) {
        throw new Error ("Error al eliminar el producto")
    }
  }
};