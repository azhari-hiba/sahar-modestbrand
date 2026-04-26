import { Link } from "react-router-dom";
import { Phone, Camera, Truck, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

export default function Footer() {

  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "settings", "contact"),
      (snap) => {
        if (snap.exists()) {
          setWhatsapp(snap.data().whatsapp);
        }
      }
    );

    return () => unsub(); 
  }, []);

  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-col">
          <h2>SAHAR</h2>
          <p>
            SAHAR Modest Brand incarne l’élégance, la pudeur et le style moderne.
          </p>
        </div>

        <div className="footer-col">
          <h3>Contact</h3>

          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              <Phone size={18} /> WhatsApp
            </a>
          )}

          <a
            href="https://www.instagram.com/sahar_modestbrand"
            target="_blank"
            rel="noreferrer"
          >
            <Camera size={18} /> Instagram
          </a>
        </div>

        <div className="footer-col">
          <h3>Informations</h3>

          <p><Truck size={16} /> Livraison partout au Maroc</p>
          <p><MessageCircle size={16} /> Support rapide WhatsApp</p>
          <Link to="/reclamation" className="footer-link">
  <MessageCircle size={16} /> Réclamation / Échange
</Link>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()}{" "}
        <Link to="/admin" className="stealth-link">
          SAHAR
        </Link>{" "}
        — Tous droits réservés
      </div>

    </footer>
  );
}