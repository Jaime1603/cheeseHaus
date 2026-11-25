import "./legal-page.css";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export default function LegalPage({
  title,
  description,
  sections,
  notice,
}: {
  title: string;
  description: string;
  sections: LegalSection[];
  notice?: string;
}) {
  return (
    <div className="legal-page">
      <div className="legal-page__inner">
        <header className="legal-page__header">
          <p className="legal-page__eyebrow">CheeseHaus · Cali, Colombia</p>
          <h1>{title}</h1>
          <p className="legal-page__intro">{description}</p>
        </header>
        {notice && <aside className="legal-page__notice">{notice}</aside>}
        <div className="legal-page__sections">
          {sections.map((section) => (
            <section className="legal-page__section" key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        <p className="legal-page__contact">
          ¿Tienes preguntas? Escríbenos a{" "}
          <a href="mailto:atencion_cliente@CheeseHaus.com">
            atencion_cliente@CheeseHaus.com
          </a>{" "}
          o por WhatsApp al{" "}
          <a href="https://wa.me/573128076425" target="_blank" rel="noreferrer">
            312 807 6425
          </a>
          .
        </p>
      </div>
    </div>
  );
}

