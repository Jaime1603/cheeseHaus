import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RestablecerContrasenaForm from "@/components/auth/restablecerContrasenaForm";

function fillPasswords(password: string, confirmation = password) {
  fireEvent.change(screen.getByLabelText("Nueva contraseña"), {
    target: { value: password },
  });
  fireEvent.change(screen.getByLabelText("Confirmar contraseña"), {
    target: { value: confirmation },
  });
}

test("validates the reset link, password length, and confirmation", () => {
  global.fetch = jest.fn();
  const { rerender } = render(<RestablecerContrasenaForm token="" />);
  fireEvent.click(screen.getByRole("button", { name: "Cambiar contraseña" }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "El enlace de recuperación no es válido.",
  );

  rerender(<RestablecerContrasenaForm token="token-valido" />);
  fillPasswords("12345");
  fireEvent.click(screen.getByRole("button", { name: "Cambiar contraseña" }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "La contraseña debe tener al menos 6 caracteres.",
  );

  fillPasswords("clave123", "clave456");
  fireEvent.click(screen.getByRole("button", { name: "Cambiar contraseña" }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Las contraseñas no coinciden.",
  );
  expect(global.fetch).not.toHaveBeenCalled();
});

test("submits a matching password and shows the success link", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({
      message: "La contraseña fue actualizada.",
    }),
  } as unknown as Response);

  render(<RestablecerContrasenaForm token="token-valido" />);
  fillPasswords("clave123");
  fireEvent.click(screen.getByRole("button", { name: "Cambiar contraseña" }));

  expect(await screen.findByRole("status")).toHaveTextContent(
    "La contraseña fue actualizada.",
  );
  expect(screen.getByRole("link", { name: "Iniciar sesión" })).toHaveAttribute(
    "href",
    "/login",
  );
  expect(global.fetch).toHaveBeenCalledWith(
    "/api/auth/restablecer-contrasena",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ token: "token-valido", password: "clave123" }),
    }),
  );
});

test("shows API and network errors", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: jest.fn().mockResolvedValue({ error: "El enlace expiró." }),
  } as unknown as Response);

  const { rerender } = render(
    <RestablecerContrasenaForm token="token-valido" />,
  );
  fillPasswords("clave123");
  fireEvent.click(screen.getByRole("button", { name: "Cambiar contraseña" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("El enlace expiró.");

  global.fetch = jest.fn().mockRejectedValue(new Error("network"));
  rerender(<RestablecerContrasenaForm token="otro-token" />);
  fillPasswords("clave123");
  fireEvent.click(screen.getByRole("button", { name: "Cambiar contraseña" }));
  await waitFor(() => {
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No fue posible procesar la solicitud. Inténtalo de nuevo.",
    );
  });
});
