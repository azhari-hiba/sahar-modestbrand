import { Link } from "react-router-dom";
import { Award, Star, ShieldCheck, MessageCircle } from "lucide-react";

export default function About() {
  return (
    <div className="about-page-v2">
      <div className="about-hero">
        <div className="container">
          <span className="about-subtitle">Notre Histoire</span>
          <h1>À propos de SAHAR</h1>
          <div className="title-underline"></div>
        </div>
      </div>

      <div className="about-container container">
        <div className="about-intro-grid">
          <div className="intro-text">
            <p className="intro-highlight">
              SAHAR est une marque marocaine spécialisée dans la mode modeste,
              alliant élégance, simplicité et modernité.
            </p>
            <p>
              Notre objectif est d’offrir à chaque femme des pièces uniques,
              confortables et raffinées, adaptées à son quotidien tout en respectant
              ses valeurs. Chaque produit est sélectionné avec soin pour garantir qualité,
              style et satisfaction.
            </p>
          </div>
          <div className="intro-stats">
             <div className="stat-box">
                <span className="stat-num">100%</span>
                <span className="stat-label">Qualité Premium</span>
             </div>
             <div className="stat-box">
                <span className="stat-num">Maroc</span>
                <span className="stat-label">Livraison Rapide</span>
             </div>
          </div>
        </div>

        <div className="about-values">
          <div className="value-card">
            <div className="value-icon"><Award size={30} /></div>
            <h3>Qualité</h3>
            <p>Des tissus soigneusement choisis, testés et durables pour votre confort.</p>
          </div>

          <div className="value-card">
            <div className="value-icon"><Star size={30} /></div>
            <h3>Élégance</h3>
            <p>Un style moderne et raffiné qui sublime votre quotidien avec pudeur.</p>
          </div>

          <div className="value-card">
            <div className="value-icon"><ShieldCheck size={30} /></div>
            <h3>Confiance</h3>
            <p>Une relation transparente et un service client à votre écoute 7j/7.</p>
          </div>
        </div>

        <div className="about-reclamation-box">
          <div className="reclamation-content">
            <MessageCircle size={40} className="rec-icon" />
            <h2>Réclamation / Échange</h2>
            <p>
              Votre satisfaction est notre priorité. En cas de problème avec votre commande, 
              vous pouvez soumettre une réclamation dans un délai de <strong>48 heures</strong> après réception.
            </p>
            <Link to="/reclamation">
              <button className="reclamation-btn-v2">
                Faire une réclamation
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .about-page-v2 { background: #fdfbf9; padding-bottom: 80px; }
        
        .about-hero { 
          background: #f4eee9; 
          padding: 80px 20px; 
          text-align: center; 
          margin-bottom: 60px;
        }
        .about-subtitle { color: #8b6f5a; text-transform: uppercase; letter-spacing: 3px; font-weight: 700; font-size: 14px; }
        .about-hero h1 { font-size: 48px; margin: 15px 0; color: #2d2d2d; font-weight: 800; }
        .title-underline { width: 60px; height: 3px; background: #8b6f5a; margin: 0 auto; }

        .about-intro-grid { 
          display: grid; 
          grid-template-columns: 1.5fr 1fr; 
          gap: 50px; 
          margin-bottom: 80px; 
          align-items: center;
        }
        .intro-highlight { font-size: 22px; color: #8b6f5a; font-weight: 600; line-height: 1.5; margin-bottom: 20px; }
        .intro-text p { color: #666; line-height: 1.8; font-size: 16px; }
        
        .intro-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .stat-box { background: white; padding: 30px; border-radius: 15px; text-align: center; border: 1px solid #eee; }
        .stat-num { display: block; font-size: 28px; font-weight: 800; color: #2d2d2d; }
        .stat-label { font-size: 13px; color: #888; text-transform: uppercase; }

        .about-values { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
          gap: 30px; 
          margin-bottom: 80px; 
        }
        .value-card { 
          background: white; 
          padding: 40px 30px; 
          border-radius: 20px; 
          text-align: center; 
          transition: 0.3s;
          border: 1px solid #f0f0f0;
        }
        .value-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
        .value-icon { color: #8b6f5a; margin-bottom: 20px; }
        .value-card h3 { font-size: 20px; margin-bottom: 15px; color: #2d2d2d; }
        .value-card p { color: #777; font-size: 15px; line-height: 1.6; }

        .about-reclamation-box { 
          background: #2d2d2d; 
          border-radius: 30px; 
          padding: 60px 40px; 
          text-align: center; 
          color: white;
          max-width: 900px;
          margin: 0 auto;
        }
        .rec-icon { color: #8b6f5a; margin-bottom: 20px; }
        .about-reclamation-box h2 { font-size: 32px; margin-bottom: 20px; }
        .about-reclamation-box p { font-size: 16px; color: #aaa; max-width: 600px; margin: 0 auto 30px; }
        
        .reclamation-btn-v2 { 
          background: #8b6f5a; 
          color: white; 
          border: none; 
          padding: 18px 40px; 
          border-radius: 50px; 
          font-weight: 700; 
          cursor: pointer; 
          transition: 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .reclamation-btn-v2:hover { background: #765c49; transform: scale(1.05); }

        @media (max-width: 768px) {
          .about-hero h1 { font-size: 32px; }
          .about-intro-grid { grid-template-columns: 1fr; text-align: center; }
          .intro-stats { margin-top: 20px; }
          .about-reclamation-box { padding: 40px 20px; border-radius: 20px; }
          .about-reclamation-box h2 { font-size: 24px; }
        }
      `}</style>
    </div>
  );
}