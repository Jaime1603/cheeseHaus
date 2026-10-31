import { test, expect } from "@playwright/test";



/*
  HU-13 · Acceso por rol · RF-14 · RNF-08
  Escenario: Un visitante no puede entrar al panel de administración
    Given que el visitante no ha iniciado sesión
    When intenta abrir la dirección /admin
    Then es redirigido a la página de inicio de sesión
*/
test("HU-13: un visitante sin sesión no entra a /admin", async ({ page }) => {
    // Given: no hay sesión (cada prueba arranca con un navegador limpio)

    // When
    await page.goto("/admin");

    // Then
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Iniciar Sesión" })).toBeVisible();
});
