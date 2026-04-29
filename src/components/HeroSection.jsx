import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="hero-v2">
      <div className="hero-bg-logo-wrapper">
        <img src={logo} alt="" className="bg-logo-img" />
      </div>
      
      <div className="hero-content-wrapper">
        <div className="hero-text-side">
          <span className="hero-mini-tag">SAHAR — EXCLUSIVE COLLECTION</span>
          <h1 className="hero-main-title">
            Élégance . Style  <br /> 
            <span>Modernité</span>
          </h1>
          <p className="hero-subtext">
            Découvrez l'essence de la mode modeste avec nos collections 
            conçues pour la femme moderne et raffinée.
          </p>
          <div className="hero-action-btns">
            <button className="btn-primary" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
              Voir les produits
            </button>
            
          </div>
        </div>
      </div>

      <style>{`
        .hero-v2 {
          position: relative;
          background: #fdfbf9; 
          padding: 80px 20px;
          min-height: 65vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-bg-logo-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          width: 100%;
          display: flex;
          justify-content: center;
          pointer-events: none;
        }

        .bg-logo-img {
          width: 450px; 
          height: auto;
          opacity: 0.08; 
          object-fit: contain;
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 2;
          max-width: 800px;
          text-align: center;
        }

        .hero-mini-tag { color: #8b6f5a; font-weight: 600; font-size: 13px; letter-spacing: 2px; margin-bottom: 15px; display: block; }
        .hero-main-title { font-size: 58px; line-height: 1.1; color: #2d2d2d; font-weight: 800; margin: 0; }
        .hero-main-title span { color: #8b6f5a; font-style: italic; }
        .hero-subtext { font-size: 18px; color: #666; margin: 25px auto; max-width: 600px; line-height: 1.6; }
        
        .hero-action-btns { display: flex; gap: 15px; justify-content: center; }
        .btn-primary { background: #8b6f5a; color: white; padding: 16px 35px; border-radius: 50px; border: none; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .btn-outline { background: transparent; color: #8b6f5a; padding: 16px 35px; border-radius: 50px; border: 1px solid #8b6f5a; font-weight: 600; cursor: pointer; }

        @media (max-width: 768px) {
          .hero-main-title { font-size: 38px; }
          .bg-logo-img { width: 280px; } 
          .hero-action-btns { flex-direction: column; width: 100%; }
          .btn-primary, .btn-outline { width: 100%; }
        }
      `}</style>
    </section>
  );
}