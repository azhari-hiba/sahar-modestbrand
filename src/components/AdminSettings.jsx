import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";

export default function AdminSettings() {
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);

  const ref = doc(db, "settings", "contact");

useEffect(() => {
  const fetchData = async () => {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setWhatsapp(snap.data().whatsapp || "");
    }
  };
  fetchData();
}, [ref]);

  const handleSave = async () => {
    if (!whatsapp) {
      return Swal.fire("Erreur", "دخل رقم واتساب", "error");
    }

    try {
      setLoading(true);

      await updateDoc(ref, {
        whatsapp: whatsapp
      });

      Swal.fire("Succès", "تم التحديث ✔", "success");

    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "وقع مشكل", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      await updateDoc(ref, {
        whatsapp: ""
      });

      setWhatsapp("");

      Swal.fire("Supprimé", "تم حذف الرقم", "success");

    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "وقع مشكل", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "40px auto",
      background: "#fff",
      padding: "30px",
      borderRadius: "15px"
    }}>
      <h2>Paramètres WhatsApp</h2>

      <input
        type="text"
        placeholder="2126XXXXXXX"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
          borderRadius: "10px",
          border: "1px solid #ddd"
        }}
      />

      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "12px",
          background: "#8b6f5a",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        {loading ? "Enregistrement..." : "Enregistrer"}
      </button>

      <button
        onClick={handleDelete}
        disabled={loading}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "12px",
          background: "#ccc",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        Supprimer numéro
      </button>
    </div>
  );
}