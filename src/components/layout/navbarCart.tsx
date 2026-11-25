"use client";

import Link from "next/link";
import { Handbag } from "lucide-react";
import { useCarrito } from "@/hooks/useCarrito";

export default function NavbarCart() {
  const { totalItems } = useCarrito();

  return (
    <Link
      className="navbar-icon navbar-carrito"
      href="/carrito"
      aria-label="Carrito"
    >
      <Handbag size={25} strokeWidth={1.5} color="black" />
      {totalItems > 0 && (
        <span className="navbar-carrito-count">{totalItems}</span>
      )}
    </Link>
  );
}
