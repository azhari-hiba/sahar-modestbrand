import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react"; // Icons n9iyyin

export default function Collection() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchData();
  }, []);

useEffect(() => {
    let result = products.filter(
      (p) => p.collection?.toLowerCase() === name.toLowerCase()
    );
    
    if (search) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFiltered([...result].reverse()); 
    setCurrentPage(1);
  }, [name, products, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const currentProducts = filtered.slice(start, start + perPage);

  if (loading) return <Loader />;

  return (
    <div className="collection-container container">
      <motion.div
        className="collection-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-content">
          <h1>{name}</h1>
          <p>Explorez l'élégance de nos pièces uniques ✨</p>
        </div>

        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un modèle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="no-results">
          <p>Aucun produit trouvé dans cette collection.</p>
        </div>
      ) : (
        <div className="grid">
          {currentProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-premium">
          <button
            className="pag-nav"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="page-numbers">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={i}
                    className={`page-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={i} className="dots">...</span>;
              }
              return null;
            })}
          </div>

          <button
            className="pag-nav"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <style>{`
        .collection-container { padding: 40px 20px; }
        
        .collection-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 50px; flex-wrap: wrap; gap: 20px;
        }

        .text-content h1 { 
          font-size: 36px; font-weight: 800; text-transform: capitalize; 
          margin: 0; color: #2d2d2d; 
        }
        .text-content p { color: #888; font-size: 16px; margin-top: 8px; }

        .search-wrapper { position: relative; width: 300px; }
        .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #aaa; }
        .search-wrapper input {
          width: 100%; padding: 12px 15px 12px 45px; border-radius: 50px;
          border: 1px solid #eee; background: #fff; outline: none; transition: 0.3s;
          font-size: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }
        .search-wrapper input:focus { border-color: #8b6f5a; box-shadow: 0 4px 20px rgba(139, 111, 90, 0.1); }

        .no-results { text-align: center; padding: 100px 0; color: #999; font-style: italic; }

        .pagination-premium {
          margin-top: 60px; display: flex; justify-content: center; align-items: center; gap: 15px;
        }
        .page-numbers { display: flex; gap: 8px; align-items: center; }
        .page-btn {
          width: 40px; height: 40px; border-radius: 50%; border: none;
          background: #f8f8f8; color: #666; font-weight: 600; cursor: pointer; transition: 0.3s;
        }
        .page-btn.active { background: #8b6f5a; color: white; transform: scale(1.1); }
        .page-btn:hover:not(.active) { background: #eee; }

        .pag-nav {
          background: white; border: 1px solid #eee; width: 40px; height: 40px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #8b6f5a; transition: 0.3s;
        }
        .pag-nav:hover:not(:disabled) { border-color: #8b6f5a; background: #fdfbf9; }
        .pag-nav:disabled { opacity: 0.3; cursor: not-allowed; }

        @media (max-width: 768px) {
          .collection-header { flex-direction: column; align-items: flex-start; }
          .search-wrapper { width: 100%; }
        }
      `}</style>
    </div>
  );
}