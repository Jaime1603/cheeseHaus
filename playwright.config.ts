import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    timeout: 60_000, // la primera visita en `next dev` tarda en compilar
    expect: { timeout: 10_000 },
    reporter: [["list"], ["html", { open: "never" }]],
    use: {
        baseURL: "http://localhost:3000",
        trace: "on",
        video: "on",
    },
    projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
    webServer: {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true, // si ya tienes `npm run dev` abierto, lo reutiliza
        timeout: 120_000,
    },
});