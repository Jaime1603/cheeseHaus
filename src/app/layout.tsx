import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "CheeseHaus | Reposteria Artesanal", //titulo que aparece en la pestaña del navegador
  description: "Reposteria artesanal hecha con amor en Cali, Colombia", // Descripción para motores de búsqueda (SEO)
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.google.com/specimen/Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        {/* Envolvemos children en main, etiqueta semántica
            para el contenido principal de la página */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
