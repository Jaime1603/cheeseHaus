import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "../legal/legal-page";

export const metadata: Metadata = {
  title: "Términos y condiciones | CheeseHaus",
  description:
    "Condiciones generales del sitio y solicitudes de compra en CheeseHaus.",
};

const sections: LegalSection[] = [
  {
    title: "Identificación del proveedor",
    paragraphs: [
      "El proveedor es Cheesehaus S.A., NIT 1109543297, con dirección para notificaciones en Calle 62 #12c-17, comuna 8, Cali, Colombia. Canales de atención: WhatsApp 312 807 6425, de lunes a viernes de 8:00 a. m. a 4:00 p. m., y correo atencion_cliente@CheeseHaus.com.",
    ],
  },
  {
    title: "Uso del sitio y cuentas",
    paragraphs: [
      "Al usar el sitio, te comprometes a proporcionar información completa y veraz, mantener bajo tu control tus credenciales y avisarnos si sospechas que alguien accedió a tu cuenta. El sitio permite crear una cuenta, consultar productos y registrar pedidos.",
    ],
  },
  {
    title: "Productos, precios y pedidos",
    paragraphs: [
      "Las descripciones, imágenes, tamaños, disponibilidad y precios publicados buscan representar los productos ofrecidos. La disponibilidad puede cambiar. El checkout debe mostrar el precio total, incluido el envío, antes de confirmar una compra.",
      "La confirmación del pedido debe indicar los productos, total, medio de pago y plazo de entrega acordado. Si es necesario confirmar disponibilidad, dirección o fecha, CheeseHaus debe hacerlo antes de aceptar la compra.",
    ],
  },
  {
    title: "Pagos y estado del checkout",
    paragraphs: [
      "El flujo de pago actualmente es de demostración. La opción de tarjeta no genera cobros ni guarda o transmite datos de tarjeta; PSE y contra entrega tampoco deben considerarse medios habilitados para ventas reales hasta que estén configurados y verificados.",
      "No ingreses información financiera real en el entorno de demostración. Para producción, ofrece solo medios de pago operativos e informa sus condiciones antes de confirmar el pedido.",
    ],
  },
  {
    title: "Envíos y derechos del consumidor",
    paragraphs: [
      "La cobertura, costo y fecha o plazo de entrega se rigen por la página de Términos de envío y por la información del checkout. Los derechos de retracto, reversión del pago, garantía y demás derechos aplican conforme a la legislación colombiana, incluidas sus excepciones legales.",
      "Para solicitar cancelaciones, cambios, devoluciones o presentar reclamos sobre un pedido, escríbenos por WhatsApp al 312 807 6425, de lunes a viernes de 8:00 a. m. a 4:00 p. m. Esta página no implica renuncia a derechos legales.",
    ],
  },
  {
    title: "Contenido, cambios y ley aplicable",
    paragraphs: [
      "Los textos, fotografías, marca y demás contenidos pertenecen a CheeseHaus o se usan con autorización. No los reproduzcas para fines comerciales sin permiso.",
      "Estas condiciones se interpretan conforme a las leyes de Colombia. Las controversias se tramitarán ante las autoridades competentes. Dirección para notificaciones del proveedor: Calle 62 #12c-17, comuna 8, Cali, Colombia.",
    ],
  },
];

export default function TerminosCondicionesPage() {
  return (
    <LegalPage
      title="Términos y condiciones"
      description="Condiciones generales para navegar y realizar solicitudes de compra en CheeseHaus."
      notice="El checkout actual es una demostración y no procesa pagos reales. Antes de aceptar ventas, configura los medios de pago y asegúrate de informar al comprador el plazo de entrega acordado."
      sections={sections}
    />
  );
}


