import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";

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

    setColors([
      ...colors,
      {
        image: "",
        sizes: defaultSizes
      }
    ]);
  };

  const deleteColor = (index) => {
    const updated = colors.filter((_, i) => i !== index);
    setColors(updated);
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
      Swal.fire("Erreur", "Remplis les champs obligatoires", "error");
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

      Swal.fire("Succès", "Produit ajouté ✔", "success");

      setForm({
        name: "",
        description: "",
        price: "",
        oldPrice: "",
        badge: "",
        collection: ""
      });

      setColors([]);

    } catch (error) {
      console.error(error);
      Swal.fire("Erreur", "Erreur ajout produit", "error");
    }
  };

  return (
    <div className="container">
      <div className="admin-form">

        <h1>Ajouter Produit</h1>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">
              <label>Nom du produit</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Prix (DH)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Ancien prix</label>
              <input
                type="number"
                value={form.oldPrice}
                onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Badge</label>
              <input
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Collection</label>
              <select
                value={form.collection}
                onChange={(e) => setForm({ ...form, collection: e.target.value })}
              >
                <option value="">Choisir collection</option>
                {collections.map(c => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="section-title">Couleurs & Stock</div>

          {colors.map((color, i) => (
            <div key={i} className="color-box">

              <button
                type="button"
                className="delete-color"
                onClick={() => deleteColor(i)}
              >
                Supprimer
              </button>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  value={color.image}
                  onChange={(e) => updateImage(i, e.target.value)}
                />
              </div>

              <div className="stock-row">
                {tailles.map(size => (
                  <div key={size} className="form-group">
                    <label>{size}</label>
                    <input
                      type="number"
                      value={color.sizes[size] || 0}
                      onChange={(e) => updateStock(i, size, e.target.value)}
                    />
                  </div>
                ))}
              </div>

            </div>
          ))}

          <button type="button" onClick={addColor} className="add-btn">
            + Ajouter couleur🎨
          </button>

          <div className="total-stock">
            Total stock: {totalStock}
          </div>
          <hr></hr>

          <button type="submit" className="submit-btn">
            Ajouter Produit
          </button>

        </form>
      </div>
    </div>
  );
}