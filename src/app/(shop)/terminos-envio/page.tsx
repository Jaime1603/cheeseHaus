import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "../legal/legal-page";

export const metadata: Metadata = {
  title: "Términos de envío | CheeseHaus",
  description: "Información sobre costos, cobertura y entregas de CheeseHaus.",
};

const sections: LegalSection[] = [
  {
    title: "Cobertura y disponibilidad",
    paragraphs: [
      "La cobertura de entrega comprende la ciudad de Cali, únicamente en zonas que el transportista considere seguras para la operación. La posibilidad de entrega se valida según la dirección y las condiciones operativas al momento de realizar el pedido.",
      "La disponibilidad depende del producto solicitado, su cantidad y los pedidos recibidos. CheeseHaus confirmará contigo la disponibilidad y el plazo de entrega antes de aceptar el pedido.",
    ],
  },
  {
    title: "Costo del envío",
    paragraphs: [
      "El checkout calcula actualmente un valor de envío de $5.000 COP por pedido. Revisa el total que aparece antes de confirmar; el costo aplicable debe mostrarse junto con el precio de los productos antes de finalizar la compra.",
    ],
  },
  {
    title: "Fecha y plazo de entrega",
    paragraphs: [
      "El plazo se define de acuerdo con la disponibilidad del producto y la cantidad de pedidos recibidos. La fecha o el plazo acordado se comunicará antes de finalizar la compra. Si no es posible cumplirlo, contáctanos para resolverlo conforme a la normativa colombiana de protección al consumidor.",
    ],
  },
  {
    title: "Datos de entrega y novedades",
    bullets: [
      "Verifica que la dirección, barrio, ciudad y teléfono estén completos y sean correctos.",
      "Procura que una persona pueda recibir el pedido en la dirección indicada.",
      "Para solicitar cancelaciones, cambios, devoluciones o presentar reclamos sobre retrasos, errores, daños o pedidos no recibidos, comunícate por WhatsApp al 312 807 6425, de lunes a viernes de 8:00 a. m. a 4:00 p. m. Incluye el número del pedido.",
    ],
  },
  {
    title: "Derechos del consumidor",
    paragraphs: [
      "Las solicitudes y reclamaciones se atenderán de acuerdo con la ley colombiana. Estas condiciones no limitan los derechos reconocidos al consumidor.",
    ],
  },
];

export default function TerminosEnvioPage() {
  return (
    <LegalPage
      title="Términos de envío"
      description="Información para coordinar el costo, la dirección y la entrega de tus pedidos."
      notice="La entrega está sujeta a la evaluación de seguridad del transportista y a la disponibilidad del producto y de la operación."
      sections={sections}
    />
  );
}
