import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { Search, Phone, MapPin, Tag, AlertTriangle, CheckCircle, XCircle, Trash2 } from "lucide-react";

export default function ReclamationsAdmin() {
  const [reclamations, setReclamations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reclamations"), (snap) => {
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
    if (window.confirm("Supprimer cette réclamation ?")) {
      await deleteDoc(doc(db, "reclamations", id));
    }
  };

  const filtered = reclamations.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.phone?.includes(search)
  );

  return (
    <div className="admin-rec-page container">
      <div className="admin-header">
        <h1>Gestion des Réclamations</h1>
        <p>Gérez les retours et les échanges de vos clientes</p>
      </div>

      <div className="search-bar-admin">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher par nom ou téléphone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="reclamations-grid">
        {filtered.map((r) => (
          <div key={r.id} className={`rec-card-admin ${r.status}`}>
            <div className="rec-badge-status">
               {r.status === 'accepted' ? <CheckCircle size={14}/> : r.status === 'rejected' ? <XCircle size={14}/> : <AlertTriangle size={14}/>}
               {r.status || 'En attente'}
            </div>

            <div className="rec-main-info">
              <h3>{r.name}</h3>
              <a href={`tel:${r.phone}`} className="phone-btn">
                <Phone size={16} /> {r.phone}
              </a>
            </div>

            <hr />

            <div className="rec-details">
              <div className="detail-row">
                <MapPin size={16} />
                <span>{r.city || "-"}, {r.address || "-"}</span>
              </div>
              <div className="detail-row">
                <Tag size={16} />
                <span>{r.productName || "Produit inconnu"} (Taille: {r.size || "-"})</span>
              </div>
            </div>

            <div className="problem-box">
              <label>Description du problème:</label>
              <p>{r.problem}</p>
            </div>

            <div className="admin-actions">
              <button className="btn-acc" onClick={() => updateStatus(r.id, "accepted")}>
                Accepter
              </button>
              <button className="btn-ref" onClick={() => updateStatus(r.id, "rejected")}>
                Refuser
              </button>
              <button className="btn-del" onClick={() => deleteReclamation(r.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .admin-rec-page { padding: 40px 20px; background: #f8f9fa; min-height: 100vh; }
        .admin-header { margin-bottom: 30px; border-left: 5px solid #8b6f5a; padding-left: 20px; }
        .admin-header h1 { font-size: 28px; color: #2d2d2d; margin-bottom: 5px; }
        .admin-header p { color: #888; font-size: 14px; }

        .search-bar-admin { 
          position: relative; max-width: 500px; margin-bottom: 40px; 
        }
        .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #aaa; }
        .search-bar-admin input { 
          width: 100%; padding: 15px 15px 15px 45px; border-radius: 12px; 
          border: 1px solid #ddd; outline: none; font-size: 15px;
          transition: 0.3s;
        }
        .search-bar-admin input:focus { border-color: #8b6f5a; box-shadow: 0 4px 12px rgba(139,111,90,0.1); }

        .reclamations-grid { 
          display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 25px; 
        }

        .rec-card-admin { 
          background: white; border-radius: 16px; padding: 25px; 
          border: 1px solid #eee; position: relative; transition: 0.3s;
          display: flex; flex-direction: column; gap: 15px;
        }
        .rec-card-admin:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }

        .rec-badge-status { 
          align-self: flex-start; padding: 5px 12px; border-radius: 50px; 
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          display: flex; align-items: center; gap: 5px;
          background: #fff4e5; color: #b45309; /* Pending */
        }
        .rec-card-admin.accepted .rec-badge-status { background: #dcfce7; color: #15803d; }
        .rec-card-admin.rejected .rec-badge-status { background: #fee2e2; color: #b91c1c; }

        .rec-main-info h3 { font-size: 20px; color: #2d2d2d; margin-bottom: 10px; }
        .phone-btn { 
          display: inline-flex; align-items: center; gap: 8px; 
          color: #8b6f5a; text-decoration: none; font-weight: 600; font-size: 15px;
        }

        .rec-details { display: flex; flex-direction: column; gap: 10px; }
        .detail-row { display: flex; align-items: center; gap: 10px; color: #666; font-size: 14px; }

        .problem-box { 
          background: #fdfbf9; padding: 15px; border-radius: 10px; border: 1px dashed #ddd;
        }
        .problem-box label { display: block; font-size: 12px; font-weight: 800; color: #888; margin-bottom: 5px; text-transform: uppercase; }
        .problem-box p { font-size: 14px; color: #444; line-height: 1.5; }

        .admin-actions { 
          display: flex; gap: 10px; margin-top: auto; padding-top: 15px;
        }
        .admin-actions button { 
          flex: 1; padding: 10px; border-radius: 8px; border: none; 
          font-weight: 700; cursor: pointer; transition: 0.2s; font-size: 13px;
        }
        .btn-acc { background: #15803d; color: white; }
        .btn-ref { background: #eee; color: #444; }
        .btn-del { background: #fee2e2; color: #b91c1c; flex: 0 0 50px !important; }
        
        .btn-acc:hover { background: #166534; }
        .btn-ref:hover { background: #ddd; }
        .btn-del:hover { background: #fecaca; }

        @media (max-width: 768px) {
          .reclamations-grid { grid-template-columns: 1fr; }
          .admin-rec-page { padding: 20px 15px; }
        }
      `}</style>
    </div>
  );
}