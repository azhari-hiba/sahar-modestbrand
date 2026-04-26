import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [collections, setCollections] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();

        const sorted = [...data].sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return 0; 
        });

        setProducts(sorted);
        setFiltered(sorted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      const snap = await getDocs(collection(db, "collections"));
      setCollections(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    const result = products.filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(result);
    setCurrentPage(1);
  }, [search, products]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const currentProducts = filtered.slice(start, start + perPage);

  if (loading) return <Loader />;

  return (
    <>
      <div className="container">

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          background: "#8b6f5a",
          color: "white",
          padding: "12px",
          textAlign: "center",
          borderRadius: "12px",
          marginBottom: "20px",
          fontWeight: "500",
        }}
      >
        🚚 Livraison gratuite partout au Maroc
      </motion.div>
      <HeroSection />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginBottom: "30px" }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "5px" }}>
          SAHAR — Modest Brand
        </h1>
        <p style={{ color: "#666" }}>
          Élégance, pudeur et style moderne 🌊
        </p>
      </motion.div>

      <input
        type="text"
        placeholder="Rechercher produit..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          marginBottom: "20px",
          outline: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          marginBottom: "25px",
        }}
      >
        {collections.map((c) => (
          <Link key={c.id} to={`/collection/${c.name}`}>
            <div
              style={{
                padding: "10px 18px",
                background: "#f5f5f5",
                borderRadius: "25px",
                whiteSpace: "nowrap",
                cursor: "pointer",
                border: "1px solid #ddd",
              }}
            >
              {c.name}
            </div>
          </Link>
        ))}
      </div>

      <motion.div id="products" className="grid">
        {currentProducts.length === 0 && (
          <p style={{ textAlign: "center" }}>
            Aucun produit trouvé
          </p>
        )}

        {currentProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {totalPages > 1 && (
        <div
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            {"<"}
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;

            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    background: currentPage === page ? "#000" : "#eee",
                    color: currentPage === page ? "#fff" : "#000",
                  }}
                >
                  {page}
                </button>
              );
            }

            if (
              page === currentPage - 2 ||
              page === currentPage + 2
            ) {
              return <span key={i}>...</span>;
            }

            return null;
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
    </>
  );
}