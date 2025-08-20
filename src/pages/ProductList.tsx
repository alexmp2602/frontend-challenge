import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { products as allProducts } from "../data/products";
import { Product } from "../types/Product";
import "./ProductList.css";

type SortKey = "name" | "price" | "stock";

const SKELETON_COUNT = 8;
const LOAD_DELAY_MS = 350;

const ProductList = () => {
  // Filtros y orden
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");

  // Filtros avanzados
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");

  // Estado de lista + loading (skeleton)
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(allProducts);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Función pura que aplica TODOS los filtros/orden
  const compute = useMemo(
    () =>
      (
        category: string,
        search: string,
        sort: SortKey,
        suppliers: string[],
        min: number | "",
        max: number | ""
      ) => {
        let out = [...allProducts];

        // Category
        if (category !== "all") {
          out = out.filter((p) => p.category === category);
        }

        // Search (case-insensitive en name/sku/supplier/category)
        const q = search.trim().toLowerCase();
        if (q) {
          out = out.filter((p) => {
            const name = p.name?.toLowerCase() ?? "";
            const sku = p.sku?.toLowerCase() ?? "";
            const supp = p.supplier?.toLowerCase() ?? "";
            const cat = p.category?.toLowerCase() ?? "";
            return (
              name.includes(q) ||
              sku.includes(q) ||
              supp.includes(q) ||
              cat.includes(q)
            );
          });
        }

        // Suppliers (si hay seleccionados)
        if (suppliers.length > 0) {
          out = out.filter((p) => suppliers.includes(p.supplier));
        }

        // Rango de precios (basePrice)
        if (min !== "" || max !== "") {
          out = out.filter((p) => {
            const price = p.basePrice;
            if (min !== "" && price < min) return false;
            if (max !== "" && price > max) return false;
            return true;
          });
        }

        // Orden
        switch (sort) {
          case "name":
            out.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "price":
            out.sort((a, b) => a.basePrice - b.basePrice);
            break;
          case "stock":
            out.sort((a, b) => b.stock - a.stock);
            break;
        }

        return out;
      },
    []
  );

  // Recalcular con un pequeño delay (muestra skeleton)
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => {
      const next = compute(
        selectedCategory,
        searchQuery,
        sortBy,
        selectedSuppliers,
        priceMin,
        priceMax
      );
      setFilteredProducts(next);
      setIsLoading(false);
    }, LOAD_DELAY_MS);

    return () => clearTimeout(t);
  }, [
    selectedCategory,
    searchQuery,
    sortBy,
    selectedSuppliers,
    priceMin,
    priceMax,
    compute,
  ]);

  // Handlers
  const handleCategoryChange = (category: string) =>
    setSelectedCategory(category);
  const handleSearchChange = (search: string) => setSearchQuery(search);
  const handleSortChange = (sort: string) =>
    setSortBy((sort as SortKey) || "name");
  const handleSuppliersChange = (ids: string[]) => setSelectedSuppliers(ids);
  const handlePriceChange = (min: number | "", max: number | "") => {
    setPriceMin(min);
    setPriceMax(max);
  };
  const handleClearAll = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("name");
    setSelectedSuppliers([]);
    setPriceMin("");
    setPriceMax("");
  };

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-info">
            <h1 className="page-title h2">Catálogo de Productos</h1>
            <p className="page-subtitle p1">
              Descubre nuestra selección de productos promocionales premium
            </p>
          </div>

          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-value p1-medium">
                {isLoading ? "…" : filteredProducts.length}
              </span>
              <span className="stat-label l1">productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value p1-medium">6</span>
              <span className="stat-label l1">categorías</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          selectedSuppliers={selectedSuppliers}
          priceMin={priceMin}
          priceMax={priceMax}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onSuppliersChange={handleSuppliersChange}
          onPriceChange={handlePriceChange}
          onClearAll={handleClearAll}
        />

        {/* Products Section */}
        <div className="products-section">
          {isLoading ? (
            // Skeleton grid
            <div className="products-grid">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="product-card skeleton-card"
                  aria-hidden="true"
                >
                  <div className="product-image">
                    <div className="skeleton-box image" />
                  </div>
                  <div className="product-info">
                    <div className="skeleton-line w-70" />
                    <div className="skeleton-line w-40" />
                    <div className="skeleton-tags">
                      <span className="skeleton-pill" />
                      <span className="skeleton-pill" />
                      <span className="skeleton-pill" />
                    </div>
                  </div>
                  <div className="product-footer">
                    <div className="skeleton-line w-30" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3 className="h2">No hay productos</h3>
              <p className="p1">
                No se encontraron productos que coincidan con tu búsqueda.
              </p>
              <button className="btn btn-primary cta1" onClick={handleClearAll}>
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
