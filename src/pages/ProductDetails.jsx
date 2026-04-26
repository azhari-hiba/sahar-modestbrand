import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { CartContext } from "../context/CartContext";
import Swal from "sweetalert2";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, "products", id));
      setProduct({ id: snap.id, ...snap.data() });
    };
    fetch();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const variant = product.colors?.[selectedVariant];
  if (!variant) return <p>Produit invalide</p>;

  const images = product.colors?.map(c => c.image) || [];

  const hasPromo = product.oldPrice && product.price < product.oldPrice;
  const maxStock = selectedSize ? variant.sizes[selectedSize] : 0;

  const nextImage = () => {
    setSelectedVariant(prev =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedVariant(prev =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) nextImage();
    if (touchEnd - touchStart > 50) prevImage();
  };

  const handleAdd = () => {
    if (!selectedSize) {
      return Swal.fire("Erreur", "Choisir taille !", "warning");
    }

    if (quantity > maxStock) {
      return Swal.fire("Erreur", "Quantité indisponible", "error");
    }

    addToCart({
      productId: product.id,
      name: product.name,
      image: variant.image,
      size: selectedSize,
      price: product.price,
      quantity,
      stockMax: maxStock
    });

    Swal.fire("Succès", `Ajouté (${quantity}) au panier`, "success");
  };

  return (
    <div className="product-page">

      <div className="image-section">

        <div
          className="main-image"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img src={variant.image} alt="" />

          <button onClick={prevImage} className="arrow left">❮</button>
          <button onClick={nextImage} className="arrow right">❯</button>
        </div>

        <div className="thumbs">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setSelectedVariant(i)}
              className={i === selectedVariant ? "active" : ""}
              alt=""
            />
          ))}
        </div>

      </div>

      <div className="info-section">

        <h1>{product.name}</h1>

        <div className="price">
  {hasPromo && (
    <span className="old-price">{product.oldPrice} DH</span>
  )}
  <span className="new-price">{product.price} DH</span>
</div>

        <p>{product.description}</p>

        <h4>Choisir taille:</h4>
        <div className="sizes">
          {Object.keys(variant.sizes)
            .filter(size => variant.sizes[size] > 0)
            .map(size => (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setQuantity(1);
                }}
                className={`size-btn ${selectedSize === size ? "active" : ""}`}
              >
                {size}
              </button>
          ))}
        </div>

        <h4>Quantité:</h4>
        <div className="quantity">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>

          <span>{quantity}</span>

          <button
            onClick={() => {
              if (!selectedSize) {
                return Swal.fire("Choisir taille !");
              }
              setQuantity(q => Math.min(q + 1, maxStock));
            }}
          >
            +
          </button>
        </div>

        <button
          className="add-btn"
          onClick={handleAdd}
          disabled={!selectedSize || maxStock === 0}
        >
          {maxStock === 0 ? "Rupture de stock" : "Ajouter au panier"}
        </button>

      </div>
    </div>
  );
}