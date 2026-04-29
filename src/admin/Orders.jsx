import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Search, Phone, MapPin, CheckCircle2, XCircle, Clock, Truck, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Swal from "sweetalert2";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  const getStatusStyle = (status) => {
    switch (status) {
      case "livré": return { bg: "#dcfce7", color: "#15803d", icon: <Truck size={14} /> };
      case "confirmé": return { bg: "#fef3c7", color: "#92400e", icon: <CheckCircle2 size={14} /> };
      case "annulé": return { bg: "#fee2e2", color: "#b91c1c", icon: <XCircle size={14} /> };
      default: return { bg: "#f3f4f6", color: "#374151", icon: <Clock size={14} /> };
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const snap = await getDocs(collection(db, "orders"));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const adjustStock = async (items, type) => {
    for (let item of items) {
      const ref = doc(db, "products", item.productId);
      const snap = await getDoc(ref);
      if (!snap.exists()) continue;
      const data = snap.data();
      const updatedColors = data.colors.map((color) => {
        if (color.image === item.image) {
          const currentQty = color.sizes[item.size] || 0;
          return { 
            ...color, 
            sizes: { 
              ...color.sizes, 
              [item.size]: type === "restore" ? currentQty + item.quantity : currentQty - item.quantity 
            } 
          };
        }
        return color;
      });
      await updateDoc(ref, { colors: updatedColors });
    }
  };

  const updateStatus = async (order, status) => {
    if (status === "annulé" && order.status !== "annulé") {
      await adjustStock(order.items, "restore");
    } else if (order.status === "annulé" && status !== "annulé") {
      await adjustStock(order.items, "remove");
    }
    await updateDoc(doc(db, "orders", order.id), { status });
    setOrders(prev => prev.map(o => (o.id === order.id ? { ...o, status } : o)));
  };

  const handleDelete = async (order) => {
    const res = await Swal.fire({ title: "Supprimer ?", text: "Irréversible !", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (res.isConfirmed) {
      if (order.status !== "annulé") await adjustStock(order.items, "restore");
      await deleteDoc(doc(db, "orders", order.id));
      setOrders(prev => prev.filter(o => o.id !== order.id));
    }
  };

  const filtered = orders.filter(o => o.client?.name?.toLowerCase().includes(search.toLowerCase()) || o.client?.phone?.includes(search));

  return (
    <div className="orders-page container">
      <h1>Gestion des Commandes</h1>
      <div className="search-wrapper-admin">
        <Search size={18} className="search-icon-svg" />
        <input type="text" placeholder="Rechercher par nom ou téléphone..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.map(order => {
        const style = getStatusStyle(order.status);
        return (
          <div key={order.id} className="order-card">
            <div className="order-summary" onClick={() => setOpenId(openId === order.id ? null : order.id)}>
              <div className="client-info">
                <b>{order.client?.name}</b>
                <a href={`tel:${order.client?.phone}`}><Phone size={14} /> {order.client?.phone}</a>
              </div>
              <div className="order-meta">
                <span className="price-tag">{order.total} DH</span>
                <span className="status-badge" style={{ background: style.bg, color: style.color }}>
                  {style.icon} {order.status}
                </span>
                {openId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {openId === order.id && (
              <div className="order-details">
                <p><MapPin size={16} /> {order.client?.address}, {order.client?.city}</p>
                {order.client?.note && <div className="note-box">📝 {order.client.note}</div>}
                <h4>Produits commandés</h4>
                {order.items?.map((item, i) => (
                  <div key={i} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p><b>{item.name}</b></p>
                      <small>Taille: {item.size} | Qté: {item.quantity} | {item.price} DH</small>
                    </div>
                  </div>
                ))}
                <div className="order-actions">
                  <button className="del" onClick={() => handleDelete(order)}><Trash2 size={16} /></button>
                  <button onClick={() => updateStatus(order, "confirmé")}>Confirmer</button>
                  <button onClick={() => updateStatus(order, "livré")}>Livrer</button>
                  <button onClick={() => updateStatus(order, "annulé")}>Annuler</button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        .orders-page { padding: 40px 20px; background: #fdfbf9; min-height: 100vh; }
        .order-card { background: white; border-radius: 16px; border: 1px solid #eee; margin-bottom: 15px; padding: 20px; }
        .order-summary { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .client-info { display: flex; flex-direction: column; gap: 5px; }
        .order-meta { display: flex; align-items: center; gap: 15px; }
        .status-badge { display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: capitalize; }
        .order-details { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
        .order-item { display: flex; gap: 15px; margin-bottom: 10px; align-items: center; }
        .order-item img { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; }
        .note-box { background: #fff3cd; padding: 10px; border-radius: 8px; font-size: 13px; margin: 10px 0; }
        .order-actions { display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap; }
        .order-actions button { padding: 8px 15px; border-radius: 8px; border: 1px solid #eee; cursor: pointer; font-weight: 600; background: white; transition: 0.2s; }
        .order-actions button:hover { background: #fafafa; }
        .del { background: #fee2e2 !important; color: #b91c1c !important; border: none !important; }
        .search-wrapper-admin { position: relative; margin-bottom: 25px; max-width: 500px; display: flex; align-items: center; }
        .search-icon-svg { position: absolute; left: 15px; color: #8b6f5a; }
        .search-wrapper-admin input { width: 100%; padding: 12px 15px 12px 45px; border-radius: 12px; border: 1px solid #eee; outline: none; }
      `}</style>
    </div>
  );
}