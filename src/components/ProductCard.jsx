import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const image = product.colors?.[0]?.image || "https://via.placeholder.com/300";
  const hasPromo = product.oldPrice && product.price < product.oldPrice;

  const isOutOfStock = product.colors?.every(color => 
    Object.values(color.sizes || {}).every(qty => qty === 0)
  );

  return (
    <div className="product-card-v2" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="image-wrapper">
        <img src={image} alt={product.name} loading="lazy" />
        {isOutOfStock && <span className="simple-rupture-badge">Rupture</span>}
        {hasPromo && !isOutOfStock && (
          <div className="badge-promo">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </div>
        )}
      </div>

      <div className="product-details-mini">
        <span className="brand-name">SAHAR MODEST</span>
        <h3 className="p-name">{product.name}</h3>
        <div className="p-price-box">
          <span className="p-new-price">{product.price} DH</span>
          {hasPromo && <span className="p-old-price">{product.oldPrice} DH</span>}
        </div>
      </div>

      <style>{`
        .product-card-v2 { 
          cursor: pointer; 
          background: #fff; 
          border-radius: 4px; 
          display: flex;
          flex-direction: column;
          height: 100%; 
        }

        .image-wrapper { 
          position: relative; 
          width: 100%; 
          aspect-ratio: 3 / 4; 
          background-color: #f5f5f5;
          overflow: hidden;
        }

        .image-wrapper img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
        }

        .product-details-mini { 
          padding: 12px 6px; 
          text-align: center;
          display: flex;
          flex-direction: column;
          flex-grow: 1; 
        }

        .brand-name { font-size: 10px; color: #999; text-transform: uppercase; }

        .p-name { 
          font-size: 14px; 
          margin: 6px 0; 
          color: #2d2d2d; 
          font-weight: 500;
          
          min-height: 40px; 
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .p-price-box { 
          margin-top: auto;
          display: flex; 
          justify-content: center; 
          align-items: center; 
          gap: 6px; 
        }

        .p-new-price { font-weight: 700; color: #8b6f5a; font-size: 15px; }
        .p-old-price { text-decoration: line-through; color: #bbb; font-size: 12px; }

        .simple-rupture-badge {
          position: absolute; top: 8px; right: 8px;
          background: #ff0000; color: white; padding: 2px 6px;
          border-radius: 2px; font-size: 9px; font-weight: 800;
        }

        .badge-promo {
          position: absolute; top: 8px; left: 8px;
          background: #8b6f5a; color: white; padding: 2px 6px;
          border-radius: 2px; font-size: 9px; font-weight: 800;
        }
      `}</style>
    </div>
  );
}