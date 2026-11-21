import nextJest from "next/jest.js";
const createJestConfig = nextJest({ dir: "./" });

const config = {
    testEnvironment: "jest-environment-jsdom",        // simula un navegador
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],  // carga el archivo de arriba
    moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" }, // entiende el alias @/
    collectCoverageFrom: [                            // qué archivos mide la cobertura
        "src/components/productos/productoCard.tsx",
        "src/components/layout/navbarAccount.tsx",
        "src/components/layout/navbarNavigation.tsx",
        "src/components/layout/footer.tsx",
        "src/components/home/hero.tsx",
        "src/components/home/contacto.tsx",
        "src/components/home/productosDestacados.tsx",
        "src/app/(auth)/login/page.tsx",
        "src/app/(auth)/registro/page.tsx",
        "src/app/(shop)/carrito/page.tsx",
        "src/services/authService.ts",
        "src/services/categoriaService.ts",
        "src/services/productosService.ts",
        "src/services/pedidosService.ts",
    ],
    coverageReporters: ["text", "lcov", "html"],
    testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/.next/",
        "<rootDir>/E2E/",
        "<rootDir>/e2e/",
    ],
};
export default createJestConfig(config);