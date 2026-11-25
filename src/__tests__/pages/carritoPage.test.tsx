import { render, screen, fireEvent, act } from "@testing-library/react";
import Carrito from "@/app/(shop)/carrito/page";

describe("Carrito Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem(
      "cheesehaus-carrito",
      JSON.stringify([
        {
          id_producto: 1,
          nombre_producto: "Red Velvet",
          precio: 25000,
          cantidad: 1,
          tamaño: "6 porciones",
          imagen_url: "/redvelvet.png",
        },
      ]),
    );
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

  test("conserva items sin tamaño y permite cambiar su cantidad", () => {
    localStorage.setItem(
      "cheesehaus-carrito",
      JSON.stringify([
        {
          id_producto: 2,
          nombre_producto: "Brownie",
          precio: 12000,
          cantidad: 1,
          tamaño: "",
          imagen_url: "/brownie.png",
        },
      ]),
    );

    render(<Carrito />);

    expect(screen.getByText("—")).toBeInTheDocument();
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByText("2")).toBeInTheDocument();
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

    const flechaRetroceder = screen.getByText("←");
    const flechaAvanzar = screen.getByText("→");

    // Inicialmente no se puede retroceder
    expect(flechaRetroceder).toHaveClass("desactivado");
    fireEvent.click(flechaRetroceder);
    expect(flechaRetroceder).toHaveClass("desactivado");

    // Avanzar carrusel
    fireEvent.click(flechaAvanzar);
    // Ahora sí se puede retroceder
    expect(flechaRetroceder).not.toHaveClass("desactivado");
    fireEvent.click(flechaRetroceder);
    expect(flechaRetroceder).toHaveClass("desactivado");
  });

  test("maneja el evento de resize para cambiar cantidad de visibles", () => {
    render(<Carrito />);

    const track = document.querySelector(".carrito-carrusel-track");
    expect(track).toBeInTheDocument();

    act(() => {
      window.innerWidth = 400;
      window.dispatchEvent(new Event("resize"));
    });
    expect(track).toHaveStyle(
      "transform: translateX(calc(-0 * (100% / 2 + 0.5rem)))"
    );

    act(() => {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event("resize"));
    });
    expect(track).toHaveStyle(
      "transform: translateX(calc(-0 * (100% / 3 + 0.5rem)))"
    );
  });
});
