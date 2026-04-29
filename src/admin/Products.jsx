import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { Edit3, Trash2, Tag, Search, Plus, Package } from "lucide-react";
import Swal from "sweetalert2";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Supprimer ce produit ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#8b6f5a",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler"
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
      Swal.fire("Supprimé !", "Le produit a été retiré.", "success");
    }
  };

  const getTotalStock = (colors) => {
    if (!colors) return 0;
    return colors.reduce((sum, c) => {
      return sum + Object.values(c.sizes || {}).reduce((a, b) => a + (Number(b) || 0), 0);
    }, 0);
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.collection?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products-page container">
      <div className="admin-header-actions">
        <div>
          <h1>Catalogue Produits</h1>
          <p>{filteredProducts.length} produits enregistrés</p>
        </div>
        <button className="add-product-btn" onClick={() => navigate("/admin/add-product")}>
          <Plus size={20} /> <span>Ajouter un produit</span>
        </button>
      </div>

      <div className="search-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Rechercher par nom, collection..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="products-list-rows">
        <div className="list-header-row">
          <span>Produit</span>
          <span>Collection</span>
          <span>Stock Total</span>
          <span>Prix</span>
          <span>Actions</span>
        </div>

        {filteredProducts.map((p) => {
          const stock = getTotalStock(p.colors);
          const firstImage = p.colors?.[0]?.image;

          return (
            <div className="product-admin-row" key={p.id}>
              <div className="col-info">
                <img src={firstImage} alt={p.name} className="row-img" />
                <div className="name-details">
                  <h3>{p.name}</h3>
                  <div className="row-color-preview">
                    {p.colors?.map((c, i) => (
                      <span key={i} className="mini-dot" style={{ backgroundImage: `url(${c.image})` }}></span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-collection">
                <span className="row-tag"><Tag size={12} /> {p.collection}</span>
              </div>

              <div className="col-stock">
                <div className={`row-stock-badge ${stock > 0 ? "in" : "out"}`}>
                  <Package size={14} /> {stock > 0 ? `${stock} en stock` : "Rupture"}
                </div>
              </div>

              <div className="col-price">
                <span className="price-main">{p.price} DH</span>
                {p.oldPrice && <span className="price-old">{p.oldPrice} DH</span>}
              </div>

              <div className="col-actions">
                <button className="row-edit" onClick={() => navigate(`/admin/edit/${p.id}`)} title="Modifier">
                  <Edit3 size={18} />
                </button>
                <button className="row-delete" onClick={() => handleDelete(p.id)} title="Supprimer">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .admin-products-page { padding: 40px 20px; background: #fdfbf9; min-height: 100vh; }
        
        .admin-header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .admin-header-actions h1 { font-size: 28px; font-weight: 800; color: #2d2d2d; margin: 0; }
        .admin-header-actions p { color: #888; font-size: 14px; margin: 5px 0 0; }

        .add-product-btn {
          background: #8b6f5a; color: white; border: none; padding: 12px 24px;
          border-radius: 12px; font-weight: 700; cursor: pointer; display: flex;
          align-items: center; gap: 8px; transition: 0.3s; white-space: nowrap;
        }
        .add-product-btn:hover { background: #765c49; transform: translateY(-2px); }

        .search-wrapper { position: relative; margin-bottom: 30px; }
        .search-wrapper input {
          width: 100%; padding: 14px 14px 14px 45px; border-radius: 12px;
          border: 1px solid #eee; background: white; outline: none; font-size: 15px;
        }
        .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #aaa; }

        .products-list-rows { display: flex; flex-direction: column; gap: 12px; }

        .list-header-row {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 100px;
          padding: 10px 20px; color: #888; font-size: 13px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 1px;
        }

        .product-admin-row {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 100px;
          align-items: center; background: white; padding: 15px 20px;
          border-radius: 16px; border: 1px solid #f0eee8; transition: 0.2s;
        }
        .product-admin-row:hover { border-color: #8b6f5a; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }

        .col-info { display: flex; align-items: center; gap: 15px; }
        .row-img { width: 55px; height: 55px; border-radius: 10px; object-fit: cover; }
        .name-details h3 { font-size: 16px; margin: 0 0 5px; color: #2d2d2d; }

        .row-color-preview { display: flex; gap: 4px; }
        .mini-dot { width: 14px; height: 14px; border-radius: 3px; background-size: cover; border: 1px solid #eee; }

        .row-tag { background: #f4eee9; color: #8b6f5a; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 5px; }

        .row-stock-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; }
        .row-stock-badge.in { color: #166534; }
        .row-stock-badge.out { color: #991b1b; }

        .price-main { font-size: 16px; font-weight: 800; color: #2d2d2d; display: block; }
        .price-old { font-size: 12px; text-decoration: line-through; color: #aaa; }

        .col-actions { display: flex; gap: 8px; justify-content: flex-end; }
        .row-edit, .row-delete {
          width: 38px; height: 38px; border-radius: 10px; border: none;
          display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
        }
        .row-edit { background: #fdfbf9; color: #2d2d2d; border: 1px solid #eee; }
        .row-edit:hover { background: #8b6f5a; color: white; border-color: #8b6f5a; }
        .row-delete { background: #fee2e2; color: #991b1b; }
        .row-delete:hover { background: #991b1b; color: white; }

        @media (max-width: 900px) {
          .list-header-row { display: none; }
          .product-admin-row { grid-template-columns: 1fr 1fr; gap: 15px; padding: 20px; }
          .col-actions { grid-column: span 2; justify-content: center; margin-top: 10px; border-top: 1px solid #f5f5f5; padding-top: 15px; }
          .row-edit, .row-delete { flex: 1; height: 45px; }
          
          .add-product-btn span { display: none; }
          .add-product-btn {
            padding: 0; width: 48px; height: 48px; border-radius: 50%;
            justify-content: center; position: fixed; bottom: 20px; right: 20px;
            z-index: 100; box-shadow: 0 4px 15px rgba(139, 111, 90, 0.4);
          }
        }
      `}</style>
    </div>
  );
}