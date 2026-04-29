import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Save, Plus, Trash2, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  const defaultSizes = { Standard: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 };


useEffect(() => {
  const fetchProduct = async () => {
    const snap = await getDoc(doc(db, "products", id));
    if (snap.exists()) {
      setProduct({ id: snap.id, ...snap.data() });
    } else {
      Swal.fire("Erreur", "Produit introuvable", "error");
      navigate("/admin/products");
    }
  };

  fetchProduct();
}, [id]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "products", id), {
        ...product,
        price: Number(product.price),
        oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
      });
      Swal.fire("Succès", "Produit mis à jour ✔", "success");
      navigate("/admin/products");
    } catch (err) {
      Swal.fire("Erreur", "Impossible de modifier le produit", "error");
    }
  };

  if (!product) return <div className="loading-screen">Chargement...</div>;

  return (
    <div className="admin-edit-container container">
      <div className="edit-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Retour
        </button>
        <h1>Modifier : {product.name}</h1>
      </div>

      <div className="edit-grid">
        <div className="edit-card main-info">
          <h3 className="card-title">Informations Générales</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Nom du produit</label>
              <input
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Collection</label>
              <input
                value={product.collection}
                onChange={(e) => setProduct({ ...product, collection: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Prix (DH)</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Ancien prix (DH)</label>
              <input
                type="number"
                value={product.oldPrice || ""}
                onChange={(e) => setProduct({ ...product, oldPrice: e.target.value })}
              />
            </div>
            <div className="form-group full-width">
              <label>Badge (ex: Nouveau, Promo...)</label>
              <input
                value={product.badge || ""}
                onChange={(e) => setProduct({ ...product, badge: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="edit-card colors-info">
          <div className="card-header-flex">
            <h3 className="card-title">Couleurs & Stock</h3>
            <button
              className="add-color-btn"
              onClick={() => setProduct({
                ...product,
                colors: [...product.colors, { image: "", sizes: { ...defaultSizes } }]
              })}
            >
              <Plus size={16} /> Ajouter une couleur
            </button>
          </div>

          {product.colors?.map((c, i) => (
            <div key={i} className="color-variant-card">
              <div className="variant-header">
                <div className="img-preview-mini">
                  {c.image ? <img src={c.image} alt="preview" /> : <ImageIcon size={20} />}
                </div>
                <input
                  placeholder="URL de l'image"
                  value={c.image}
                  onChange={(e) => {
                    const updated = [...product.colors];
                    updated[i].image = e.target.value;
                    setProduct({ ...product, colors: updated });
                  }}
                />
                <button
                  className="delete-variant"
                  onClick={() => {
                    const updated = product.colors.filter((_, idx) => idx !== i);
                    setProduct({ ...product, colors: updated });
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="sizes-stock-grid">
                {Object.keys(defaultSizes).map(size => (
                  <div key={size} className="size-input-group">
                    <span>{size}</span>
                    <input
                      type="number"
                      value={c.sizes?.[size] || 0}
                      onChange={(e) => {
                        const updated = [...product.colors];
                        updated[i].sizes[size] = Number(e.target.value);
                        setProduct({ ...product, colors: updated });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky-actions">
        <button className="cancel-btn" onClick={() => navigate("/admin/products")}>Annuler</button>
        <button className="save-btn" onClick={handleSave}>
          <Save size={18} /> Enregistrer les modifications
        </button>
      </div>

      <style>{`
        .admin-edit-container { padding: 40px 20px 100px; background: #fdfbf9; min-height: 100vh; }
        .edit-header { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
        .back-link { background: none; border: none; display: flex; align-items: center; gap: 5px; color: #8b6f5a; cursor: pointer; font-weight: 600; }
        
        .edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; align-items: start; }
        .edit-card { background: white; padding: 25px; border-radius: 20px; border: 1px solid #f0eee8; }
        .card-title { margin-bottom: 20px; font-size: 18px; color: #2d2d2d; font-weight: 700; border-left: 4px solid #8b6f5a; padding-left: 15px; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .full-width { grid-column: span 2; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #666; margin-bottom: 8px; }
        .form-group input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #eee; outline: none; }

        .card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .add-color-btn { background: #f4eee9; color: #8b6f5a; border: none; padding: 8px 15px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 5px; }

        .color-variant-card { background: #fdfbf9; padding: 15px; border-radius: 15px; border: 1px solid #eee; margin-bottom: 15px; }
        .variant-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
        .img-preview-mini { width: 45px; height: 45px; border-radius: 8px; background: #eee; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .img-preview-mini img { width: 100%; height: 100%; object-fit: cover; }
        .variant-header input { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #ddd; }
        .delete-variant { color: #991b1b; background: none; border: none; cursor: pointer; }

        .sizes-stock-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .size-input-group span { font-size: 11px; font-weight: 800; color: #aaa; display: block; text-align: center; margin-bottom: 4px; }
        .size-input-group input { width: 100%; padding: 8px; text-align: center; border-radius: 6px; border: 1px solid #ddd; font-size: 13px; }


        .sticky-actions { 
          position: fixed; 
          bottom: 0; 
          left: 0; 
          right: 0; 
          background: white; 
          padding: 15px 20px; 
          display: flex; 
          justify-content: center; 
          gap: 15px; 
          box-shadow: 0 -10px 30px rgba(0,0,0,0.08); 
          z-index: 100; 
        }

        .save-btn { 
          background: #8b6f5a; 
          color: white; 
          border: none; 
          padding: 12px 30px; 
          border-radius: 50px; 
          font-weight: 700; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          gap: 10px; 
          flex: 1; 
          max-width: 400px;
          font-size: 15px;
        }

        .cancel-btn { 
          background: #f3f4f6; 
          color: #666; 
          border: none; 
          padding: 12px 25px; 
          border-radius: 50px; 
          font-weight: 700; 
          cursor: pointer;
          font-size: 15px;
        }

        /* Responsive Mobile */
        @media (max-width: 600px) {
          .sticky-actions {
            padding: 10px;
            gap: 10px;
          }
          
          .save-btn {
            padding: 12px 10px;
            font-size: 14px;
            flex: 2; 
          }

          .cancel-btn {
            padding: 12px 15px;
            font-size: 14px;
            flex: 1;
          }

          .admin-edit-container {
            padding-bottom: 80px; 
          }
        }

        @media (max-width: 1000px) { .edit-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}