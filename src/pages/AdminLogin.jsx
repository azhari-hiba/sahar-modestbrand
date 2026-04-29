import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({
        icon: 'success',
        title: 'Connexion réussie',
        text: 'Bienvenue dans votre espace admin',
        confirmButtonColor: '#8b6f5a'
      });
      navigate("/admin");
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Email ou mot de passe incorrect',
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-v2">
      <div className="login-card">
        <div className="login-header">
          <div className="admin-icon-circle">
            <ShieldCheck size={32} color="#8b6f5a" />
          </div>
          <h1>Espace Admin</h1>
          <p>Veuillez vous connecter pour gérer SAHAR</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-with-icon">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Adresse email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-with-icon">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Mot de passe"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="login-footer">
          <p>© {new Date().getFullYear()} Sahar Modest Brand</p>
        </div>
      </div>

      <style>{`
        .login-page-v2 {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fdfbf9;
          padding: 20px;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: white;
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(139, 111, 90, 0.1);
          border: 1px solid #f0eee8;
        }

        .login-header {
          text-align: center;
          margin-bottom: 35px;
        }

        .admin-icon-circle {
          width: 70px;
          height: 70px;
          background: #fdfbf9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 1px solid #f4eee9;
        }

        .login-header h1 {
          font-size: 24px;
          color: #2d2d2d;
          margin-bottom: 8px;
          font-weight: 800;
        }

        .login-header p {
          font-size: 14px;
          color: #888;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-icon svg {
          position: absolute;
          left: 15px;
          color: #aaa;
        }

        .input-with-icon input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          background: #f9f9f9;
          border: 1px solid #eee;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          transition: 0.3s;
        }

        .input-with-icon input:focus {
          border-color: #8b6f5a;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(139, 111, 90, 0.05);
        }

        .login-btn {
          width: 100%;
          padding: 16px;
          background: #2d2d2d;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 10px;
        }

        .login-btn:hover {
          background: #000;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .login-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }

        .login-footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #bbb;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}