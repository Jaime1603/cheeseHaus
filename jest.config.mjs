import nextJest from "next/jest.js";
const createJestConfig = nextJest({ dir: "./" });

const config = {
    testEnvironment: "jest-environment-jsdom",        // simula un navegador
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],  // carga el archivo de arriba
    moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" }, // entiende el alias @/
    collectCoverageFrom: [                            // qué archivos mide la cobertura
        "src/components/productos/productoCard.tsx",
        "src/components/layout/navbarAccount.tsx",
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