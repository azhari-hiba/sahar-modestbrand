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
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      const snap = await getDocs(collection(db, "collections"));
      setCollections(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    const result = products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
    setCurrentPage(1);
  }, [search, products]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const currentProducts = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  if (loading) return <Loader />;

  return (
    <div className="home-wrapper">
      <div className="container">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="top-announcement">
          🚚 Livraison gratuite partout au Maroc
        </motion.div>

        <HeroSection />

        <div className="home-intro">
          <h1>SAHAR — Modest Brand</h1>
          <p>Élégance, pudeur et style moderne 🌊</p>
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
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                  return (
                    <button key={i} className={currentPage === p ? "active" : ""} onClick={() => setCurrentPage(p)}>
                      {p}
                    </button>
                  );
                }
                return (p === currentPage - 2 || p === currentPage + 2) ? <span key={i}>...</span> : null;
              })}
            </div>

            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .home-wrapper { padding-bottom: 50px; }
        .top-announcement { 
          background: #8b6f5a; color: white; padding: 12px; 
          text-align: center; border-radius: 12px; margin-bottom: 25px; font-weight: 500;
        }
        .home-intro h1 { font-size: 28px; margin-bottom: 5px; color: #1a1a1a; }
        .home-intro p { color: #666; margin-bottom: 25px; }

       
        .search-container-yc { position: relative; margin-bottom: 20px; }
        .yc-search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #888; }
        .search-container-yc input {
          width: 100%; padding: 14px 14px 14px 45px; border-radius: 8px;
          border: 1px solid #e1e1e1; background: #fff; outline: none;
          font-size: 15px; transition: 0.2s;
        }
        .search-container-yc input:focus { border-color: #8b6f5a; box-shadow: 0 0 0 3px rgba(139,111,90,0.1); }

        
        .collections-scroll-yc { 
          display: flex; gap: 10px; overflow-X: auto; margin-bottom: 30px; 
          padding-bottom: 5px; scrollbar-width: none; 
        }
        .collections-scroll-yc::-webkit-scrollbar { display: none; }
        .yc-chip {
          padding: 8px 20px; background: #fff; border-radius: 50px;
          border: 1px solid #eee; color: #333; text-decoration: none;
          font-size: 14px; font-weight: 500; white-space: nowrap;
          transition: 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }
        .yc-chip:hover { border-color: #8b6f5a; color: #8b6f5a; background: #fdfbf9; }

       
        .yc-pagination { display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 40px; }
        .yc-pagination button {
          border: 1px solid #e1e1e1; background: white; width: 40px; height: 40px;
          border-radius: 8px; cursor: pointer; display: flex; align-items: center; 
          justify-content: center; transition: 0.2s;
        }
        .yc-page-numbers { display: flex; gap: 5px; }
        .yc-page-numbers button { width: 35px; height: 35px; font-size: 14px; font-weight: 600; }
        .yc-page-numbers button.active { background: #1a1a1a; color: white; border-color: #1a1a1a; }
        .yc-pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
        .yc-pagination button:hover:not(:disabled) { border-color: #8b6f5a; }

        .no-data { text-align: center; width: 100%; grid-column: 1/-1; padding: 50px; color: #888; }
      `}</style>
    </div>
  );
}