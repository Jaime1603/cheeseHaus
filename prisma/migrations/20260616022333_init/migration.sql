-- CreateTable
CREATE TABLE "Categoria" (
    "id_categoria" SERIAL NOT NULL,
    "nombre_categoria" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(100),

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id_producto" SERIAL NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "nombre_producto" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "ingredientes" TEXT NOT NULL,
    "imagen_url" VARCHAR(250),
    "tamaño" VARCHAR(50),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id_cliente" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "telefono_cliente" VARCHAR(10) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "cedula" VARCHAR(50) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "Credencial" (
    "id_usuario" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(200) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimo_acceso" TIMESTAMP(3),

    CONSTRAINT "Credencial_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Direccion" (
    "id_direccion" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "direccion" VARCHAR(100) NOT NULL,
    "barrio" VARCHAR(100) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(10) NOT NULL,
    "fecha_entrega" TIMESTAMP(3),

    CONSTRAINT "Direccion_pkey" PRIMARY KEY ("id_direccion")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id_pedido" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_direccion" INTEGER NOT NULL,
    "fecha_pedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "valor_envio" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'Pendiente',

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id_pedido")
);

-- CreateTable
CREATE TABLE "DetallePedido" (
    "id_detalle" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "tamaño" VARCHAR(50),
    "precio_unitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetallePedido_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateTable
CREATE TABLE "MetodoPago" (
    "id_metodo_pago" SERIAL NOT NULL,
    "nombre_metodo" VARCHAR(50) NOT NULL,

    CONSTRAINT "MetodoPago_pkey" PRIMARY KEY ("id_metodo_pago")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id_pago" SERIAL NOT NULL,
    "id_metodo_pago" INTEGER NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "estado" VARCHAR(30) NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL,
    "referencia" VARCHAR(100),

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id_pago")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credencial_id_cliente_key" ON "Credencial"("id_cliente");

-- CreateIndex
CREATE UNIQUE INDEX "Credencial_email_key" ON "Credencial"("email");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credencial" ADD CONSTRAINT "Credencial_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Direccion" ADD CONSTRAINT "Direccion_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_id_direccion_fkey" FOREIGN KEY ("id_direccion") REFERENCES "Direccion"("id_direccion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePedido" ADD CONSTRAINT "DetallePedido_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "Pedido"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePedido" ADD CONSTRAINT "DetallePedido_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_id_metodo_pago_fkey" FOREIGN KEY ("id_metodo_pago") REFERENCES "MetodoPago"("id_metodo_pago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "Pedido"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;
