import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

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
        const sorted = [...data].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
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
      try {
        const snap = await getDocs(collection(db, "collections"));
        setCollections(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
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
  const currentProducts = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  if (loading) return <Loader />;

  return (
    <div className="home-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        
        .home-wrapper { 
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fff;
        }

        /* Full Width Announcement */
        .top-announcement { 
          background: #8b6f5a; 
          color: white; 
          padding: 12px 0; 
          text-align: center; 
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.5px;
          width: 100%;
        }

        /* Container for content that shouldn't touch edges */
        .container-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .home-intro { text-align: center; margin: 40px 0 30px; }
        .home-intro h1 { 
          font-size: clamp(22px, 5vw, 28px); 
          font-weight: 800; 
          color: #111; 
          margin-bottom: 8px;
        }
        .home-intro p { color: #666; font-size: 16px; }

        .search-container-yc { 
          position: relative; 
          margin-bottom: 25px; 
          max-width: 500px; 
          margin-inline: auto; 
        }
        .yc-search-icon { 
          position: absolute; 
          left: 16px; 
          top: 50%; 
          transform: translateY(-50%); 
          color: #999; 
        }
        .search-container-yc input {
          width: 100%; 
          padding: 14px 14px 14px 48px; 
          border-radius: 12px;
          border: 1px solid #eee; 
          background: #f9f9f9; 
          outline: none;
          font-family: 'Inter', sans-serif;
          transition: 0.3s;
        }
        .search-container-yc input:focus { 
          background: #fff;
          border-color: #8b6f5a; 
          box-shadow: 0 0 0 4px rgba(139,111,90,0.05); 
        }

        .collections-scroll-yc { 
          display: flex; 
          gap: 10px; 
          overflow-x: auto; 
          margin-bottom: 40px; 
          padding: 5px;
          scrollbar-width: none; 
          justify-content: center;
        }
        .collections-scroll-yc::-webkit-scrollbar { display: none; }
        .yc-chip {
          padding: 10px 20px; 
          background: #fff; 
          border-radius: 10px;
          border: 1px solid #eee; 
          color: #444; 
          text-decoration: none;
          font-size: 14px; 
          font-weight: 600; 
          white-space: nowrap;
          transition: 0.2s;
        }
        .yc-chip:hover { border-color: #8b6f5a; color: #8b6f5a; }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 25px;
        }

        .yc-pagination { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 60px; }
        .yc-pagination button {
          border: 1px solid #eee; background: white; width: 40px; height: 40px;
          border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .yc-page-numbers button { width: 40px; height: 40px; font-weight: 700; border: 1px solid #eee; background: #fff; border-radius: 10px; cursor: pointer; }
        .yc-page-numbers button.active { background: #111; color: white; border-color: #111; }

        @media (max-width: 768px) {
          .collections-scroll-yc { justify-content: flex-start; }
          .grid { grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .container-content { padding: 0 15px; }
        }
      `}</style>

      {/* 1. Full Width Announcement */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="top-announcement">
        🚚 Livraison gratuite partout au Maroc
      </motion.div>

      {/* 2. Full Width Hero (لاصق ف الجناب) */}
      <HeroSection />

      {/* 3. Restricted Content (لي خصهوم الـ padding) */}
      <div className="container-content">
        <div className="home-intro">
          <h1>SAHAR — Modest Brand</h1>
          <p>Élégance, pudeur et style moderne</p>
        </div>

        <div className="search-container-yc">
          <Search size={18} className="yc-search-icon" />
          <input
            type="text"
            placeholder="Rechercher produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="collections-scroll-yc">
          {collections.map((c) => (
            <Link key={c.id} to={`/collection/${c.name}`} className="yc-chip">
              {c.name}
            </Link>
          ))}
        </div>

        <div id="products" className="grid">
          {currentProducts.length === 0 && <p className="no-data">Aucun produit trouvé</p>}
          {currentProducts.map((product) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="yc-pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft size={18} />
            </button>
            <div className="yc-page-numbers">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  className={currentPage === (i + 1) ? "active" : ""} 
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}