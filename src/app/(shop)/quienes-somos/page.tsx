import "./quienes-somos.css";

export default function QuienesSomos() {
  return (
    <section className="quienes-page">
      <div className="quienes-overlay">
        <div className="quienes-container">
          <h1 className="quienes-titulo">¿Quienes Somos?</h1>
          <p className="quienes-texto">
            Somos una pastelería apasionada por crear experiencias dulces que
            combinan sabor, calidad y dedicación. Cada uno de nuestros productos
            es elaborado de manera artesanal, utilizando ingredientes
            cuidadosamente seleccionados para garantizar frescura y un sabor
            inigualable.
          </p>

          <p className="quienes-texto">
            Creemos que la repostería es más que un postre: es una forma de
            celebrar momentos especiales, compartir sonrisas y crear recuerdos.
            Por eso, trabajamos día a día con amor y atención al detalle,
            ofreciendo tortas y postres que destacan tanto por su presentación
            como por su sabor.
          </p>

          <p className="quienes-texto">
            Nuestro compromiso es brindar productos de alta calidad, hechos con
            esmero, para acompañarte en cada ocasión importante.
          </p>
        </div>
      </div>
    </section>
  );
}
