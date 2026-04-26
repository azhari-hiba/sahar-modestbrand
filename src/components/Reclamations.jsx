import { useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
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
      return Swal.fire("Erreur", "Remplis les champs obligatoires", "error");
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "reclamations"), {
        ...form,
        status: "pending",
        createdAt: new Date()
      });

      Swal.fire("Succès", "Réclamation envoyée ✔", "success");

      setForm({
        name: "",
        phone: "",
        city: "",
        address: "",
        productName: "",
        size: "",
        problem: ""
      });

    } catch (err) {
      Swal.fire("Erreur", "Erreur envoi", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">

      <h1>Réclamation / Échange</h1>

      <div className="conditions-box">
        <h3>Conditions d'échange et réclamation</h3>

        <ul>
          <li>La réclamation doit être faite dans un délai maximum de 48 heures après réception.</li>
          <li>Le produit doit présenter un défaut (déchirure، erreur، défaut de fabrication).</li>
          <li>Aucun échange ou retour n’est accepté sans raison valable.</li>
          <li>Les demandes pour taille ou modèle sans défaut ne sont pas acceptées.</li>
          <li>Une description détaillée du problème est obligatoire.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="form">

        <input
          placeholder="Nom complet"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Téléphone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="Ville"
          value={form.city}
          onChange={e => setForm({ ...form, city: e.target.value })}
        />

        <textarea
          placeholder="Adresse complète"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
        />

        <input
          placeholder="Nom du produit"
          value={form.productName}
          onChange={e => setForm({ ...form, productName: e.target.value })}
        />

        <input
          placeholder="Taille"
          value={form.size}
          onChange={e => setForm({ ...form, size: e.target.value })}
        />

        <textarea
          placeholder="Décris le problème بالتفصيل (مثلا: تمزق، خطأ فالمقاس، defect...)"
          value={form.problem}
          onChange={e => setForm({ ...form, problem: e.target.value })}
          rows={5}
        />

        <button disabled={loading}>
          {loading ? "Envoi..." : "Envoyer réclamation"}
        </button>

      </form>
    </div>
  );
}