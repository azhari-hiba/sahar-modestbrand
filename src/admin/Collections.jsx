import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "../services/firebase";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetch = async () => {
    const snap = await getDocs(collection(db, "collections"));
    setCollections(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetch();
  }, []);

  const add = async () => {
    if (!name.trim()) return;

    await addDoc(collection(db, "collections"), { name });
    setName("");
    fetch();
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, "collections", id));
    fetch();
  };

  const startEdit = (c) => {
    setEditId(c.id);
    setEditName(c.name);
  };

  const saveEdit = async () => {
    if (!editName.trim()) return;

    await updateDoc(doc(db, "collections", editId), {
      name: editName
    });

    setEditId(null);
    setEditName("");
    fetch();
  };

  return (
    <div className="container collections-page">

      <h2>Collections</h2>

      <div className="collection-form">
        <input
          placeholder="Nom collection"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={add}>Ajouter</button>
      </div>

      <div className="collection-list">

        {collections.map(c => (
          <div key={c.id} className="collection-item">

            {editId === c.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />

                <div style={{ display: "flex", gap: "5px" }}>
                  <button onClick={saveEdit}>✔</button>
                  <button onClick={() => setEditId(null)}>✖</button>
                </div>
              </>
            ) : (
              <>
                <span>{c.name}</span>

                <div style={{ display: "flex", gap: "5px" }}>
                  <button onClick={() => startEdit(c)}>✏️</button>
                  <button onClick={() => remove(c.id)}>X</button>
                </div>
              </>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}