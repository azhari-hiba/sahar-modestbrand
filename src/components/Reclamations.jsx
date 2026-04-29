import { useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { AlertCircle, CheckCircle2, ClipboardList, Send } from "lucide-react";
import Swal from "sweetalert2";

export default function Reclamation() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    productName: "",
    size: "",
    problem: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.problem) {
      return Swal.fire("Erreur", "Veuillez remplir les champs obligatoires (*)", "error");
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "reclamations"), {
        ...form,
        status: "pending",
        createdAt: new Date()
      });

      Swal.fire({
        title: "Envoyée !",
        text: "Votre réclamation a été reçue. Nous vous contacterons bientôt.",
        icon: "success",
        confirmButtonColor: "#8b6f5a"
      });

      setForm({ name: "", phone: "", city: "", address: "", productName: "", size: "", problem: "" });
    } catch (err) {
      Swal.fire("Erreur", "Un problème est survenu lors de l'envoi.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reclamation-page container">
      <div className="rec-header-v2">
        <h1>Réclamation / Échange</h1>
        <p>Nous sommes là pour vous aider en cas de problème avec votre commande.</p>
      </div>

      <div className="rec-grid">
        <div className="conditions-card">
          <div className="card-title">
            <AlertCircle size={22} color="#8b6f5a" />
            <h3>Conditions & Délais</h3>
          </div>
          <ul>
            <li><span>48h</span> Délai maximum après réception.</li>
            <li><span>Défauts</span> Déchirure, erreur de modèle ou fabrication.</li>
            <li><span>Justification</span> Une description détaillée est obligatoire.</li>
            <li><span>Note</span> Aucun échange sans raison valable.</li>
          </ul>
          <div className="support-notice">
            Notre équipe traitera votre demande sous 24h à 48h.
          </div>
        </div>

        <div className="rec-form-card">
          <form onSubmit={handleSubmit}>
            <div className="rec-form-grid">
              <div className="input-field">
                <label>Nom complet *</label>
                <input
                  placeholder="Votre nom"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="input-field">
                <label>Téléphone *</label>
                <input
                  placeholder="06XXXXXXXX"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="input-field">
                <label>Ville</label>
                <input
                  placeholder="Ex: Rabat"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                />
              </div>

              <div className="input-field">
                <label>Nom du Produit</label>
                <input
                  placeholder="Nom exact du produit"
                  value={form.productName}
                  onChange={e => setForm({ ...form, productName: e.target.value })}
                />
              </div>
            </div>

            <div className="input-field full-width">
              <label>Description du problème *</label>
              <textarea
                placeholder="Décrivez le problème en détail..."
                value={form.problem}
                onChange={e => setForm({ ...form, problem: e.target.value })}
                rows={4}
              />
            </div>

            <button className="rec-submit-btn" disabled={loading}>
              {loading ? "Traitement..." : <><Send size={18} /> Envoyer la demande</>}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .reclamation-page { padding: 50px 15px; background: #fdfbf9; min-height: 100vh; }
        .rec-header-v2 { text-align: center; margin-bottom: 50px; }
        .rec-header-v2 h1 { font-size: 36px; color: #2d2d2d; font-weight: 800; margin-bottom: 10px; }
        .rec-header-v2 p { color: #888; font-size: 16px; }

        .rec-grid { display: grid; grid-template-columns: 350px 1fr; gap: 30px; max-width: 1100px; margin: 0 auto; }

        /* Conditions Card */
        .conditions-card { 
          background: #fff; padding: 30px; border-radius: 20px; 
          border: 1px solid #eee; height: fit-content;
        }
        .card-title { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .card-title h3 { font-size: 18px; color: #2d2d2d; }
        
        .conditions-card ul { list-style: none; padding: 0; }
        .conditions-card li { 
          display: flex; gap: 15px; font-size: 14px; color: #666; 
          margin-bottom: 15px; line-height: 1.4;
        }
        .conditions-card li span { 
          color: #8b6f5a; font-weight: 700; min-width: 60px; 
        }

        .support-notice { 
          margin-top: 25px; padding: 15px; background: #fdfbf9; 
          border-radius: 10px; font-size: 13px; color: #8b6f5a; 
          text-align: center; border: 1px dashed #8b6f5a;
        }

        /* Form Card */
        .rec-form-card { background: #fff; padding: 40px; border-radius: 20px; border: 1px solid #eee; }
        .rec-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        
        .input-field { margin-bottom: 20px; }
        .input-field label { display: block; font-size: 14px; font-weight: 600; color: #555; margin-bottom: 8px; }
        .input-field input, .input-field textarea {
          width: 100%; padding: 14px; border: 1px solid #eee; border-radius: 10px; 
          background: #fdfdfd; outline: none; transition: 0.3s; font-size: 14px;
        }
        .input-field input:focus, .input-field textarea:focus { 
          border-color: #8b6f5a; background: #fff; box-shadow: 0 4px 12px rgba(139,111,90,0.05);
        }

        .rec-submit-btn {
          width: 100%; background: #8b6f5a; color: white; padding: 16px; 
          border-radius: 50px; border: none; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: 0.3s; display: flex; align-items: center; 
          justify-content: center; gap: 10px; margin-top: 10px;
        }
        .rec-submit-btn:hover { background: #765c49; transform: translateY(-2px); }
        .rec-submit-btn:disabled { background: #ccc; cursor: not-allowed; }

        @media (max-width: 992px) {
          .rec-grid { grid-template-columns: 1fr; }
          .rec-form-grid { grid-template-columns: 1fr; }
          .rec-header-v2 h1 { font-size: 28px; }
        }
      `}</style>
    </div>
  );
}