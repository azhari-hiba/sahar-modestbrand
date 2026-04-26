import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  const getStatusStyle = (status) => {
    switch (status) {
      case "livré":
        return { background: "#d4edda", color: "#155724" };
      case "confirmé":
        return { background: "#fff3cd", color: "#856404" };
      case "annulé":
        return { background: "#f8d7da", color: "#721c24" };
      default:
        return { background: "#eee", color: "#333" };
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const snap = await getDocs(collection(db, "orders"));

      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      data.sort((a, b) => {
        return new Date(b.createdAt?.seconds * 1000) -
               new Date(a.createdAt?.seconds * 1000);
      });

      setOrders(data);
    };

    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });

    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );
  };

  const filtered = orders.filter(o =>
    o.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.client?.phone?.includes(search)
  );

  return (
    <div className="container">
      <h1>Commandes</h1>

      <input
        placeholder="Rechercher (nom ou téléphone)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "10px",
          border: "1px solid #ccc"
        }}
      />

      {filtered.map(order => {
        const date = order.createdAt
          ? new Date(order.createdAt.seconds * 1000).toLocaleString()
          : "";

        return (
          <div key={order.id} style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            marginBottom: "10px",
            background: "#fff"
          }}>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>

              <div>
                <b>{order.client?.name}</b><br />

                <a
                  href={`tel:${order.client?.phone}`}
                  style={{ color: "#8b6f5a", fontSize: "14px" }}
                >
                  📞 {order.client?.phone}
                </a>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>{order.total} DH</b><br />

                <span style={{
                  ...getStatusStyle(order.status),
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "12px"
                }}>
                  {order.status}
                </span>
              </div>

              <button onClick={() =>
                setOpenId(openId === order.id ? null : order.id)
              }>
                {openId === order.id ? "Fermer" : "Voir"}
              </button>
            </div>

            <small style={{ color: "#888" }}>{date}</small>

            {openId === order.id && (
              <div style={{ marginTop: "15px" }}>

                <hr />

                <p><b>Ville:</b> {order.client?.city}</p>
                <p><b>Adresse:</b> {order.client?.address}</p>

                {order.client?.note && (
                  <p style={{
                    background: "#fff3cd",
                    padding: "10px",
                    borderRadius: "8px"
                  }}>
                    📝 {order.client.note}
                  </p>
                )}

                <h4>Produits</h4>

                {order.items?.map((item, i) => (
                  <div key={i} style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "10px",
                    alignItems: "center"
                  }}>
                    <img
                      src={item.image}
                      width="60"
                      style={{ borderRadius: "8px" }}
                    />

                    <div>
                      <p style={{ margin: 0 }}>
                        <b>{item.name}</b>
                      </p>
                      <small>Taille: {item.size}</small><br />
                      <small>Qté: {item.quantity}</small><br />
                      <small>Prix: {item.price} DH</small>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 10 }}>
                  <button onClick={() => updateStatus(order.id, "confirmé")}>
                    Confirmé
                  </button>

                  <button onClick={() => updateStatus(order.id, "livré")}>
                    Livré
                  </button>

                  <button onClick={() => updateStatus(order.id, "annulé")}>
                    Annulé
                  </button>
                </div>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}