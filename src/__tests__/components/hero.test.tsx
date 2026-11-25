import { render, screen } from "@testing-library/react";
import Hero from "@/components/home/hero";

describe("Hero", () => {
  test("renderiza el título y eslogan principal", () => {
    render(<Hero />);

    expect(screen.getByText("Reposteria Artesanal")).toBeInTheDocument();
    expect(screen.getByText("Hecha con amor")).toBeInTheDocument();
  });

  test("renderiza el botón de llamada a la acción hacia productos", () => {
    render(<Hero />);

    const boton = screen.getByRole("link", { name: "Descubre Mas..." });
    expect(boton).toBeInTheDocument();
    expect(boton).toHaveAttribute("href", "/productos");
  });
});
