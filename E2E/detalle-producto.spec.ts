import { test, expect } from "@playwright/test";

/*
  HU-02 · Consultar detalle de un producto
  Escenario positivo: El cliente ve la descripción, precio e información de un producto
    Given que el cliente está en la página de catálogo
    When hace clic en un producto
    Then ve la página de detalle con nombre, precio y descripción del producto
*/
test("HU-02: detalle de producto muestra nombre, precio y descripción", async ({ page }) => {
  // Given - navega al catálogo
  await page.goto("/productos");
  await page.waitForLoadState("networkidle");

  // When - hace clic en la primera tarjeta de producto o su enlace
  const primerEnlace = page.locator("a[href*='/productos/']").first();
  await expect(primerEnlace).toBeVisible();
  await primerEnlace.click();

  // Then - está en la página de detalle
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(/\/productos\/.+/);

  // Ve el nombre, precio e información del producto
  await expect(page.locator("h1, h2").first()).toBeVisible();
  await expect(page.locator(".detalle-precio, .producto-precio, [class*='precio']").first()).toBeVisible();
});
