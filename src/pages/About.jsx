import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="about-page">

      <div className="about-container">

        <h1>À propos de SAHAR</h1>

        <p className="intro">
          SAHAR est une marque marocaine spécialisée dans la mode modeste,
          alliant élégance, simplicité et modernité.
        </p>

        <p>
          Notre objectif est d’offrir à chaque femme des pièces uniques,
          confortables et raffinées, adaptées à son quotidien tout en respectant
          ses valeurs.
        </p>

        <p>
          Chaque produit est sélectionné avec soin pour garantir qualité,
          style et satisfaction.
        </p>

        <div className="about-values">
          <div>
            <h3>Qualité</h3>
            <p>Des tissus soigneusement choisis et durables.</p>
          </div>

          <div>
            <h3>Élégance</h3>
            <p>Un style moderne et raffiné.</p>
          </div>

          <div>
            <h3>Confiance</h3>
            <p>Une relation transparente avec nos clientes.</p>
          </div>
        </div>

        <div className="about-reclamation">
          <h2>Réclamation / Échange</h2>

          <p>
            En cas de problème avec votre commande, vous pouvez soumettre
            une réclamation dans un délai de 48 heures après réception.
          </p>

          <Link to="/reclamation">
            <button className="reclamation-btn">
              Faire une réclamation
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}