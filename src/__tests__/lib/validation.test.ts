import { isRecord, isValidEmail } from "@/lib/validation";

test.each(["ana@correo.com", "nombre.apellido@tienda.co"])(
  "acepta el formato de correo %s",
  (email) => {
    expect(isValidEmail(email)).toBe(true);
  },
);

test.each(["", "ana@", "ana.correo.com", "ana @correo.com"])(
  "rechaza el formato de correo %s",
  (email) => {
    expect(isValidEmail(email)).toBe(false);
  },
);

test("solo reconoce objetos como registros", () => {
  expect(isRecord({ email: "ana@correo.com" })).toBe(true);
  expect(isRecord(null)).toBe(false);
  expect(isRecord([])).toBe(false);
});
