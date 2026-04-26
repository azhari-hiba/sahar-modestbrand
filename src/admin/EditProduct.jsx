import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const defaultSizes = {
    Standard:0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
    XXXL: 0
  };

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() });
      }
    };

    fetch();
  }, [id]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "products", id), {
        name: product.name,
        price: Number(product.price),
        oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
        badge: product.badge,
        collection: product.collection,
        colors: product.colors
      });

      Swal.fire("Succès", "Produit modifié ✔", "success");
      navigate("/admin/products");

    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Erreur modification", "error");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container admin-form">
      <h1>Modifier Produit</h1>

      <div className="form-row">

        <div className="form-group">
          <label>Nom du produit</label>
          <input
            value={product.name}
            onChange={(e) =>
              setProduct({ ...product, name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Prix (DH)</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Ancien prix</label>
          <input
            type="number"
            value={product.oldPrice || ""}
            onChange={(e) =>
              setProduct({ ...product, oldPrice: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Badge</label>
          <input
            value={product.badge || ""}
            onChange={(e) =>
              setProduct({ ...product, badge: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Collection</label>
          <input
            value={product.collection}
            onChange={(e) =>
              setProduct({ ...product, collection: e.target.value })
            }
          />
        </div>

      </div>

      <h3 className="section-title">Couleurs & Stock</h3>

      {product.colors?.map((c, i) => (
        <div key={i} className="color-box">

          <button
            type="button"
            className="delete-color"
            onClick={() => {
              const updated = product.colors.filter((_, index) => index !== i);
              setProduct({ ...product, colors: updated });
            }}
          >
            Supprimer
          </button>

          <div className="form-group">
            <label>Image URL</label>
            <input
              value={c.image}
              onChange={(e) => {
                const updated = [...product.colors];
                updated[i].image = e.target.value;
                setProduct({ ...product, colors: updated });
              }}
            />
          </div>

          <div className="stock-row">
            {Object.keys(defaultSizes).map(size => (
              <div key={size} className="form-group">
                <label>{size}</label>
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

      <button
        type="button"
        className="add-btn"
        onClick={() => {
          setProduct({
            ...product,
            colors: [
              ...product.colors,
              {
                image: "",
                sizes: { ...defaultSizes }
              }
            ]
          });
        }}
      >
        + Ajouter couleur
      </button>

      <button className="submit-btn" onClick={handleSave}>
        Sauvegarder
      </button>
    </div>
  );
}