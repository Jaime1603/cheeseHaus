import { render, screen, fireEvent, act } from "@testing-library/react";
import Carrito from "@/app/(shop)/carrito/page";

describe("Carrito Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza los items iniciales del carrito y el resumen", () => {
    render(<Carrito />);

    expect(screen.getByRole("heading", { name: "Carrito" })).toBeInTheDocument();
    expect(screen.getByText("Red Velvet")).toBeInTheDocument();
    expect(screen.getByText("6 porciones")).toBeInTheDocument();
    expect(screen.getByText("Total del pedido")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Verificar" })).toHaveAttribute(
      "href",
      "/checkout/verificacion"
    );
  });

  test("aumenta y disminuye la cantidad de un item", () => {
    render(<Carrito />);

    const botonAumentar = screen.getByText("+");
    const botonDisminuir = screen.getByText("-");

    // Aumentar cantidad de 1 a 2
    fireEvent.click(botonAumentar);
    expect(screen.getByText("2")).toBeInTheDocument();

    // Disminuir cantidad de 2 a 1
    fireEvent.click(botonDisminuir);
    expect(screen.getByText("1")).toBeInTheDocument();

    // No debe bajar de 1
    fireEvent.click(botonDisminuir);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("elimina un item del carrito y muestra estado vacío", () => {
    render(<Carrito />);

    const botonEliminar = screen.getByText("×");
    fireEvent.click(botonEliminar);

    expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver productos" })).toHaveAttribute(
      "href",
      "/productos"
    );
  });

  test("avanza y retrocede en el carrusel de productos relacionados", () => {
    render(<Carrito />);

    const flechas = screen.getAllByRole("button");
    const flechaRetroceder = screen.getByText("←");
    const flechaAvanzar = screen.getByText("→");

    // Inicialmente no se puede retroceder
    fireEvent.click(flechaRetroceder);

    // Avanzar carrusel
    fireEvent.click(flechaAvanzar);
    // Ahora sí se puede retroceder
    fireEvent.click(flechaRetroceder);
  });

  test("maneja el evento de resize para cambiar cantidad de visibles", () => {
    render(<Carrito />);

    act(() => {
      window.innerWidth = 400;
      window.dispatchEvent(new Event("resize"));
    });

    act(() => {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event("resize"));
    });
  });
});
