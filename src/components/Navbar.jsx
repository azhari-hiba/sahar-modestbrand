import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Home, Info, ShoppingBag } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import logo from "../assets/logo.jpeg";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const location = useLocation();

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="main-navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="SAHAR Logo" className="logo-img" />
          <span className="brand-name">SAHAR</span>
        </Link>

        <div className="nav-menu">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            <Home size={20} />
            <span className="link-text">Accueil</span>
          </Link>

          <Link to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>
            <Info size={20} />
            <span className="link-text">À propos</span>
          </Link>

          <Link to="/cart" className={`nav-cart ${isActive("/cart") ? "active" : ""}`}>
            <div className="cart-icon-wrapper">
              <ShoppingBag size={22} />
              {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
            </div>
          </Link>
        </div>
      </div>

      <style>{`
        .main-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 10px 0;
          box-shadow: 0 2px 15px rgba(0,0,0,0.04);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .logo-img {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #8b6f5a;
        }

        .brand-name {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #2d2d2d;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          transition: 0.3s;
        }

        .nav-link:hover, .nav-link.active {
          color: #8b6f5a;
        }

        .cart-icon-wrapper {
          position: relative;
          color: #2d2d2d;
          transition: 0.3s;
        }

        .nav-cart:hover .cart-icon-wrapper {
          color: #8b6f5a;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -10px;
          background: #8b6f5a;
          color: white;
          font-size: 10px;
          font-weight: 700;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 2px solid #fff;
        }

        @media (max-width: 600px) {
          .link-text { display: none; }
          .nav-menu { gap: 20px; }
          .brand-name { font-size: 16px; }
        }
      `}</style>
    </nav>
  );
}