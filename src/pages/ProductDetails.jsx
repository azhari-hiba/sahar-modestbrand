import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { CartContext } from "../context/CartContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import "../components/product.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const snap = await getDoc(doc(db, "products", id));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setProduct(data);

          if (data.colors?.[0]?.sizes) {
            const firstAvailableSize = Object.keys(data.colors[0].sizes).find(
              (size) => data.colors[0].sizes[size] > 0
            );
            if (firstAvailableSize) {
              setSelectedSize(firstAvailableSize);
            }
          }
        }
      } catch (error) {
        console.error("Erreur fetching product:", error);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (!product) return <div className="loader-simple">Chargement...</div>;

  const variant = product.colors?.[selectedVariant];
  const images = product.colors?.map((c) => c.image) || [];
  const currentStock = selectedSize ? variant.sizes[selectedSize] || 0 : 0;

  const handleAdd = () => {
    if (!selectedSize) return Swal.fire("Tailles", "Veuillez choisir une taille", "info");
    if (currentStock === 0) return Swal.fire("Stock", "Désolé, cette taille est épuisée", "error");

    addToCart({
      productId: product.id,
      name: product.name,
      image: variant.image,
      size: selectedSize,
      price: product.price,
      quantity,
      stockMax: currentStock,
    });
    Swal.fire({ title: "Ajouté!", icon: "success", timer: 1500, showConfirmButton: false });
  };

  const nextVariant = () => {
    const next = selectedVariant === images.length - 1 ? 0 : selectedVariant + 1;
    setSelectedVariant(next);
    setQuantity(1);
  };

  const prevVariant = () => {
    const prev = selectedVariant === 0 ? images.length - 1 : selectedVariant - 1;
    setSelectedVariant(prev);
    setQuantity(1);
  };

  return (
    <div className="p-details-page">
      <div className="p-gallery">
        <div className="p-main-img-container">
          <button className="nav-arrow left" onClick={prevVariant} aria-label="Précédent">
            <ChevronLeft size={20} />
          </button>

          <img 
            src={variant.image} 
            alt={product.name} 
            className="p-main-img" 
          />

          <button className="nav-arrow right" onClick={nextVariant} aria-label="Suivant">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="p-thumbs-scroll">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${product.name} variant ${i}`}
              className={i === selectedVariant ? "active-thumb" : ""}
              onClick={() => {
                setSelectedVariant(i);
                setQuantity(1);
              }}
            />
          ))}
        </div>
      </div>

      <div className="p-info-side">
        <div className="p-header">
          <span className="p-cat">{product.collection || "Collection Modest"}</span>
          <h1 className="p-title">{product.name}</h1>
          <div className="p-price-row">
            <span className="new-price-big">{product.price} DH</span>
            {product.oldPrice && <span className="old-price-big">{product.oldPrice} DH</span>}
          </div>

          <div className="stock-status-badge">
            {selectedSize && currentStock > 0 ? (
              <span className="stock-in">● En Stock</span>
            ) : selectedSize && currentStock === 0 ? (
              <span className="stock-out">● Rupture de stock</span>
            ) : null}
          </div>
        </div>

        <div className="p-section">
          <label>Choisir la Taille</label>
          <div className="p-size-grid">
            {Object.keys(variant.sizes).map((size) => (
              <button
                key={size}
                disabled={variant.sizes[size] === 0}
                className={selectedSize === size ? "size-item active" : "size-item"}
                onClick={() => {
                  setSelectedSize(size);
                  setQuantity(1);
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="p-section">
          <label>Quantité</label>
          <div className="p-qty-selector">
            <button 
              onClick={() => setQuantity((q) => Math.max(1, q - 1))} 
              disabled={currentStock === 0 || quantity <= 1}
            >
              -
            </button>
            <span>{quantity}</span>
            <button 
              onClick={() => setQuantity((q) => Math.min(q + 1, currentStock))} 
              disabled={currentStock === 0 || quantity >= currentStock}
            >
              +
            </button>
          </div>
        </div>

        <button 
          className="p-add-to-cart-btn" 
          onClick={handleAdd} 
          disabled={!selectedSize || currentStock === 0}
        >
          {currentStock === 0 ? "Rupture de Stock" : "Commander Maintenant"}
        </button>

        <div className="p-desc">
          <h4>Description</h4>
          <p>{product.description}</p>
        </div>
      </div>

      <style>{`
        .p-main-img-container {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          border-radius: 15px;
          overflow: hidden;
          background: #f9f9f9;
        }
        .p-main-img {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
        }
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.7);
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #8b6f5a;
          transition: 0.3s;
          z-index: 10;
        }
        .nav-arrow:hover { background: #8b6f5a; color: white; }
        .nav-arrow.left { left: 10px; }
        .nav-arrow.right { right: 10px; }

        .stock-status-badge { margin: 15px 0; font-size: 14px; font-weight: 600; }
        .stock-in { color: #15803d; background: #dcfce7; padding: 5px 15px; border-radius: 50px; }
        .stock-out { color: #b91c1c; background: #fee2e2; padding: 5px 15px; border-radius: 50px; }
        
        .size-item:disabled { opacity: 0.3; cursor: not-allowed; background: #f5f5f5; color: #aaa; }
        
        @media (max-width: 480px) {
          .nav-arrow { width: 32px; height: 32px; }
          .nav-arrow.left { left: 5px; }
          .nav-arrow.right { right: 5px; }
        }
      `}</style>
    </div>
  );
}