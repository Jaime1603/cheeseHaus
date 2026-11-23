import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PagoPage from "@/app/checkout/pago/page";
import { useCarrito, useDatosEntrega } from "@/hooks/useCarrito";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("@/hooks/useCarrito", () => ({
  useCarrito: jest.fn(),
  useDatosEntrega: jest.fn(),
}));

const mockReplace = jest.fn();
const items = [
  {
    id_producto: 9,
    nombre_producto: "Cheesecake",
    precio: 25000,
    cantidad: 1,
    tamaño: "8 porciones",
    imagen_url: "/cheesecake.png",
  },
];
const datosEntrega = {
  direccion: "Calle 1 #2-3",
  barrio: "Centro",
  ciudad: "Cali",
  telefono: "3001234567",
  fecha_entrega: "2099-12-30",
  contacto: {
    nombre: "Juan",
    apellido: "Velasco",
    telefono: "3001234567",
    cedula: "1234567890",
    correo: "juan@example.com",
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace, back: jest.fn() });
  (useCarrito as jest.Mock).mockReturnValue(items);
  (useDatosEntrega as jest.Mock).mockReturnValue(datosEntrega);
});

function chooseCard() {
  fireEvent.click(screen.getByRole("radio", { name: "Tarjeta" }));
}

test("shows required card fields only when the card method is selected", () => {
  render(<PagoPage />);

  expect(screen.queryByLabelText("Nombre del titular")).not.toBeInTheDocument();
  chooseCard();

  expect(screen.getByLabelText("Nombre del titular")).toBeRequired();
  expect(screen.getByLabelText("Número de tarjeta")).toBeRequired();
  expect(screen.getByLabelText("Vencimiento")).toBeRequired();
  expect(screen.getByLabelText("CVV / CVC")).toBeRequired();
  expect(screen.getByText(/usa datos ficticios/i)).toBeInTheDocument();
});

test("validates the card number and security code formats", () => {
  render(<PagoPage />);
  chooseCard();

  const number = screen.getByLabelText("Número de tarjeta") as HTMLInputElement;
  const securityCode = screen.getByLabelText("CVV / CVC") as HTMLInputElement;
  fireEvent.change(number, { target: { value: "1234" } });
  fireEvent.change(securityCode, { target: { value: "12" } });

  expect(number.checkValidity()).toBe(false);
  expect(securityCode.checkValidity()).toBe(false);

  fireEvent.change(number, { target: { value: "1234567890123456" } });
  fireEvent.change(securityCode, { target: { value: "123" } });
  expect(number.checkValidity()).toBe(true);
  expect(securityCode.checkValidity()).toBe(true);
});

test("submits only the order data, never simulated card details", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ id_pedido: 31 }),
  } as unknown as Response);

  render(<PagoPage />);
  chooseCard();
  fireEvent.change(screen.getByLabelText("Nombre del titular"), {
    target: { value: "Usuario Ficticio" },
  });
  fireEvent.change(screen.getByLabelText("Número de tarjeta"), {
    target: { value: "1234567890123456" },
  });
  fireEvent.change(screen.getByLabelText("Vencimiento"), {
    target: { value: "2099-12" },
  });
  fireEvent.change(screen.getByLabelText("CVV / CVC"), {
    target: { value: "123" },
  });

  const form = screen.getByRole("button", { name: "Confirmar pedido" }).closest("form");
  expect(form).not.toBeNull();
  fireEvent.submit(form!);

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  const request = (global.fetch as jest.Mock).mock.calls[0][1];
  const body = JSON.parse(request.body);

  expect(body).toEqual({
    direccion: datosEntrega.direccion,
    barrio: datosEntrega.barrio,
    ciudad: datosEntrega.ciudad,
    telefono: datosEntrega.telefono,
    fecha_entrega: datosEntrega.fecha_entrega,
    metodoPago: "Tarjeta",
    items: [{ id_producto: 9, cantidad: 1, tamaño: "8 porciones" }],
  });
  expect(JSON.stringify(body)).not.toContain("1234567890123456");
  expect(JSON.stringify(body)).not.toContain("Usuario Ficticio");
  expect(JSON.stringify(body)).not.toContain('"123"');
});
