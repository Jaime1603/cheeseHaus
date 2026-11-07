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
