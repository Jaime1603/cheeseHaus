import { fireEvent, render, screen } from "@testing-library/react";
import NavbarAccount from "@/components/layout/navbarAccount";

jest.mock("next-auth/react", () => ({ signOut: jest.fn() }));

test("cierra el menú al hacer clic fuera de él", () => {
  render(
    <>
      <NavbarAccount userName="Ana" isAdmin={false} />
      <button type="button">Fuera</button>
    </>,
  );

  fireEvent.click(screen.getByRole("button", { name: /hola, ana/i }));
  expect(screen.getByRole("link", { name: "Mi perfil" })).toBeInTheDocument();

  fireEvent.pointerDown(screen.getByRole("button", { name: "Fuera" }));

  expect(screen.queryByRole("link", { name: "Mi perfil" })).not.toBeInTheDocument();
});

test("no muestra Mis pedidos a los administradores", () => {
  render(<NavbarAccount userName="Admin" isAdmin />);

  fireEvent.click(screen.getByRole("button", { name: /hola, admin/i }));

  expect(screen.queryByRole("link", { name: "Mis pedidos" })).not.toBeInTheDocument();
});

test("muestra Mis pedidos a los usuarios que no son administradores", () => {
  render(<NavbarAccount userName="Ana" isAdmin={false} />);

  fireEvent.click(screen.getByRole("button", { name: /hola, ana/i }));

  expect(screen.getByRole("link", { name: "Mis pedidos" })).toHaveAttribute(
    "href",
    "/mis-pedidos",
  );
});

test("muestra el link Mi perfil al abrir el menú", () => {
  render(<NavbarAccount userName="Ana" isAdmin={false} />);

  fireEvent.click(screen.getByRole("button", { name: /hola, ana/i }));

  expect(screen.getByRole("link", { name: "Mi perfil" })).toHaveAttribute(
    "href",
    "/mi-perfil",
  );
});

test("cierra el menú al hacer clic en Mi perfil", () => {
  render(<NavbarAccount userName="Ana" isAdmin={false} />);

  fireEvent.click(screen.getByRole("button", { name: /hola, ana/i }));
  fireEvent.click(screen.getByRole("link", { name: "Mi perfil" }));

  expect(screen.queryByRole("link", { name: "Mi perfil" })).not.toBeInTheDocument();
});

test("muestra el link Regresar al panel al admin y lo cierra al hacer clic", () => {
  render(<NavbarAccount userName="Admin" isAdmin />);

  fireEvent.click(screen.getByRole("button", { name: /hola, admin/i }));

  const linkPanel = screen.getByRole("link", { name: "Regresar al panel" });
  expect(linkPanel).toHaveAttribute("href", "/admin");

  fireEvent.click(linkPanel);
  expect(screen.queryByRole("link", { name: "Regresar al panel" })).not.toBeInTheDocument();
});

test("llama a signOut al hacer clic en Cerrar sesión", () => {
  const { signOut } = require("next-auth/react");
  render(<NavbarAccount userName="Ana" isAdmin={false} />);

  fireEvent.click(screen.getByRole("button", { name: /hola, ana/i }));
  fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));

  expect(signOut).toHaveBeenCalledWith({ redirectTo: "/" });
});

test("muestra el ícono de login cuando no hay usuario", () => {
  render(<NavbarAccount userName={null} isAdmin={false} />);

  expect(screen.getByRole("link", { name: "Iniciar sesión" })).toHaveAttribute(
    "href",
    "/login",
  );
});
