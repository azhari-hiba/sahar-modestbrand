import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Search, Phone, MapPin, CheckCircle2, XCircle, Clock, Truck, Trash2, ChevronDown, ChevronUp, Calendar } from "lucide-react";
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
      try {
        const snap = await getDocs(collection(db, "orders"));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        data.sort((a, b) => {
          const parseDate = (obj) => {
            if (obj?.createdAt?.seconds) return obj.createdAt.seconds * 1000;
            if (obj?.date) {
              const cleanDate = obj.date.replace(/"/g, '');
              const [d, m, y, t] = cleanDate.split(/[\/\s]/);
              return new Date(`${y}-${m}-${d}T${t}`).getTime() || 0;
            }
            return 0;
          };
          return parseDate(b) - parseDate(a);
        });
        
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
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
    Swal.fire("Succès", `Statut : ${status}`, "success");
  };

  const handleDelete = async (order) => {
    const res = await Swal.fire({ 
      title: "Supprimer ?", 
      icon: "warning", 
      showCancelButton: true, 
      confirmButtonColor: "#d33" 
    });
    if (res.isConfirmed) {
      if (order.status !== "annulé") await adjustStock(order.items, "restore");
      await deleteDoc(doc(db, "orders", order.id));
      setOrders(prev => prev.filter(o => o.id !== order.id));
    }
  };

  const filtered = orders.filter(o => 
    o.client?.name?.toLowerCase().includes(search.toLowerCase()) || 
    o.client?.phone?.includes(search)
  );

  return (
    <div className="orders-page container">
      <div className="header-admin">
        <h1>Gestion des Commandes</h1>
        <p>{filtered.length} commandes</p>
      </div>

      <div className="search-wrapper-admin">
        <Search size={18} className="search-icon-svg" />
        <input type="text" placeholder="Nom ou téléphone..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="orders-list">
        {filtered.map(order => {
          const style = getStatusStyle(order.status);
          const displayDate = order.date ? order.date.replace(/"/g, '') : (order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : "Pas de date");
          
          return (
            <div key={order.id} className="order-card">
              <div className="order-summary" onClick={() => setOpenId(openId === order.id ? null : order.id)}>
                <div className="client-info">
                  <div className="name-row">
                    <b>{order.client?.name}</b>
                    <span className="order-date-label"><Calendar size={12} /> {displayDate}</span>
                  </div>
                  <a href={`tel:${order.client?.phone}`} className="phone-link"><Phone size={14} /> {order.client?.phone}</a>
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
                  <div className="shipping-info">
                    <p><MapPin size={16} /> <b>{order.client?.city}</b></p>
                    <p>{order.client?.address}</p>
                    {order.client?.note && <div className="note-box">📝 {order.client.note}</div>}
                  </div>
                  <div className="items-grid">
                    {order.items?.map((item, i) => (
                      <div key={i} className="order-item">
                        <img src={item.image} alt="" />
                        <div className="item-txt">
                          <p><b>{item.name}</b></p>
                          <small>T{item.size} | Q{item.quantity} | {item.price} DH</small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-actions">
                    <button className="del-btn" onClick={() => handleDelete(order)}><Trash2 size={18} /></button>
                    <div className="status-btns">
                      <button onClick={() => updateStatus(order, "confirmé")}>Confirmer</button>
                      <button onClick={() => updateStatus(order, "livré")}>Livrer</button>
                      <button className="cancel-btn" onClick={() => updateStatus(order, "annulé")}>Annuler</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .orders-page { padding: 30px 15px; background: #fdfbf9; min-height: 100vh; }
        .header-admin { margin-bottom: 20px; }
        .search-wrapper-admin { position: relative; margin-bottom: 20px; }
        .search-icon-svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #8b6f5a; }
        .search-wrapper-admin input { width: 100%; padding: 12px 40px; border-radius: 10px; border: 1px solid #eee; }
        .order-card { background: white; border-radius: 12px; border: 1px solid #eee; margin-bottom: 10px; padding: 15px; }
        .order-summary { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .name-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .order-date-label { font-size: 10px; color: #888; background: #f5f5f5; padding: 2px 6px; border-radius: 4px; display: flex; align-items: center; gap: 3px; }
        .phone-link { color: #8b6f5a; text-decoration: none; font-size: 13px; display: flex; align-items: center; gap: 5px; margin-top: 4px; }
        .order-meta { display: flex; align-items: center; gap: 10px; }
        .status-badge { display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; }
        .order-details { margin-top: 15px; padding-top: 15px; border-top: 1px dashed #eee; }
        .note-box { background: #fffbeb; padding: 10px; border-radius: 6px; margin-top: 10px; font-size: 13px; }
        .items-grid { margin: 15px 0; display: flex; flex-direction: column; gap: 8px; }
        .order-item { display: flex; gap: 10px; align-items: center; background: #fafafa; padding: 8px; border-radius: 8px; }
        .order-item img { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; }
        .order-actions { display: flex; justify-content: space-between; margin-top: 15px; }
        .status-btns { display: flex; gap: 5px; }
        .order-actions button { padding: 6px 12px; border-radius: 6px; border: 1px solid #eee; cursor: pointer; font-size: 12px; background: #fff; }
        .del-btn { background: #fee2e2 !important; color: #b91c1c !important; border: none !important; }
        .cancel-btn { color: #b91c1c !important; }
      `}</style>
    </div>
  );
}