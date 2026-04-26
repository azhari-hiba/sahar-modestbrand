import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
const [search, setSearch] = useState("");

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
const filteredProducts = products.filter((p) =>
  p.name?.toLowerCase().includes(search.toLowerCase()) ||
  p.collection?.toLowerCase().includes(search.toLowerCase())
);
  return (
   
  <div className="container">
    <h2 style={{ marginBottom: 20 }}>Produits</h2>

    <div className="admin-products">
      <input
  type="text"
  placeholder="Rechercher par nom ou collection..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #ccc"
  }}
/>
      {filteredProducts.map((p) => {
        const stock = getTotalStock(p.colors);
        const firstImage = p.colors?.[0]?.image;

        return (
          <div className="admin-card" key={p.id}>

            {/* IMAGE */}
            <img
              src={firstImage}
              alt={p.name}
              className="admin-img"
            />

            {/* INFO */}
            <div className="admin-info">
              <h3>{p.name}</h3>

              <div className="price">
                <span className="new">{p.price} DH</span>
                {p.oldPrice && (
                  <span className="old">{p.oldPrice} DH</span>
                )}
              </div>

              <p className="collection">📂 {p.collection}</p>

              <p className="stock">
                📦 Stock:{" "}
                <span className={stock > 0 ? "in" : "out"}>
                  {stock}
                </span>
              </p>

              {/* COLORS */}
              <div className="colors">
                {p.colors?.map((c, i) => (
                  <img key={i} src={c.image} alt="" />
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="admin-actions">
              <button
                className="edit"
                onClick={() => navigate(`/admin/edit/${p.id}`)}
              >
                Modifier
              </button>

              <button
                className="delete"
                onClick={() => handleDelete(p.id)}
              >
                Supprimer
              </button>
            </div>

          </div>
        );
      })}
    </div>
  </div>
);
}