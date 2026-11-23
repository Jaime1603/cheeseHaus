import { fireEvent, render, screen } from "@testing-library/react";
import VerificacionPage from "@/app/checkout/verificacion/page";
import { useCarrito } from "@/hooks/useCarrito";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("@/hooks/useCarrito", () => ({ useCarrito: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
    back: jest.fn(),
  });
  (useCarrito as jest.Mock).mockReturnValue([
    {
      id_producto: 9,
      nombre_producto: "Cheesecake",
      precio: 25000,
      cantidad: 1,
      tamaño: "8 porciones",
      imagen_url: "/cheesecake.png",
    },
  ]);
});

test("adds required contact fields and keeps the delivery fields", () => {
  render(<VerificacionPage />);

  for (const label of [
    "Nombre",
    "Apellido",
    "Teléfono",
    "Cédula",
    "Correo electrónico",
  ]) {
    expect(screen.getByLabelText(label)).toBeRequired();
  }

  expect(screen.getByLabelText("Correo electrónico")).toHaveAttribute(
    "type",
    "email",
  );
  expect(screen.getByLabelText("Dirección")).toBeInTheDocument();
  expect(screen.getByLabelText("Barrio")).toBeInTheDocument();
  expect(screen.getByLabelText("Teléfono de entrega")).toBeInTheDocument();
  expect(screen.getByLabelText("Fecha de entrega")).toBeInTheDocument();
});

test("requires valid contact and delivery details before continuing", () => {
  render(<VerificacionPage />);

  const form = document.getElementById("checkout-details") as HTMLFormElement;
  expect(form.checkValidity()).toBe(false);

  const values: Record<string, string> = {
    "contacto-nombre": "Juan",
    "contacto-apellido": "Velasco",
    "contacto-telefono": "3001234567",
    "contacto-cedula": "1234567890",
    "contacto-correo": "juan@example.com",
    direccion: "Calle 1 #2-3",
    barrio: "Centro",
    telefono: "3001234567",
    fecha_entrega: "2099-12-30",
  };
  for (const [id, value] of Object.entries(values)) {
    fireEvent.change(document.getElementById(id) as HTMLInputElement, {
      target: { value },
    });
  }

  expect(form.checkValidity()).toBe(true);
});
