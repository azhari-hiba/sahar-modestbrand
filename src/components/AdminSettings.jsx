import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Trash2, MessageCircle, Settings as SettingsIcon } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminSettings() {
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ref = doc(db, "settings", "contact");

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setWhatsapp(snap.data().whatsapp || "");
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!whatsapp) {
      return Swal.fire("Erreur", "Veuillez entrer un numéro WhatsApp (ex: 212600000000)", "error");
    }

    try {
      setLoading(true);
      await updateDoc(ref, { whatsapp: whatsapp });
      Swal.fire({
        title: "Succès",
        text: "Numéro WhatsApp mis à jour avec succès ✔",
        icon: "success",
        confirmButtonColor: "#8b6f5a"
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Un problème est survenu lors de la mise à jour", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Confirmation",
      text: "Voulez-vous vraiment supprimer le numéro ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#ccc",
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        await updateDoc(ref, { whatsapp: "" });
        setWhatsapp("");
        Swal.fire("Supprimé", "Le numéro a été supprimé", "success");
      } catch (err) {
        Swal.fire("Erreur", "Un problème est survenu", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-settings-page">
      <div className="container">
        <header className="settings-header">
          <button onClick={() => navigate("/admin")} className="back-btn-v2">
            <ArrowLeft size={18} /> <span>Retour</span>
          </button>
          <div className="settings-title">
            <SettingsIcon size={24} color="#8b6f5a" />
            <h1>Paramètres Généraux</h1>
          </div>
        </header>

        <div className="settings-grid">
          <div className="settings-card">
            <div className="card-head">
              <MessageCircle size={24} color="#25D366" />
              <h3>Configuration WhatsApp</h3>
            </div>
            <p className="card-desc">Ce numéro sera utilisé pour le bouton de contact direct sur votre boutique.</p>
            
            <div className="input-group-v2">
              <label>Numéro WhatsApp (Format International)</label>
              <input
                type="text"
                placeholder="2126XXXXXXXX"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
              <small>Exemple: 212612345678 (Sans le + et sans les zéros au début)</small>
            </div>

            <div className="settings-actions">
              <button 
                className="save-btn-v2" 
                onClick={handleSave} 
                disabled={loading}
              >
                <Save size={18} /> {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
              
              <button 
                className="delete-btn-minimal" 
                onClick={handleDelete} 
                disabled={loading}
              >
                <Trash2 size={18} /> Supprimer
              </button>
            </div>
          </div>

          <div className="info-side-card">
            <h4>Aide & Conseils</h4>
            <ul>
              <li>Utilisez toujours le code indicatif du pays (212 pour le Maroc).</li>
              <li>Le numéro apparaîtra sur toutes les fiches produits.</li>
              <li>Assurez-vous que le numéro est bien lié à un compte WhatsApp actif.</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .admin-settings-page {
          background: #fdfbf9;
          min-height: 100vh;
          padding: 40px 15px;
        }
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .settings-title { display: flex; align-items: center; gap: 12px; }
        .settings-title h1 { font-size: 24px; color: #2d2d2d; margin: 0; font-weight: 800; }

        .back-btn-v2 {
          display: flex; align-items: center; gap: 8px;
          background: #fff; border: 1px solid #f0eee8;
          padding: 8px 16px; border-radius: 50px; cursor: pointer;
          font-weight: 600; color: #888; transition: 0.3s;
        }
        .back-btn-v2:hover { background: #8b6f5a; color: #fff; }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 30px;
        }

        .settings-card {
          background: white;
          padding: 30px;
          border-radius: 24px;
          border: 1px solid #f0eee8;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .card-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .card-head h3 { margin: 0; font-size: 18px; color: #2d2d2d; }
        .card-desc { color: #888; font-size: 14px; margin-bottom: 25px; }

        .input-group-v2 { margin-bottom: 25px; }
        .input-group-v2 label { display: block; margin-bottom: 8px; font-weight: 600; color: #444; font-size: 14px; }
        .input-group-v2 input {
          width: 100%; padding: 14px; border-radius: 12px;
          border: 1px solid #e2e8f0; font-size: 16px; background: #f8fafc;
          transition: 0.3s;
        }
        .input-group-v2 input:focus { border-color: #8b6f5a; outline: none; background: #fff; }
        .input-group-v2 small { color: #aaa; font-size: 12px; margin-top: 8px; display: block; }

        .settings-actions { display: flex; gap: 15px; align-items: center; }
        
        .save-btn-v2 {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: #8b6f5a; color: white; border: none;
          padding: 14px; border-radius: 12px; font-weight: 700;
          cursor: pointer; transition: 0.3s;
        }
        .save-btn-v2:hover { background: #765c49; transform: translateY(-2px); }

        .delete-btn-minimal {
          display: flex; align-items: center; gap: 8px;
          background: none; border: none; color: #d33;
          font-weight: 600; cursor: pointer; padding: 10px;
        }

        .info-side-card {
          background: #f8fafc; padding: 25px; border-radius: 20px;
          border: 1px dashed #cbd5e1;
        }
        .info-side-card h4 { margin-top: 0; color: #334155; }
        .info-side-card ul { padding-left: 20px; color: #64748b; font-size: 13px; line-height: 1.6; }

        @media (max-width: 768px) {
          .settings-grid { grid-template-columns: 1fr; }
          .settings-header { flex-direction: column; gap: 20px; text-align: center; }
        }
      `}</style>
    </div>
  );
}