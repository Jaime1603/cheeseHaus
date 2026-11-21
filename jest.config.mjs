import nextJest from "next/jest.js";
const createJestConfig = nextJest({ dir: "./" });

const config = {
    testEnvironment: "jest-environment-jsdom",        // simula un navegador
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],  // carga el archivo de arriba
    moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" }, // entiende el alias @/
    collectCoverageFrom: [                            // qué archivos mide la cobertura
        "src/controllers/**/*.{ts,tsx}",
        "src/services/**/*.{ts,tsx}",
        "src/components/**/*.{ts,tsx}",
        "!src/components/layout/navbar.tsx",
        "src/app/**/login/page.tsx",
        "src/app/**/registro/page.tsx",
        "src/app/**/carrito/page.tsx",
        "!src/__tests__/**",
        "!src/**/*.d.ts",
    ],
    coverageThreshold: {
        global: {
            statements: 90,
            branches: 75,
            functions: 90,
            lines: 90,
        },
    },
    coverageReporters: ["text", "lcov", "html"],
    testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/.next/",
        "<rootDir>/E2E/",
        "<rootDir>/e2e/",
    ],
};
export default createJestConfig(config);