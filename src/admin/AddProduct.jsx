import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { PlusCircle, Trash2, Image as ImageIcon, Box, Tag, DollarSign, Layers } from "lucide-react";

export default function AddProduct() {
  const [collections, setCollections] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    badge: "",
    collection: ""
  });

  const tailles = ["STANDARD", "S", "M", "L", "XL", "XXL", "XXXL"];
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const snap = await getDocs(collection(db, "collections"));
      setCollections(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchCollections();
  }, []);

  const addColor = () => {
    const defaultSizes = {};
    tailles.forEach(t => (defaultSizes[t] = 0));
    setColors([...colors, { image: "", sizes: defaultSizes }]);
  };

  const deleteColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateImage = (index, value) => {
    const updated = [...colors];
    updated[index].image = value;
    setColors(updated);
  };

  const updateStock = (index, size, value) => {
    const updated = [...colors];
    updated[index].sizes[size] = Number(value);
    setColors(updated);
  };

  const totalStock = colors.reduce((sum, c) => {
    return sum + Object.values(c.sizes).reduce((a, b) => a + b, 0);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.collection) {
      Swal.fire("Attention", "Veuillez remplir les champs obligatoires (*)", "warning");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        colors,
        stock: totalStock,
        status: totalStock > 0 ? "en_stock" : "rupture",
        createdAt: new Date()
      });

      Swal.fire("Parfait !", "Le produit a été ajouté avec succès", "success");
      setForm({ name: "", description: "", price: "", oldPrice: "", badge: "", collection: "" });
      setColors([]);
    } catch (error) {
      Swal.fire("Erreur", "Impossible d'ajouter le produit", "error");
    }
  };

  return (
    <div className="admin-page container">
      <div className="admin-card">
        <h1 className="form-title"><Box size={24} /> Nouveau Produit</h1>
        
        <form onSubmit={handleSubmit} className="premium-form">
          <div className="main-grid">
            <div className="info-section">
              <div className="form-group">
                <label><Tag size={14} /> Nom du produit *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="" />
              </div>

              <div className="form-group">
                <label><Layers size={14} /> Collection *</label>
                <select value={form.collection} onChange={(e) => setForm({ ...form, collection: e.target.value })}>
                  <option value="">Sélectionner...</option>
                  {collections.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="price-row">
                <div className="form-group">
                  <label><DollarSign size={14} /> Prix (DH)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Ancien Prix</label>
                  <input type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows="6" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Détails du produit..." />
              </div>
            </div>

            <div className="variant-section">
              <div className="section-header">
                <h3>Couleurs & Stock</h3>
                <button type="button" onClick={addColor} className="add-variant-btn">
                  <PlusCircle size={18} /> Ajouter une couleur
                </button>
              </div>

              <div className="colors-container">
                {colors.length === 0 && (
                  <div className="empty-colors">Aucune variante ajoutée. Cliquez sur le bouton en haut.</div>
                )}
                {colors.map((color, i) => (
                  <div key={i} className="color-item-card">
                    <div className="color-header">
                      <span>VARIANTE #{i + 1}</span>
                      <button type="button" onClick={() => deleteColor(i)} className="delete-var-btn"><Trash2 size={16} /></button>
                    </div>
                    
                    <div className="form-group">
                      <label><ImageIcon size={14} /> URL Image</label>
                      <input value={color.image} onChange={(e) => updateImage(i, e.target.value)} placeholder="Lien de l'image..." />
                    </div>

                    <div className="size-stock-grid">
                      {tailles.map(size => (
                        <div key={size} className="size-input">
                          <label>{size}</label>
                          <input type="number" min="0" value={color.sizes[size] || 0} onChange={(e) => updateStock(i, size, e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-footer">
                <div className="total-badge">Total Stock: <strong>{totalStock}</strong></div>
                <button type="submit" className="save-product-btn">Enregistrer le produit</button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .admin-page { padding: 40px 20px; background: #fdfbf9; min-height: 100vh; }
        .admin-card { background: white; border-radius: 24px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); max-width: 1200px; margin: 0 auto; }
        .form-title { display: flex; align-items: center; gap: 12px; margin-bottom: 35px; font-size: 26px; font-weight: 800; color: #1a1a1a; }
        
        /* Layout Grid */
        .main-grid { display: grid; grid-template-columns: 380px 1fr; gap: 40px; align-items: start; }
        
        .form-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 12px; font-weight: 700; color: #8b6f5a; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-group input, .form-group select, .form-group textarea {
          padding: 14px; border-radius: 12px; border: 1px solid #eee; background: #fafafa; outline: none; transition: 0.3s; font-size: 15px; width: 100%; box-sizing: border-box;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #8b6f5a; background: #fff; box-shadow: 0 0 0 4px rgba(139, 111, 90, 0.1); }

        .price-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 10px; border-bottom: 1px solid #f5f5f5; }
        .section-header h3 { font-size: 18px; font-weight: 700; color: #2d2d2d; margin: 0; }
        
        .add-variant-btn { background: #8b6f5a; color: white; border: none; padding: 10px 20px; border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px; transition: 0.3s; }
        .add-variant-btn:hover { background: #765c49; transform: scale(1.05); }

        .color-item-card { background: #fff; border: 1px solid #eee; border-radius: 18px; padding: 20px; margin-bottom: 20px; position: relative; }
        .color-header { display: flex; justify-content: space-between; margin-bottom: 18px; }
        .color-header span { font-size: 12px; font-weight: 800; color: #8b6f5a; }
        .delete-var-btn { background: #fee2e2; color: #ef4444; border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        .size-stock-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 10px; }
        .size-input { display: flex; flex-direction: column; gap: 5px; text-align: center; }
        .size-input label { font-size: 11px; font-weight: 700; color: #666; }
        .size-input input { padding: 8px; text-align: center; border-radius: 8px; border: 1px solid #eee; background: #fff; font-size: 13px; }

        .empty-colors { text-align: center; padding: 40px; color: #aaa; background: #fafafa; border-radius: 15px; border: 2px dashed #eee; }

        .summary-footer { margin-top: 30px; display: flex; justify-content: space-between; align-items: center; padding-top: 25px; border-top: 1px solid #eee; }
        .total-badge { background: #f3f4f6; padding: 12px 24px; border-radius: 12px; font-weight: 600; color: #4b5563; font-size: 15px; }
        .save-product-btn { background: #1a1a1a; color: white; border: none; padding: 16px 40px; border-radius: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; font-size: 16px; }
        .save-product-btn:hover { background: #333; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

        @media (max-width: 992px) {
          .main-grid { grid-template-columns: 1fr; }
          .admin-page { padding: 20px 10px; }
          .admin-card { padding: 20px; }
          .summary-footer { flex-direction: column; gap: 20px; }
          .save-product-btn { width: 100%; }
          .total-badge { width: 100%; text-align: center; box-sizing: border-box; }
        }
      `}</style>
    </div>
  );
}