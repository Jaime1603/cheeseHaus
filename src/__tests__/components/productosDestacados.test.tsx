import { render, screen, waitFor } from "@testing-library/react";
import ProductosDestacados from "@/components/home/productosDestacados";

const mockProductos = [
  {
    id_producto: 1,
    nombre_producto: "Cheesecake Clásico",
    precio: 20000,
    imagen_url: "https://img.com/cheesecake.png",
  },
  {
    id_producto: 2,
    nombre_producto: "Torta de Chocolate",
    precio: 25000,
    imagen_url: "https://img.com/torta.png",
  },
];

describe("ProductosDestacados", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("no renderiza nada si la API devuelve lista vacía", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    } as any);

    const { container } = render(<ProductosDestacados />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  test("renderiza los productos destacados cuando la API responde con datos", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockProductos),
    } as any);

    render(<ProductosDestacados />);

    await waitFor(() => {
      expect(screen.getByText("Cheesecake Clásico")).toBeInTheDocument();
      expect(screen.getByText("Torta de Chocolate")).toBeInTheDocument();
    });

    expect(screen.getByText(/Encuentra el regalo o gusto/i)).toBeInTheDocument();
  });

  test("maneja el error de fetch de forma segura y no crashea", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Error de red"));

    const { container } = render(<ProductosDestacados />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});
