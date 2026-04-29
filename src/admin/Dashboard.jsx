import { Link, useNavigate } from "react-router-dom";
import { Package, PlusCircle, ShoppingBag, Layers, LogOut, MessageCircle, Settings, LayoutDashboard } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const res = await Swal.fire({
            title: "Déconnexion ?",
            text: "Tu veux vraiment quitter l'espace gestion ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, quitter",
            cancelButtonText: "Annuler",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#8b6f5a",
        });

        if (res.isConfirmed) {
            await signOut(auth);
            navigate("/admin-login");
        }
    };

    const adminLinks = [
        { to: "/admin/products", title: "Produits", icon: <Package size={32} />, color: "#8b6f5a" },
        { to: "/admin/add-product", title: "Ajouter Produit", icon: <PlusCircle size={32} />, color: "#8b6f5a" },
        { to: "/admin/reclamations", title: "Réclamations", icon: <MessageCircle size={32} />, color: "#e67e22" },
        { to: "/admin/orders", title: "Commandes", icon: <ShoppingBag size={32} />, color: "#27ae60" },
        { to: "/admin/collections", title: "Collections", icon: <Layers size={32} />, color: "#8b6f5a" },
        { to: "/admin/settings", title: "Paramètres", icon: <Settings size={32} />, color: "#34495e" },
    ];

    return (
        <div className="admin-dashboard-v2">
            <div className="container">
                <header className="dash-header">
                    <div className="header-title">
                        <LayoutDashboard size={28} color="#8b6f5a" />
                        <div>
                            <h1>Tableau de bord</h1>
                            <p>Bienvenue, gérez votre boutique Sahar</p>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="logout-btn-v2">
                        <LogOut size={18} /> <span>Déconnexion</span>
                    </button>
                </header>

                <div className="dash-grid-v2">
                    {adminLinks.map((link, index) => (
                        <Link to={link.to} key={index} className="admin-card-v2">
                            <div className="card-icon" style={{ color: link.color }}>
                                {link.icon}
                            </div>
                            <h3>{link.title}</h3>
                            <div className="card-arrow">→</div>
                        </Link>
                    ))}
                </div>

                <div className="dash-footer-info">
                    <p>Connectée en tant qu'administrateur de <strong>SAHAR MODEST BRAND</strong></p>
                </div>
            </div>

            <style>{`
                .admin-dashboard-v2 {
                    background: #fdfbf9;
                    min-height: 100vh;
                    padding: 40px 15px;
                }
                .dash-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #f0eee8;
                }
                .header-title { display: flex; align-items: center; gap: 15px; }
                .header-title h1 { font-size: 28px; color: #2d2d2d; margin: 0; font-weight: 800; }
                .header-title p { color: #888; font-size: 14px; margin: 0; }

                .logout-btn-v2 {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #fff;
                    color: #d33;
                    border: 1px solid #fee2e2;
                    padding: 10px 20px;
                    border-radius: 50px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .logout-btn-v2:hover { background: #fee2e2; transform: translateY(-2px); }

                .dash-grid-v2 {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 25px;
                }

                .admin-card-v2 {
                    background: white;
                    padding: 35px 25px;
                    border-radius: 24px;
                    text-decoration: none;
                    text-align: center;
                    transition: 0.3s;
                    border: 1px solid #f0eee8;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                }
                .admin-card-v2:hover {
                    transform: translateY(-8px);
                    border-color: #8b6f5a;
                    box-shadow: 0 15px 35px rgba(139, 111, 90, 0.1);
                }
                .card-icon {
                    margin-bottom: 15px;
                    transition: 0.3s;
                }
                .admin-card-v2:hover .card-icon { transform: scale(1.1); }
                .admin-card-v2 h3 {
                    color: #2d2d2d;
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0;
                }
                .card-arrow {
                    position: absolute;
                    bottom: 15px;
                    right: 20px;
                    color: #8b6f5a;
                    opacity: 0;
                    transition: 0.3s;
                    font-size: 20px;
                }
                .admin-card-v2:hover .card-arrow { opacity: 1; transform: translateX(5px); }

                .dash-footer-info {
                    margin-top: 60px;
                    text-align: center;
                    color: #aaa;
                    font-size: 14px;
                }

                @media (max-width: 768px) {
                    .dash-header { flex-direction: column; text-align: center; gap: 20px; }
                    .header-title { flex-direction: column; }
                    .logout-btn-v2 span { display: none; }
                    .logout-btn-v2 { padding: 10px; border-radius: 50%; }
                    .dash-grid-v2 { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}