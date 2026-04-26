import { Link, useNavigate } from "react-router-dom";
import { Package, PlusCircle, ShoppingBag, Layers, LogOut, MessageCircle } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const res = await Swal.fire({
            title: "Déconnexion ?",
            text: "Tu veux vraiment quitter ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Annuler"
        });

        if (res.isConfirmed) {
            await signOut(auth);
            navigate("/admin-login");
        }
    };

    return (
        <div className="container">

            <div style={headerStyle}>
                <h1>Admin Dashboard</h1>

                <button onClick={handleLogout} style={logoutStyle}>
                    <LogOut size={18} /> Déconnexion
                </button>
            </div>
            <div
                className="dash-card"
                onClick={() => navigate("/admin/settings")}
            >

                <h3>Paramètres</h3>
                <p>Modifier WhatsApp</p>
            </div>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
                gap: "20px"
            }}>

                <Link to="/admin/products">
                    <div style={cardStyle}>
                        <Package size={30} />
                        <h3>Produits</h3>
                    </div>
                </Link>

                <Link to="/admin/add-product">
                    <div style={cardStyle}>
                        <PlusCircle size={30} />
                        <h3>Ajouter Produit</h3>
                    </div>
                </Link>
                <Link to="/admin/reclamations">
                    <div style={cardStyle}>
                        <MessageCircle size={30} />
                        <h3>Réclamations</h3>
                    </div>
                </Link>
                <Link to="/admin/orders">
                    <div style={cardStyle}>
                        <ShoppingBag size={30} />
                        <h3>Commandes</h3>
                    </div>
                </Link>

                <Link to="/admin/collections">
                    <div style={cardStyle}>
                        <Layers size={30} />
                        <h3>Collections</h3>
                    </div>
                </Link>

            </div>
        </div>
    );
}


const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
};

const logoutStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#8b6f5a",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "20px",
    cursor: "pointer"
};

const cardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    transition: "0.3s"
};