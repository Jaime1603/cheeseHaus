import { fireEvent, render, screen, within } from "@testing-library/react";
import ProductoGrid from "@/components/productos/productoGrid";
import type { ProductoConCategoria } from "@/services/productosService";

const productos: ProductoConCategoria[] = [
  {
    id_producto: 1,
    id_categoria: 1,
    nombre_producto: "Cheesecake",
    descripcion: "",
    precio: 10,
    ingredientes: "",
    imagen_url: "/cheesecake.png",
    tamaño: null,
    activo: true,
    categoria: { id_categoria: 1, nombre_categoria: "Tortas" },
  },
  {
    id_producto: 2,
    id_categoria: 2,
    nombre_producto: "Alfajor",
    descripcion: "",
    precio: 5,
    ingredientes: "",
    imagen_url: "/alfajor.png",
    tamaño: null,
    activo: true,
    categoria: { id_categoria: 2, nombre_categoria: "Galletas" },
  },
  {
    id_producto: 3,
    id_categoria: 1,
    nombre_producto: "Brownie",
    descripcion: "",
    precio: 8,
    ingredientes: "",
    imagen_url: "/brownie.png",
    tamaño: null,
    activo: true,
    categoria: { id_categoria: 1, nombre_categoria: "Tortas" },
  },
];

function getProductIds() {
  return screen
    .getAllByRole("link")
    .map((link) => link.getAttribute("href"));
}

test("ordena por nombre y precio y combina categoría con los filtros", () => {
  render(<ProductoGrid productos={productos} />);

  const orden = screen.getByRole("combobox", { name: "Ordenar productos" });
  fireEvent.change(orden, { target: { value: "nombre" } });
  expect(getProductIds()).toEqual([
    "/productos/2",
    "/productos/3",
    "/productos/1",
  ]);

  fireEvent.change(orden, { target: { value: "precio-asc" } });
  expect(getProductIds()).toEqual([
    "/productos/2",
    "/productos/3",
    "/productos/1",
  ]);

  fireEvent.change(orden, { target: { value: "precio-desc" } });
  expect(getProductIds()).toEqual([
    "/productos/1",
    "/productos/3",
    "/productos/2",
  ]);

  fireEvent.change(
    screen.getByRole("combobox", { name: "Filtrar por categoría" }),
    { target: { value: "1" } },
  );

  expect(getProductIds()).toEqual(["/productos/1", "/productos/3"]);

  fireEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));

  expect(getProductIds()).toEqual([
    "/productos/1",
    "/productos/2",
    "/productos/3",
  ]);
  expect(
    within(screen.getByRole("combobox", { name: "Ordenar productos" })).getByRole(
      "option",
      { name: "Ordenar por: Relevancia" },
    ),
  ).toBeInTheDocument();
});
