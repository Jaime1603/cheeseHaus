ALTER TABLE "Credencial"
ADD COLUMN "email_verificado_en" TIMESTAMP(3);

UPDATE "Credencial"
SET "email_verificado_en" = CURRENT_TIMESTAMP
WHERE "activo" = TRUE;

CREATE TABLE "TokenAutenticacion" (
    "id_token" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,
    "fecha_expiracion" TIMESTAMP(3) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenAutenticacion_pkey" PRIMARY KEY ("id_token")
);

CREATE UNIQUE INDEX "TokenAutenticacion_token_hash_key"
ON "TokenAutenticacion"("token_hash");

CREATE INDEX "TokenAutenticacion_email_tipo_idx"
ON "TokenAutenticacion"("email", "tipo");
