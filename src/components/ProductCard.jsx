import { useNavigate } from "react-router-dom";
import "./product.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const hasPromo = product.oldPrice && product.price < product.oldPrice;

  const image =
    product.colors?.[0]?.image || "https://via.placeholder.com/300";

  const totalStock = product.colors?.reduce((sum, color) => {
    const sizes = color.sizes || {};
    const totalSizes = Object.values(sizes).reduce((a, b) => a + b, 0);
    return sum + totalSizes;
  }, 0);

  const inStock = totalStock > 0;

  return (
    <div
      className="card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="image-container">
        <img src={image} alt={product.name} />

        {product.badge && <span className="badge">{product.badge}</span>}

        {hasPromo && <span className="promo">Promo</span>}

      </div>

      <div className="card-content">
  <h3>{product.name}</h3>

  <div className="price-box">
    {hasPromo && (
      <span className="old-price">
        {product.oldPrice} DH
      </span>
    )}

    <span className={hasPromo ? "new-price promo-price" : "new-price"}>
      {product.price} DH
    </span>
  </div>

  {!inStock && (
    <span className="out-stock">
      Rupture de stock
    </span>
  )}
</div>
    </div>
  );
}