import { Link } from "react-router-dom";
import { ShoppingCart, Home } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import logo from "../assets/logo.jpeg";

export default function Navbar() {
  const { cart } = useContext(CartContext);

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%", 
            objectFit: "cover",
            border: "2px solid #eee",
          }}
        />

        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            color: "#2b2b2b",
            fontWeight: "600",
          }}
        >
          SAHAR
        </h2>
      </Link>

      {/* MENU */}
      <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
        
        <Link to="/">
          <Home size={20} />
        </Link>

        {/* ABOUT */}
        <Link to="/about">À propos</Link>

        {/* CART */}
        <Link to="/cart" style={{ position: "relative" }}>
          <ShoppingCart size={22} />

          {totalQty > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-10px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "3px 7px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {totalQty}
            </span>
          )}
        </Link>

      </div>
    </nav>
  );
}