import { useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { AlertCircle, Send, User, Phone, MapPin, Package, MessageSquare } from "lucide-react";
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
    if (!form.name || !form.phone || !form.problem || !form.city || !form.address) {
      return Swal.fire("Erreur", "Veuillez remplir les champs obligatoires (*)", "error");
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "reclamations"), {
        ...form,
        status: "pending",
        createdAt: serverTimestamp()
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

      <div className="rec-content-wrapper">
        {/* 1. الشروط والآجال هي الأولى الفوق */}
        <div className="conditions-full-width">
          <div className="conditions-card-v2">
            <div className="card-title">
              <AlertCircle size={22} color="#8b6f5a" />
              <h3>Conditions & Délais importants</h3>
            </div>
            <div className="conditions-grid">
              <div className="cond-item"><span>48h</span> Délai maximum après réception.</div>
              <div className="cond-item"><span>Défauts</span> Déchirure ou erreur de modèle.</div>
              <div className="cond-item"><span>Justification</span> Description détaillée obligatoire.</div>
              <div className="cond-item"><span>Note</span> Aucun échange sans raison valable.</div>
            </div>
            <div className="support-notice-v2">
              🚀 Notre équipe traitera votre demande sous 24h à 48h.
            </div>
          </div>
        </div>

        {/* 2. الفورم يجي تحتها مباشرة */}
        <div className="rec-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="section-title"><User size={18}/> Informations Personnelles</div>
              <div className="input-row">
                <div className="input-field">
                  <label>Nom complet *</label>
                  <input placeholder="Votre nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="input-field">
                  <label>Téléphone *</label>
                  <input placeholder="06XXXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title"><MapPin size={18}/> Localisation</div>
              <div className="input-row">
                <div className="input-field flex-small">
                  <label>Ville *</label>
                  <input placeholder="Ex: Casa" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="input-field flex-large">
                  <label>Adresse exacte *</label>
                  <input placeholder="Quartier, Rue, N°" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title"><Package size={18}/> Détails du Produit</div>
              <div className="input-row">
                <div className="input-field flex-large">
                  <label>Nom du Produit</label>
                  <input placeholder="Ex: Abaya Silk" value={form.productName} onChange={e => setForm({ ...form, productName: e.target.value })} />
                </div>
                <div className="input-field flex-small">
                  <label>Taille</label>
                  <input placeholder="XL / Std" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title"><MessageSquare size={18}/> Votre Message</div>
              <div className="input-field full-width">
                <label>Description du problème *</label>
                <textarea placeholder="Décrivez le problème..." value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })} rows={4} />
              </div>
            </div>

            <button className="rec-submit-btn" disabled={loading}>
              {loading ? "Traitement..." : <><Send size={18} /> Envoyer la demande</>}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .reclamation-page { padding: 40px 15px; background: #fdfbf9; min-height: 100vh; }
        .rec-header-v2 { text-align: center; margin-bottom: 30px; }
        .rec-header-v2 h1 { font-size: clamp(24px, 5vw, 32px); color: #2d2d2d; font-weight: 800; }
        .rec-header-v2 p { color: #888; font-size: 15px; margin-top: 8px; }

        .rec-content-wrapper { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; }

        /* Style Conditions */
        .conditions-card-v2 { 
          background: #fff; padding: 25px; border-radius: 15px; border: 1px solid #eee;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .conditions-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 15px; margin: 20px 0;
        }
        .cond-item { font-size: 14px; color: #666; line-height: 1.4; display: flex; align-items: center; gap: 10px; }
        .cond-item span { color: #8b6f5a; font-weight: 800; background: #fdfbf9; padding: 2px 8px; border-radius: 5px; }

        .support-notice-v2 { 
          background: #fdfbf9; padding: 12px; border-radius: 10px; border: 1px dashed #8b6f5a;
          color: #8b6f5a; font-size: 14px; text-align: center; font-weight: 600;
        }

        /* Style Form */
        .rec-form-card { background: #fff; padding: clamp(20px, 5vw, 40px); border-radius: 20px; border: 1px solid #eee; }
        .input-row { display: flex; flex-wrap: wrap; gap: 20px; }
        .input-field { flex: 1 1 250px; display: flex; flex-direction: column; }
        .flex-small { flex: 1 1 150px; }
        .flex-large { flex: 2 1 300px; }
        .full-width { flex: 1 1 100%; }

        .form-section { margin-bottom: 25px; }
        .section-title { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #8b6f5a; margin-bottom: 15px; font-size: 15px; }
        
        .input-field label { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 8px; }
        .input-field input, .input-field textarea {
          width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 10px; 
          background: #fdfdfd; outline: none; transition: 0.3s; font-size: 14px; box-sizing: border-box;
        }
        .input-field input:focus, .input-field textarea:focus { border-color: #8b6f5a; background: #fff; }

        .rec-submit-btn {
          width: 100%; background: #8b6f5a; color: white; padding: 16px; 
          border-radius: 50px; border: none; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .rec-submit-btn:hover { background: #765c49; transform: translateY(-2px); }

        @media (max-width: 600px) {
          .input-row { gap: 15px; }
          .input-field { flex: 1 1 100%; }
        }
      `}</style>
    </div>
  );
}