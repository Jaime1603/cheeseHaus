import { test, expect } from "@playwright/test";

/*
  HU-06 · Iniciar sesión · RF-02
  Escenario: Login con credenciales incorrectas
    Given que el visitante está en la página de inicio de sesión
    When ingresa un correo y una contraseña incorrectos y pulsa "Iniciar Sesión"
    Then ve el mensaje "Email o contraseña incorrecta"
    And permanece en la página de inicio de sesión
*/
test("HU-06: login con credenciales incorrectas muestra un error", async ({ page }) => {
    // Given
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Iniciar Sesión" })).toBeVisible();

    // When
    await page.getByPlaceholder("Email").fill("nadie@correo.com");
    await page.getByPlaceholder("Password").fill("clave-incorrecta");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();

    // Then
    await expect(page.getByText("Email o contraseña incorrecta")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
});
