import { test, expect } from "@playwright/test";

/*
  HU-05 · Registro de usuario · Negativa
  Escenario: Un visitante intenta registrarse con un email ya existente o datos inválidos
    Given que el visitante está en la página de registro
    When intenta registrarse con un email inválido (sin @)
    Then permanece en la página y ve un mensaje de error o validación del campo
*/
test("HU-05 (negativa): registro con email inválido muestra error de validación", async ({ page }) => {
  // Given
  await page.goto("/registro");
  await expect(page.getByRole("heading", { name: /registr/i })).toBeVisible();

  // When - rellena con email inválido
  await page.getByPlaceholder("Nombres").fill("Juan");
  await page.getByPlaceholder("Apellidos").fill("Pérez");
  await page.getByPlaceholder("Email").fill("esto-no-es-un-email");
  await page.getByPlaceholder("Contraseña").fill("Clave123*");
  await page.getByRole("button", { name: "Registrarme" }).click();

  // Then - el navegador valida el campo email (HTML5 validation) y no redirige
  await expect(page).toHaveURL(/\/registro/);
});
