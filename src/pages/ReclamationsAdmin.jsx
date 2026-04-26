import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

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
    <div className="container">

      <h1>Réclamations</h1>

      <input
        type="text"
        placeholder="Rechercher par nom ou téléphone..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="reclamations-grid">

        {filtered.map((r) => (
          <div key={r.id} className="reclamation-card">

            <div className="rec-header">
              <h3>{r.name}</h3>
              <span className={`status ${r.status}`}>
                {r.status}
              </span>
            </div>

            <p>
              <strong>📞 Téléphone:</strong>{" "}
              <a href={`tel:${r.phone}`} className="phone-link">
                {r.phone}
              </a>
            </p>

            <p><strong>🏙️ Ville:</strong> {r.city || "-"}</p>
            <p><strong>📍 Adresse:</strong> {r.address || "-"}</p>

            <p><strong>🛍️ Produit:</strong> {r.productName || "-"}</p>
            <p><strong>📏 Taille:</strong> {r.size || "-"}</p>

            <p className="problem">
              <strong>⚠️ Problème:</strong><br />
              {r.problem}
            </p>

            <div className="actions">
              <button
                className="accept"
                onClick={() => updateStatus(r.id, "accepted")}
              >
                Accepter
              </button>

              <button
                className="refuse"
                onClick={() => updateStatus(r.id, "rejected")}
              >
                Refuser
              </button>

              <button
                className="delete"
                onClick={() => deleteReclamation(r.id)}
              >
                Supprimer
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}