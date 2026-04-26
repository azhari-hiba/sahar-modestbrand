import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-container">

        <div className="hero-image">
          <img src={logo} alt="Sahar" />
        </div>

        <div className="hero-texts">
          <span className="hero-badge">
            SAHAR — Mode élégante & moderne
          </span>

          <h1>
            Élégance . Style . <br />
            Modernité
          </h1>

          <p>
            Découvrez nos collections et une sélection d’articles
            pensés pour un style élégant, moderne et raffiné.
          </p>

          <div className="hero-buttons">
            <button
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 200);
              }}
            >
              Voir les produits
            </button>

            <button className="outline">
              Nos collections
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}