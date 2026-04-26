import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { db } from "../services/firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    note: ""
  });

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const decreaseStock = async (cartItems) => {
    for (let item of cartItems) {
      const ref = doc(db, "products", item.productId);

      const snap = await getDoc(ref);
      if (!snap.exists()) continue;

      const data = snap.data();

      const updatedColors = data.colors.map((color) => {
        if (color.image === item.image) {
          return {
            ...color,
            sizes: {
              ...color.sizes,
              [item.size]:
                (color.sizes[item.size] || 0) - item.quantity
            }
          };
        }
        return color;
      });

      await updateDoc(ref, {
        colors: updatedColors
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.city || !form.address) {
      Swal.fire("Erreur", "Remplis tous les champs !", "error");
      return;
    }

    if (cart.length === 0) {
      Swal.fire("Erreur", "Panier vide !", "error");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "orders"), {
        client: form,
        items: cart,
        total,
        status: "nouvelle",
        createdAt: new Date()
      });

      await decreaseStock(cart);

      Swal.fire("Succès", "Commande envoyée ✔", "success");

      clearCart();

      setForm({
        name: "",
        phone: "",
        city: "",
        address: "",
        note: ""
      });

    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Erreur commande", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
  <h1>Checkout</h1>

  <div className="checkout-grid">

    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Informations</h2>

      <input
        placeholder="Nom complet"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Téléphone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input
        placeholder="Ville"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
      />

      <textarea
        placeholder="Adresse"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <textarea
        placeholder="Remarque (optionnelle)"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
      />

      <button className="checkout-btn" disabled={loading} type="submit">
        {loading ? "Envoi..." : "Confirmer commande"}
      </button>
    </form>

    <div className="checkout-summary">
      <h3>Résumé</h3>

      {cart.map((item, i) => (
        <div key={i} className="checkout-item">
          <img src={item.image} alt="" />

          <div>
            <p><strong>{item.name}</strong></p>
            <p>Taille: {item.size}</p>
            <p>Qté: {item.quantity}</p>
            <p>{item.price} DH</p>
          </div>
        </div>
      ))}

      <div className="checkout-total">
        Total: {total} DH
      </div>
    </div>

  </div>
</div>);
}