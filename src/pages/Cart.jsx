import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="empty-cart-v2 container">
        <div className="empty-icon-wrapper">
          <ShoppingBag size={50} strokeWidth={1.5} color="#8b6f5a" />
        </div>
        <h2>Votre panier est vide</h2>
        <p>Il semble que vous n'ayez pas encore ajouté d'articles. Découvrez nos dernières collections.</p>
        <Link to="/" className="btn-explore">Explorer la boutique</Link>
      </div>
    );
  }

  return (
    <div className="cart-page-modern container">
      <div className="cart-header-section">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} /> Continuer mes achats
        </Link>
        <h1 className="main-title">Mon Panier <span>({cart.length} articles)</span></h1>
      </div>

      <div className="cart-content-grid">
        <div className="items-container">
          {cart.map((item, i) => (
            <div key={i} className="modern-cart-item">
              <div className="item-img">
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="item-info">
                <div className="item-main-details">
                  <h3>{item.name}</h3>
                  <p className="item-variant">Taille: <strong>{item.size}</strong></p>
                </div>
                
                <div className="item-actions">
                  <div className="modern-qty">
                    <button onClick={() => updateQuantity(i, Math.max(1, item.quantity - 1))}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(i, item.quantity + 1)}><Plus size={14} /></button>
                  </div>
                  <p className="item-price">{item.price} DH</p>
                </div>
              </div>

              <button className="delete-btn" onClick={() => removeFromCart(i)}>
                <Trash2 size={18} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        <div className="summary-sidebar">
          <div className="summary-inner">
            <h3>Détails de la commande</h3>
            
            <div className="summary-details">
              <div className="sum-row">
                <span>Sous-total</span>
                <span>{total} DH</span>
              </div>
              <div className="sum-row">
                <span>Livraison</span>
                <span className="free-tag">Gratuite</span>
              </div>
            </div>

            <div className="total-row">
              <span>Total à payer</span>
              <span>{total} DH</span>
            </div>

            <Link to="/checkout" className="btn-checkout-modern">
              Passer la commande
            </Link>

            <div className="trust-badge">
              <ShieldCheck size={16} />
              Paiement sécurisé à la livraison
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page-modern { padding: 50px 20px; }
        
        .cart-header-section { margin-bottom: 40px; }
        .back-link { 
          display: flex; align-items: center; gap: 8px; 
          color: #888; text-decoration: none; font-size: 14px; margin-bottom: 15px;
          transition: 0.3s;
        }
        .back-link:hover { color: #8b6f5a; }
        .main-title { font-size: 32px; font-weight: 800; color: #2d2d2d; }
        .main-title span { font-size: 16px; color: #8b6f5a; font-weight: 500; }

        .cart-content-grid { display: grid; grid-template-columns: 1fr 380px; gap: 40px; align-items: start; }

        /* Items Style */
        .items-container { display: flex; flex-direction: column; gap: 20px; }
        .modern-cart-item { 
          display: flex; background: #fff; padding: 20px; border-radius: 12px;
          border: 1px solid #f2f2f2; position: relative; gap: 20px;
        }
        .item-img { width: 110px; height: 145px; border-radius: 8px; overflow: hidden; flex-shrink: 0; }
        .item-img img { width: 100%; height: 100%; object-fit: cover; }
        
        .item-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .item-main-details h3 { font-size: 18px; font-weight: 600; margin-bottom: 5px; color: #333; }
        .item-variant { font-size: 14px; color: #777; }
        .item-variant strong { color: #333; }

        .item-actions { display: flex; justify-content: space-between; align-items: center; }
        .modern-qty { 
          display: flex; align-items: center; gap: 15px; 
          border: 1px solid #eee; padding: 5px 15px; border-radius: 8px;
        }
        .modern-qty button { background: none; border: none; cursor: pointer; color: #888; }
        .modern-qty span { font-weight: 700; min-width: 20px; text-align: center; }
        .item-price { font-size: 18px; font-weight: 800; color: #8b6f5a; }

        .delete-btn { 
          position: absolute; top: 20px; right: 20px; 
          background: none; border: none; color: #ccc; cursor: pointer; transition: 0.3s;
        }
        .delete-btn:hover { color: #ff4d4d; }

        /* Summary Style */
        .summary-sidebar { position: sticky; top: 120px; }
        .summary-inner { background: #faf9f8; padding: 30px; border-radius: 16px; border: 1px solid #eee; }
        .summary-inner h3 { font-size: 20px; margin-bottom: 25px; color: #2d2d2d; }
        
        .summary-details { display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px; }
        .sum-row { display: flex; justify-content: space-between; color: #666; font-size: 15px; }
        .free-tag { color: #27ae60; font-weight: 700; }
        
        .total-row { 
          display: flex; justify-content: space-between; 
          padding-top: 20px; border-top: 2px dashed #ddd;
          font-size: 20px; font-weight: 850; color: #2d2d2d; margin-bottom: 30px;
        }

        .btn-checkout-modern { 
          display: block; width: 100%; background: #8b6f5a; color: white; 
          text-align: center; padding: 18px; border-radius: 12px;
          text-decoration: none; font-weight: 700; letter-spacing: 0.5px;
          box-shadow: 0 10px 25px rgba(139,111,90,0.25); transition: 0.4s;
        }
        .btn-checkout-modern:hover { background: #765c49; transform: translateY(-3px); }

        .trust-badge { 
          display: flex; align-items: center; justify-content: center; gap: 8px; 
          margin-top: 20px; font-size: 13px; color: #999; 
        }

        /* Empty Cart */
        .empty-cart-v2 { 
          text-align: center; padding: 120px 20px; display: flex; 
          flex-direction: column; align-items: center;
        }
        .empty-icon-wrapper { 
          background: #faf9f8; width: 100px; height: 100px; 
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; margin-bottom: 25px;
        }
        .empty-cart-v2 h2 { font-size: 26px; margin-bottom: 10px; }
        .empty-cart-v2 p { color: #888; max-width: 400px; margin-bottom: 30px; line-height: 1.6; }
        .btn-explore { 
          background: #8b6f5a; color: white; padding: 14px 35px; 
          border-radius: 50px; text-decoration: none; font-weight: 600;
        }

        @media (max-width: 992px) {
          .cart-content-grid { grid-template-columns: 1fr; }
          .summary-sidebar { position: static; }
        }
      `}</style>
    </div>
  );
}