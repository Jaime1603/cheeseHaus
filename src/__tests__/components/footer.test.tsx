import { render, screen } from "@testing-library/react";
import Footer from "@/components/layout/footer";

describe("Footer", () => {
  test("renderiza la información de marca y copyright", () => {
    render(<Footer />);

    expect(screen.getByText(/CheeseHaus \|/i)).toBeInTheDocument();
    expect(screen.getByText(/Reposteria Artesanal/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Todos los derechos reservados CheeseHaus © 2026/i)
    ).toBeInTheDocument();
  });

  test("renderiza los enlaces de navegación legal y de contacto", () => {
    render(<Footer />);

    expect(screen.getByText("Terminos de envio")).toBeInTheDocument();
    expect(screen.getByText("Politicas de privacidad")).toBeInTheDocument();
    expect(screen.getByText("Terminos y Condiciones")).toBeInTheDocument();
    expect(screen.getByText("atencion_cliente@CheeseHaus.com")).toBeInTheDocument();
  });

  test("renderiza los enlaces de redes sociales con sus imágenes correspondientes", () => {
    render(<Footer />);

    const linkWhatsapp = screen.getByRole("link", { name: "link de whatsapp" });
    expect(linkWhatsapp).toHaveAttribute("href", "https://wa.me/573128076425");
    expect(linkWhatsapp).toHaveAttribute("target", "_blank");

    expect(screen.getByAltText("link de instagram")).toBeInTheDocument();
    expect(screen.getByAltText("link de tiktok")).toBeInTheDocument();
  });
});
