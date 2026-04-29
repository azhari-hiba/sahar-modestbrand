import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Plus, Trash2, Edit3, Check, X, Tag } from "lucide-react";
import Swal from "sweetalert2";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchCollections = async () => {
    const snap = await getDocs(collection(db, "collections"));
    setCollections(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchCollections(); }, []);

  const add = async () => {
    if (!name.trim()) return;
    await addDoc(collection(db, "collections"), { name });
    setName("");
    fetchCollections();
  };

  const remove = async (id) => {
    const res = await Swal.fire({ title: "Supprimer cette collection ?", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (res.isConfirmed) {
      await deleteDoc(doc(db, "collections", id));
      fetchCollections();
    }
  };

  const saveEdit = async () => {
    if (!editName.trim()) return;
    await updateDoc(doc(db, "collections", editId), { name: editName });
    setEditId(null);
    setEditName("");
    fetchCollections();
  };

  return (
    <div className="admin-page container">
      <h1>Gestion des Collections</h1>
      
      <div className="admin-card-form">
        <input 
          placeholder="Nouvelle collection..." 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <button className="add-btn" onClick={add}><Plus size={18} /> Ajouter</button>
      </div>

      <div className="collections-list">
        {collections.map(c => (
          <div key={c.id} className="collection-row">
            {editId === c.id ? (
              <div className="edit-mode">
                <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                <button onClick={saveEdit} className="save"><Check size={16} /></button>
                <button onClick={() => setEditId(null)} className="cancel"><X size={16} /></button>
              </div>
            ) : (
              <div className="view-mode">
                <span><Tag size={16} /> {c.name}</span>
                <div className="actions">
                  <button onClick={() => { setEditId(c.id); setEditName(c.name); }}><Edit3 size={16} /></button>
                  <button onClick={() => remove(c.id)} className="del"><Trash2 size={16} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .admin-page { padding: 40px 20px; max-width: 600px; margin: 0 auto; }
        .admin-card-form { display: flex; gap: 10px; margin-bottom: 30px; }
        .admin-card-form input { flex: 1; padding: 12px; border-radius: 10px; border: 1px solid #eee; outline: none; }
        .add-btn { background: #8b6f5a; color: white; border: none; padding: 0 20px; border-radius: 10px; display: flex; align-items: center; gap: 5px; cursor: pointer; }
        
        .collection-row { background: white; padding: 15px 20px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 10px; }
        .view-mode, .edit-mode { display: flex; align-items: center; gap: 10px; }
        .view-mode span { flex: 1; font-weight: 600; color: #444; display: flex; align-items: center; gap: 8px; }
        .actions { display: flex; gap: 5px; }
        .actions button { padding: 8px; border-radius: 8px; border: none; cursor: pointer; background: #fdfbf9; }
        .del { color: #b91c1c; background: #fee2e2 !important; }
        
        .edit-mode input { flex: 1; padding: 8px; border: 1px solid #8b6f5a; border-radius: 6px; }
        .save { background: #dcfce7; color: #166534; border: none; padding: 8px; border-radius: 6px; cursor: pointer; }
        .cancel { background: #fee2e2; color: #b91c1c; border: none; padding: 8px; border-radius: 6px; cursor: pointer; }
      `}</style>
    </div>
  );
}