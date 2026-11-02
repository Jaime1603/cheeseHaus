import { test, expect } from "@playwright/test";

/*
  HU-05 · Registro de usuario · RF-01
  Escenario: Un visitante se registra con datos válidos
    Given que el visitante está en la página de registro
    When rellena todos los campos con datos válidos y pulsa "Registrarme"
    Then es redirigido a la página de inicio de sesión
    And no ve ningún mensaje de error
*/
test("HU-05: registro exitoso redirige al login", async ({ page }) => {
  // Given
  await page.goto("/registro");
  await expect(page.getByRole("heading", { name: "Registrarse" })).toBeVisible();

  // When
  const emailUnico = `usuario_${Date.now()}@correo.com`;

  await page.getByPlaceholder("Nombres").fill("Juan");
  await page.getByPlaceholder("Apellidos").fill("Perez");
  await page.getByPlaceholder("Email").fill(emailUnico);
  await page.getByPlaceholder("Contraseña").fill("Clave123*");

  await page.getByRole("button", { name: "Registrarme" }).click();

  // Then
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: "Iniciar Sesión" })).toBeVisible();
  await expect(page.locator(".auth-error")).not.toBeVisible();
});
