import { render, screen } from "@testing-library/react";
import Contacto from "@/components/home/contacto";

describe("Contacto", () => {
  test("renderiza el formulario de contacto con sus campos", () => {
    render(<Contacto />);

    expect(screen.getByRole("heading", { name: "Contactanos" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombres")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Apellidos")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ej: tunombre@gmail.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("¿En qué podemos ayudarte?")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar" })).toBeInTheDocument();
  });

  test("renderiza la información y el enlace de WhatsApp", () => {
    render(<Contacto />);

    expect(screen.getByText("Llamanos")).toBeInTheDocument();
    expect(screen.getByText(/Disponible de Lunes - viernes/i)).toBeInTheDocument();

    const linkWhatsapp = screen.getByRole("link", { name: /inicia un chat/i });
    expect(linkWhatsapp).toHaveAttribute("href", "https://wa.me/573128076425");
    expect(linkWhatsapp).toHaveAttribute("target", "_blank");
  });
});
