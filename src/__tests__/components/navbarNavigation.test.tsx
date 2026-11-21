import { render, screen, fireEvent } from "@testing-library/react";
import NavbarNavigation from "@/components/layout/navbarNavigation";

describe("NavbarNavigation", () => {
  test("renderiza el botón hamburguesa inicialmente cerrado", () => {
    render(<NavbarNavigation />);
    const boton = screen.getByRole("button", { name: "Abrir navegación" });
    expect(boton).toBeInTheDocument();
    expect(boton).toHaveAttribute("aria-expanded", "false");
  });

  test("abre y cierra el menú al hacer click en el botón hamburguesa", () => {
    render(<NavbarNavigation />);
    const boton = screen.getByRole("button", { name: "Abrir navegación" });

    // Abrir menú
    fireEvent.click(boton);
    expect(boton).toHaveAttribute("aria-label", "Cerrar navegación");
    expect(boton).toHaveAttribute("aria-expanded", "true");

    // Cerrar menú
    fireEvent.click(boton);
    expect(boton).toHaveAttribute("aria-label", "Abrir navegación");
    expect(boton).toHaveAttribute("aria-expanded", "false");
  });

  test("muestra los enlaces de navegación y se cierran al hacer click en ellos", () => {
    render(<NavbarNavigation />);
    const boton = screen.getByRole("button", { name: "Abrir navegación" });
    fireEvent.click(boton);

    const enlaceProductos = screen.getByRole("link", { name: "Productos" });
    expect(enlaceProductos).toHaveAttribute("href", "/productos");

    const enlaceQuienes = screen.getByRole("link", { name: "¿Quienes somos?" });
    expect(enlaceQuienes).toHaveAttribute("href", "/quienes-somos");

    const enlaceContacto = screen.getByRole("link", { name: "Contacto" });
    expect(enlaceContacto).toHaveAttribute("href", "/#contacto");

    // Click en un enlace debe cerrar el menú
    fireEvent.click(enlaceProductos);
    expect(boton).toHaveAttribute("aria-expanded", "false");
  });
});
