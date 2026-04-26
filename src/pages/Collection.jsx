import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { motion } from "framer-motion";

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

    setFiltered(result);
    setCurrentPage(1);
  }, [name, products, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const currentProducts = filtered.slice(start, start + perPage);

  if (loading) return <Loader />;

  return (
    <div className="container">

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "20px" }}
      >
        <h1 style={{ fontSize: "26px" }}>
          Collection: {name}
        </h1>
        <p style={{ color: "#777" }}>
          Découvrez nos modèles élégants ✨
        </p>
      </motion.div>

      <input
        type="text"
        placeholder="Rechercher dans cette collection..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          marginBottom: "20px",
          outline: "none"
        }}
      />

      {filtered.length === 0 && (
        <p style={{ textAlign: "center" }}>
          Aucun produit trouvé
        </p>
      )}

      <motion.div className="grid">
        {currentProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
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
            flexWrap: "wrap"
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
                    color: currentPage === page ? "#fff" : "#000"
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
  );
}