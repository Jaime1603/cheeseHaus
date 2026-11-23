import { render, screen } from "@testing-library/react";
import OrderSummary from "@/components/checkout/orderSummary";

const item = {
  id_producto: 9,
  nombre_producto: "Cheesecake",
  precio: 25000,
  cantidad: 2,
  tamaño: "8 porciones",
  imagen_url: "/cheesecake.png",
};

test("shows line items and totals including delivery", () => {
  render(<OrderSummary items={[item]} />);

  expect(screen.getByText("Cheesecake")).toBeInTheDocument();
  expect(screen.getByText("8 porciones × 2")).toBeInTheDocument();
  expect(screen.getByAltText("Cheesecake")).toHaveAttribute(
    "src",
    "/cheesecake.png",
  );
  expect(screen.getByText("Subtotal")).toBeInTheDocument();
  expect(screen.getByText("Envío")).toBeInTheDocument();
  expect(screen.getByText("Total")).toBeInTheDocument();
  expect(screen.getAllByText(/50\.000/)).toHaveLength(2);
  expect(screen.getByText(/55\.000/)).toBeInTheDocument();
});

test("does not charge delivery for an empty cart", () => {
  render(<OrderSummary items={[]} />);

  expect(screen.getAllByText(/0/).length).toBeGreaterThan(0);
});
