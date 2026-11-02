import { render, screen } from "@testing-library/react";
import ProductoCard from "@/components/productos/productoCard";

test("muestra el nombre del producto", () => {
    // Preparar: dibujamos la tarjeta con datos inventados
    render(
        <ProductoCard id={7} nombre="Cheesecake de fresa" precio={18500} imagen="https://img.com/a.png" />
    );

    // Verificar: buscamos el texto en pantalla, como lo haría un usuario
    expect(screen.getByText("Cheesecake de fresa")).toBeInTheDocument();
    expect(screen.getByText(/18\.500/)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://img.com/a.png");
}); 