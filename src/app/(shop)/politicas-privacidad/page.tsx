import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "../legal/legal-page";

export const metadata: Metadata = {
  title: "Política de privacidad | CheeseHaus",
  description: "Conoce cómo CheeseHaus trata los datos personales.",
};

const sections: LegalSection[] = [
  {
    title: "Responsable del tratamiento",
    paragraphs: [
      "Responsable del tratamiento: Cheesehaus S.A., NIT 1109543297. Dirección para notificaciones: Calle 62 #12c-17, comuna 8, Cali, Colombia. Canal de privacidad: atencion_cliente@CheeseHaus.com.",
      "",
    ],
  },
  {
    title: "Datos personales tratados",
    bullets: [
      "Identificación y contacto: nombre, apellido, documento, correo y teléfono.",
      "Entrega: dirección, barrio, ciudad, teléfono y fecha solicitada.",
      "Pedidos: productos, cantidades, valores, estado y método de pago seleccionado.",
      "Cuenta: correo, credenciales protegidas y datos técnicos necesarios para seguridad y funcionamiento.",
    ],
  },
  {
    title: "Finalidades",
    paragraphs: [
      "Tratamos datos para crear y administrar cuentas, gestionar pedidos, coordinar entregas, atender consultas y reclamos, enviar correos de verificación o recuperación de cuenta, proteger el sitio y cumplir obligaciones legales.",
      "El flujo de pago actual es de demostración: los datos de tarjeta ingresados allí no se cobran, guardan ni envían. No ingreses datos financieros reales en el checkout de prueba.",
    ],
  },
  {
    title: "Derechos y consultas",
    paragraphs: [
      "Puedes conocer, actualizar y rectificar tus datos, solicitar prueba de la autorización, preguntar por su uso, presentar reclamos y ejercer los demás derechos reconocidos por la Ley 1581 de 2012. Cuando la ley lo requiera, solicitaremos autorización e informaremos las finalidades correspondientes.",
      "Para ejercer tus derechos, escribe a atencion_cliente@CheeseHaus.com con el asunto “Protección de datos personales”, describe la solicitud e indica un medio de contacto. Se verificará tu identidad y se responderá dentro de los términos legales aplicables.",
    ],
  },
  {
    title: "Conservación, seguridad y proveedores",
    paragraphs: [
      "Conservaremos la información durante el tiempo necesario para cumplir las finalidades informadas y las obligaciones legales. Aplicamos medidas razonables para evitar pérdida, acceso o uso no autorizado.",
      "El sitio utiliza Vercel para alojamiento, Neon para la base de datos y Gmail/SMTP para el envío de correos. Estos proveedores pueden tratar los datos necesarios para prestar dichos servicios, conforme a las condiciones y garantías aplicables. Cheesehaus debe mantener documentadas las ubicaciones y condiciones de transmisión o transferencia de datos que correspondan.",
    ],
  },
  {
    title: "Actualizaciones",
    paragraphs: [
      "Esta política puede actualizarse por cambios legales o del servicio. La versión vigente se publicará en esta página.",
    ],
  },
];

export default function PoliticasPrivacidadPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      description="Qué datos personales se usan en CheeseHaus, para qué se necesitan y cómo puedes ejercer tus derechos."
      notice="Pendiente por definir: el plazo de conservación de los datos personales y los períodos aplicables a cada tipo de información."
      sections={sections}
    />
  );
}


