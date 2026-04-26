import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire("Succès", "Connexion réussie ✔", "success");
      navigate("/admin");
    } catch (err) {
      Swal.fire("Erreur", "Email ou mot de passe incorrect", "error");
    }
  };

  return (
    <div className="container">
      <div className="admin-form">
        <h1>Admin Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="submit-btn">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}