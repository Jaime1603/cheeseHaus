import { defineConfig } from 'prisma/config'
// Importa la función que permite configurar Prisma
import * as dotenv from 'dotenv'
// Importa la librería que lee archivos .env

dotenv.config({ path: '.env' })
// Le dice a dotenv que lea específicamente tu archivo .env
// Sin esta línea, process.env.DATABASE_URL estaría vacío

export default defineConfig({
  // defineConfig es la función principal de configuración

  datasource: {
    // Le dice a Prisma dónde está tu base de datos

    url: process.env.DATABASE_URL as string,
    // Lee la URL de tu .env.local
    // "as string" le dice a TypeScript que esta variable
    // siempre va a existir y ser texto (no undefined)
  },
})