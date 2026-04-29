import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { db } from "../services/firebase";
import { collection, addDoc, doc, runTransaction } from "firebase/firestore";
import { User, Phone, MapPin, CreditCard } from "lucide-react";
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

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const decreaseStock = async (cartItems) => {
    for (let item of cartItems) {
      const ref = doc(db, "products", item.productId);
      
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) return;

        const data = snap.data();
        const updatedColors = data.colors.map((color) => {
          if (color.image === item.image) {
            const currentStock = color.sizes[item.size] || 0;
            
            if (currentStock < item.quantity) {
              throw new Error(`Stock insuffisant pour ${item.name} (${item.size})`);
            }

            return {
              ...color,
              sizes: { 
                ...color.sizes, 
                [item.size]: currentStock - item.quantity 
              }
            };
          }
          return color;
        });

        transaction.update(ref, { colors: updatedColors });
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.address) {
      Swal.fire("Erreur", "Veuillez remplir tous les champs obligatoires", "error");
      return;
    }
    if (cart.length === 0) {
      Swal.fire("Erreur", "Votre panier est vide", "error");
      return;
    }

    try {
      setLoading(true);

      await decreaseStock(cart);

      await addDoc(collection(db, "orders"), {
        client: form,
        items: cart,
        total,
        status: "nouvelle",
        createdAt: new Date()
      });

      try {
        await fetch("https://hook.eu1.make.com/f9xvzkjms1z3jega60e454c8e14cipet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, total, items: cart })
        });
      } catch (err) { console.error("Webhook error:", err); }

      Swal.fire({ 
        title: "Merci !", 
        text: "Votre commande a été reçue", 
        icon: "success", 
        confirmButtonColor: "#8b6f5a" 
      });

      clearCart();
      setForm({ name: "", phone: "", city: "", address: "", note: "" });

    } catch (err) {
      console.error(err);
      if (err.message.includes("Stock insuffisant")) {
        Swal.fire("Désolé", err.message, "warning");
      } else {
        Swal.fire("Erreur", "Un problème est survenu lors de la commande", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page-v2 container">
      <div className="checkout-grid">
        <div className="checkout-form-side">
          <div className="checkout-card">
            <h2 className="section-title"><User size={20} /> Informations de livraison</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Nom complet *</label>
                <input placeholder="Ex: Sara Ahmed" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Téléphone *</label>
                <input placeholder="06XXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Ville *</label>
                <input placeholder="Ex: Casablanca" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Adresse exacte *</label>
                <textarea placeholder="N° de rue, Quartier, Appartement..." value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Remarque (Optionnel)</label>
                <textarea placeholder="Précisions pour le livreur..." value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </div>
              <div className="payment-notice">
                <CreditCard size={18} />
                <span>Paiement en espèces à la livraison (COD)</span>
              </div>
              <button className="confirm-btn" disabled={loading} type="submit">
                {loading ? "Traitement en cours..." : "Confirmer ma commande"}
              </button>
            </form>
          </div>
        </div>

        <div className="checkout-summary-side">
          <div className="summary-sticky-card">
            <h3 className="summary-title">Votre commande</h3>
            <div className="checkout-items-scroll">
              {cart.map((item, i) => (
                <div key={i} className="mini-item-card">
                  <div className="mini-img">
                    <img src={item.image} alt={item.name} />
                    <span className="mini-qty-badge">{item.quantity}</span>
                  </div>
                  <div className="mini-details">
                    <p className="mini-name">{item.name}</p>
                    <p className="mini-meta">Taille: {item.size}</p>
                  </div>
                  <div className="mini-price-container">
                    <span className="mini-price">{item.price * item.quantity} DH</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-footer">
              <div className="summary-row"><span>Sous-total</span><span className="row-val">{total} DH</span></div>
              <div className="summary-row"><span>Livraison</span><span className="free-tag-green">Gratuite</span></div>
              <hr className="summary-divider" />
              <div className="summary-row total-big"><span>Total à payer</span><span className="total-val">{total} DH</span></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-page-v2 { padding: 40px 15px; background: #fdfbf9; min-height: 100vh; }
        .checkout-grid { display: grid; grid-template-columns: 1fr 400px; gap: 30px; max-width: 1100px; margin: 0 auto; }
        .checkout-card { background: white; padding: 30px; border-radius: 20px; border: 1px solid #eee; }
        .section-title { display: flex; align-items: center; gap: 10px; font-size: 20px; margin-bottom: 25px; color: #2d2d2d; font-weight: 700; }
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #555; }
        .input-group input, .input-group textarea { width: 100%; padding: 14px; border: 1px solid #ddd; border-radius: 12px; font-size: 15px; outline: none; transition: 0.3s; }
        .payment-notice { display: flex; align-items: center; gap: 10px; padding: 15px; background: #f0fdf4; color: #166534; border-radius: 12px; font-size: 14px; margin-bottom: 25px; border: 1px solid #bbf7d0; }
        .confirm-btn { width: 100%; background: #8b6f5a; color: white; padding: 18px; border-radius: 50px; border: none; font-size: 16px; font-weight: 700; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px rgba(139,111,90,0.2); }
        .summary-sticky-card { background: white; padding: 24px; border-radius: 20px; border: 1px solid #f0f0f0; position: sticky; top: 100px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .summary-title { font-size: 1.2rem; margin-bottom: 20px; color: #2d2d2d; font-weight: 700; }
        .mini-item-card { display: flex; align-items: center; gap: 15px; margin-bottom: 18px; padding-bottom: 15px; border-bottom: 1px solid #fafafa; }
        .mini-img { position: relative; width: 65px; height: 85px; flex-shrink: 0; }
        .mini-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }
        .mini-qty-badge { position: absolute; top: -10px; right: -10px; background: #8b6f5a; color: white; min-width: 22px; height: 22px; border-radius: 50%; font-size: 11px; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 2px solid white; }
        .mini-name { font-size: 14px; font-weight: 600; color: #333; margin: 0 0 4px 0; }
        .mini-meta { font-size: 12px; color: #888; margin: 0; }
        .mini-price { font-weight: 700; color: #2d2d2d; font-size: 14px; }
        .summary-footer { margin-top: 10px; }
        .summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .row-val { color: #2d2d2d; font-weight: 600; }
        .free-tag-green { color: #15803d; font-weight: 700; background: #f0fdf4; padding: 2px 8px; border-radius: 6px; font-size: 12px; }
        .summary-divider { border: 0; border-top: 1px solid #eee; margin: 15px 0; }
        .total-big { font-size: 18px; font-weight: 800; }
        .total-val { color: #8b6f5a; }
        @media (max-width: 992px) { .checkout-grid { grid-template-columns: 1fr; } .checkout-summary-side { order: -1; } .summary-sticky-card { position: static; } }
      `}</style>
    </div>
  );
}