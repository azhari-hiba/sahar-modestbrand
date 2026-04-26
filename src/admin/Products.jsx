import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetch = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer produit ?")) {
      await deleteDoc(doc(db, "products", id));
      fetch();
    }
  };

  const getTotalStock = (colors) => {
    if (!colors) return 0;
    return colors.reduce((sum, c) => {
      return sum + Object.values(c.sizes).reduce((a, b) => a + b, 0);
    }, 0);
  };

  return (
    <div className="container">
      <h2>Produits</h2>

      {products.map((p) => {
        const stock = getTotalStock(p.colors);
        const firstImage = p.colors?.[0]?.image;

        return (
          <div
            key={p.id}
            style={{
              display: "flex",
              gap: 20,
              padding: 15,
              marginBottom: 15,
              borderRadius: 10,
              background: "#fff",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
            }}
          >
            <img
              src={firstImage}
              alt=""
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 10
              }}
            />

            <div style={{ flex: 1 }}>
              <h3>{p.name}</h3>

              <p>
                💰 {p.price} DH{" "}
                {p.oldPrice && (
                  <span style={{ textDecoration: "line-through" }}>
                    {p.oldPrice}
                  </span>
                )}
              </p>

              <p>📂 {p.collection}</p>

              <p>
                📦 Stock:{" "}
                <strong style={{ color: stock > 0 ? "green" : "red" }}>
                  {stock}
                </strong>
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                {p.colors?.map((c, i) => (
                  <img
                    key={i}
                    src={c.image}
                    alt=""
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => navigate(`/admin/edit/${p.id}`)}>
                Modifier
              </button>

              <button
                style={{ background: "red" }}
                onClick={() => handleDelete(p.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}