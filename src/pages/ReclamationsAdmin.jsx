import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import { 
  Search, Phone, MapPin, Tag, AlertTriangle, 
  CheckCircle, XCircle, Trash2, MessageSquare, Package, Calendar, Home 
} from "lucide-react";

export default function ReclamationsAdmin() {
  const [reclamations, setReclamations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "reclamations"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReclamations(data);
    });
    return () => unsub();
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "reclamations", id), { status });
  };

  const deleteReclamation = async (id) => {
    if (window.confirm("Supprimer cette réclamation définitivement ?")) {
      await deleteDoc(doc(db, "reclamations", id));
    }
  };

  const filtered = reclamations.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.phone?.includes(search) ||
    r.city?.toLowerCase().includes(search.toLowerCase()) ||
    r.productName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-rec-page container">
      <div className="admin-header">
        <h1>Gestion des Réclamations</h1>
        <p>Suivi des retours, échanges et adresses de livraison</p>
      </div>

      <div className="search-bar-admin">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Nom, téléphone, ville ou produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="reclamations-grid">
        {filtered.map((r) => (
          <div key={r.id} className={`rec-card-admin ${r.status}`}>
            <div className="rec-status-row">
              <div className="rec-badge-status">
                {r.status === 'accepted' ? <CheckCircle size={14}/> : r.status === 'rejected' ? <XCircle size={14}/> : <AlertTriangle size={14}/>}
                {r.status === 'accepted' ? 'Acceptée' : r.status === 'rejected' ? 'Refusée' : 'En attente'}
              </div>
              <span className="rec-date">
                <Calendar size={12} /> 
                {r.createdAt?.toDate ? new Date(r.createdAt.toDate()).toLocaleDateString('fr-FR') : 'Récemment'}
              </span>
            </div>

            <div className="rec-main-info">
              <h3>{r.name}</h3>
              <div className="contact-actions">
                <a href={`tel:${r.phone}`} className="contact-link">
                  <Phone size={14} /> {r.phone}
                </a>
                <a 
                  href={`https://wa.me/212${r.phone?.replace(/^0/, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="contact-link whatsapp"
                >
                  <MessageSquare size={14} /> WhatsApp
                </a>
              </div>
            </div>

            <hr className="divider" />

            <div className="rec-details-grid">
              <div className="detail-item">
                <Package size={16} />
                <div className="detail-text">
                  <label>Produit / Taille</label>
                  <span>{r.productName || "Inconnu"} - {r.size || "-"}</span>
                </div>
              </div>
              <div className="detail-item">
                <MapPin size={16} />
                <div className="detail-text">
                  <label>Ville</label>
                  <span>{r.city || "Non spécifiée"}</span>
                </div>
              </div>
              {/* عرض العنوان الكامل */}
              <div className="detail-item full-width-detail">
                <Home size={16} />
                <div className="detail-text">
                  <label>Adresse Exacte</label>
                  <span className="address-text">{r.address || "Aucune adresse fournie"}</span>
                </div>
              </div>
            </div>

            <div className="problem-box-admin">
              <label>Message du client :</label>
              <p>{r.problem}</p>
            </div>

            <div className="admin-actions-footer">
              <button className="btn-action accept" onClick={() => updateStatus(r.id, "accepted")}>
                Accepter
              </button>
              <button className="btn-action reject" onClick={() => updateStatus(r.id, "rejected")}>
                Refuser
              </button>
              <button className="btn-delete-icon" onClick={() => deleteReclamation(r.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .admin-rec-page { padding: 40px 20px; background: #f9fafb; min-height: 100vh; font-family: sans-serif; }
        .admin-header { margin-bottom: 30px; border-left: 4px solid #8b6f5a; padding-left: 15px; }
        .admin-header h1 { font-size: 26px; color: #111; margin: 0; }
        .admin-header p { color: #666; margin: 5px 0 0; }

        .search-bar-admin { position: relative; max-width: 450px; margin-bottom: 30px; }
        .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #999; }
        .search-bar-admin input { 
          width: 100%; padding: 12px 12px 12px 45px; border-radius: 10px; 
          border: 1px solid #ddd; outline: none; transition: 0.2s;
        }

        .reclamations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }

        .rec-card-admin { 
          background: white; border-radius: 14px; padding: 20px; 
          border: 1px solid #eee; display: flex; flex-direction: column; gap: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .rec-status-row { display: flex; justify-content: space-between; align-items: center; }
        .rec-badge-status { 
          padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;
          text-transform: uppercase; display: flex; align-items: center; gap: 4px;
          background: #fef3c7; color: #92400e; 
        }
        .accepted .rec-badge-status { background: #dcfce7; color: #166534; }
        .rejected .rec-badge-status { background: #fee2e2; color: #991b1b; }

        .rec-main-info h3 { margin: 0; font-size: 19px; color: #111; }
        .contact-actions { display: flex; gap: 12px; margin-top: 8px; }
        .contact-link { font-size: 13px; text-decoration: none; color: #8b6f5a; font-weight: 600; display: flex; align-items: center; gap: 4px; }
        .contact-link.whatsapp { color: #25d366; }

        .divider { border: 0; border-top: 1px solid #f0f0f0; margin: 0; }

        .rec-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .full-width-detail { grid-column: span 2; border-top: 1px dashed #f0f0f0; padding-top: 10px; }
        .detail-item { display: flex; align-items: flex-start; gap: 8px; color: #555; }
        .detail-text label { display: block; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 700; margin-bottom: 2px; }
        .detail-text span { font-size: 13px; font-weight: 500; }
        .address-text { color: #2d2d2d; line-height: 1.4; }

        .problem-box-admin { background: #f9f9f9; padding: 12px; border-radius: 8px; border: 1px solid #f0f0f0; }
        .problem-box-admin label { font-size: 11px; font-weight: 700; color: #8b6f5a; display: block; margin-bottom: 4px; }
        .problem-box-admin p { margin: 0; font-size: 13px; color: #444; line-height: 1.4; }

        .admin-actions-footer { display: flex; gap: 8px; margin-top: auto; padding-top: 10px; }
        .btn-action { flex: 1; padding: 10px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; font-size: 13px; }
        .btn-action.accept { background: #8b6f5a; color: white; }
        .btn-action.reject { background: #f3f4f6; color: #4b5563; }
        .btn-delete-icon { background: #fee2e2; color: #dc2626; border: none; padding: 8px; border-radius: 8px; cursor: pointer; }

        @media (max-width: 600px) {
          .reclamations-grid { grid-template-columns: 1fr; }
          .rec-details-grid { grid-template-columns: 1fr; }
          .full-width-detail { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}