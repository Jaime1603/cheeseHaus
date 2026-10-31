import nextJest from "next/jest.js";
const createJestConfig = nextJest({ dir: "./" });

const config = {
    testEnvironment: "jest-environment-jsdom",        // simula un navegador
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],  // carga el archivo de arriba
    moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" }, // entiende el alias @/
    collectCoverageFrom: [                            // qué archivos mide la cobertura
        "src/components/productos/productoCard.tsx",
        "src/services/authService.ts",
    ],
    coverageReporters: ["text", "lcov", "html"],
};
export default createJestConfig(config);