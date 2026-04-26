import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return <p className="container">Panier vide</p>;
  }

  return (
    <div className="container">
      <h1>Panier</h1>

      {cart.map((item, i) => (
        <div key={i} className="cart-item">
          <img src={item.image} alt="" className="cart-img" />

          <div className="cart-info">
            <h3>{item.name}</h3>
            <p className="size">Taille: {item.size}</p>
            <p className="price">{item.price} DH</p>
          </div>

          <div className="cart-actions">
            <div className="qty-box">
              <button onClick={() => updateQuantity(i, Math.max(1, item.quantity - 1))}>
                -
              </button>

              <span>{item.quantity}</span>

              <button onClick={() => updateQuantity(i, item.quantity + 1)}>
                +
              </button>
            </div>

            <button
              className="delete-btn"
              onClick={() => removeFromCart(i)}
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}

      <div className="cart-bottom">
        <div className="cart-total">
          Total: {total} DH
        </div>

        <Link to="/checkout">
          <button className="checkout-btn">
            Passer commande
          </button>
        </Link>
      </div>
    </div>
  );
}