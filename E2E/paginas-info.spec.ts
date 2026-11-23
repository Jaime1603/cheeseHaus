import { test, expect } from "@playwright/test";

/*
  HU-11 · Consultar secciones Inicio, Contacto y Quiénes somos
  Escenario positivo A: El visitante accede a la página de Inicio
    Given que el visitante navega a la raíz del sitio
    When la página carga
    Then ve el encabezado principal o banner de bienvenida de CheeseHaus
*/
test("HU-11a: la página de inicio carga con el banner principal", async ({ page }) => {
  // Given / When
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Then - hay un encabezado o sección hero visible
  const encabezado = page.locator("h1, .hero, .banner, header").first();
  await expect(encabezado).toBeVisible();
});

/*
  HU-11b · Consultar sección Quiénes somos
  Escenario positivo B: El visitante accede a la página "Quiénes somos"
    Given que el visitante va a /quienes-somos
    When la página carga
    Then ve información sobre la tienda
*/
test("HU-11b: la página Quiénes somos carga con información de la tienda", async ({ page }) => {
  // Given / When
  await page.goto("/quienes-somos");
  await page.waitForLoadState("networkidle");

  // Then
  await expect(page.locator("h1, h2").first()).toBeVisible();
  await expect(page.locator("body")).toContainText(/quiénes|somos|cheesehaus|tienda/i);
});

/*
  HU-11c · Consultar sección Contacto
  Escenario positivo C: El visitante accede a la sección de contacto
    Given que el visitante va a /contacto
    When la página carga
    Then ve el formulario o información de contacto de CheeseHaus
*/
test("HU-11c: la página de Contacto carga con información de contacto", async ({ page }) => {
  // Given / When
  await page.goto("/contacto");
  await page.waitForLoadState("networkidle");

  // Then - hay un encabezado y elementos de contacto
  await expect(page.locator("h1, h2, .contacto-titulo").first()).toBeVisible();
  const infoContacto = page.locator(".contacto-form, .contacto-info-lado, .contacto-boton").first();
  await expect(infoContacto).toBeVisible();
});
