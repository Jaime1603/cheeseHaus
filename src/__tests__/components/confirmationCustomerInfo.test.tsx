import { fireEvent, render, screen } from "@testing-library/react";
import {
  ConfirmationActions,
  ConfirmationContactCard,
} from "@/components/checkout/confirmationCustomerInfo";
import { guardarDatosEntrega, obtenerSnapshotEntrega } from "@/lib/carrito";

beforeEach(() => {
  sessionStorage.clear();
});

test("shows the contact values entered during checkout", () => {
  guardarDatosEntrega(
    JSON.stringify({
      direccion: "Calle 1 #2-3",
      barrio: "Centro",
      ciudad: "Cali",
      telefono: "3001234567",
      fecha_entrega: "2099-12-30",
      contacto: {
        nombre: "Juan",
        apellido: "Velasco",
        telefono: "3007654321",
        cedula: "1234567890",
        correo: "juan@example.com",
      },
    }),
  );

  render(<ConfirmationContactCard />);

  expect(screen.getByRole("heading", { name: "Tu información" })).toBeInTheDocument();
  expect(screen.getByText("Nombre: Juan Velasco")).toBeInTheDocument();
  expect(screen.getByText("Cédula: 1234567890")).toBeInTheDocument();
  expect(screen.getByText("Teléfono: 3007654321")).toBeInTheDocument();
  expect(screen.getByText("Correo: juan@example.com")).toBeInTheDocument();
});

test("shows a fallback when contact data is unavailable", () => {
  render(<ConfirmationContactCard />);

  expect(screen.getByRole("status")).toHaveTextContent(
    "No hay información de contacto para este pedido.",
  );
});

test("clears checkout contact data when leaving the confirmation page", () => {
  guardarDatosEntrega(JSON.stringify({ contacto: { nombre: "Juan" } }));
  render(<ConfirmationActions />);

  fireEvent.click(screen.getByRole("link", { name: "Ver mis pedidos" }));

  expect(obtenerSnapshotEntrega()).toBe("");
});
