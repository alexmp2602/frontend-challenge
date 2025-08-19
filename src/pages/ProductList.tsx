import { useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import {
  products as allProducts,
  suppliers,
  categories,
} from "../data/products";
import { Product } from "../types/Product";
import "./ProductList.css";

type SortKey = "name" | "price" | "stock";

const ProductList = () => {
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(allProducts);

  // Filtros básicos
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");

  // Filtros avanzados
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");

  /**
   * Aplica todos los filtros + orden al catálogo completo
   */
  const filterProducts = (
    category: string,
    search: string,
    sort: SortKey,
    supplierIds: string[],
    min: number | "",
    max: number | ""
  ) => {
    let list = [...allProducts];

    // Categoría
    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    // Búsqueda (case-insensitive) en name/sku/supplier/category
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const name = p.name?.toLowerCase() ?? "";
        const sku = p.sku?.toLowerCase() ?? "";
        const supplier = p.supplier?.toLowerCase() ?? "";
        const cat = p.category?.toLowerCase() ?? "";
        return (
          name.includes(q) ||
          sku.includes(q) ||
          supplier.includes(q) ||
          cat.includes(q)
        );
      });
    }

    // Proveedores (si hay seleccionados)
    if (supplierIds.length > 0) {
      const setIds = new Set(supplierIds);
      list = list.filter((p) => setIds.has(p.supplier));
    }

    // Rango de precios (basePrice en CLP)
    if (min !== "" || max !== "") {
      const lo = min === "" ? -Infinity : min;
      const hi = max === "" ? Infinity : max;
      const minV = Math.min(lo, hi);
      const maxV = Math.max(lo, hi);
      list = list.filter((p) => p.basePrice >= minV && p.basePrice <= maxV);
    }

    // Orden
    switch (sort) {
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price":
        list.sort((a, b) => a.basePrice - b.basePrice); // ascendente
        break;
      case "stock":
        list.sort((a, b) => b.stock - a.stock); // mayor stock primero
        break;
    }

    setFilteredProducts(list);
  };

  // Handlers de UI
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterProducts(
      category,
      searchQuery,
      sortBy,
      selectedSuppliers,
      priceMin,
      priceMax
    );
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    filterProducts(
      selectedCategory,
      search,
      sortBy,
      selectedSuppliers,
      priceMin,
      priceMax
    );
  };

  const handleSortChange = (sort: string) => {
    const key = (sort as SortKey) || "name";
    setSortBy(key);
    filterProducts(
      selectedCategory,
      searchQuery,
      key,
      selectedSuppliers,
      priceMin,
      priceMax
    );
  };

  const handleSuppliersChange = (ids: string[]) => {
    setSelectedSuppliers(ids);
    filterProducts(
      selectedCategory,
      searchQuery,
      sortBy,
      ids,
      priceMin,
      priceMax
    );
  };

  const handlePriceChange = (min: number | "", max: number | "") => {
    setPriceMin(min);
    setPriceMax(max);
    filterProducts(
      selectedCategory,
      searchQuery,
      sortBy,
      selectedSuppliers,
      min,
      max
    );
  };

  const handleClearAll = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("name");
    setSelectedSuppliers([]);
    setPriceMin("");
    setPriceMax("");
    filterProducts("all", "", "name", [], "", "");
  };

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Header de página */}
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
                {filteredProducts.length}
              </span>
              <span className="stat-label l1">productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value p1-medium">{categories.length}</span>
              <span className="stat-label l1">categorías</span>
            </div>
            <div className="stat-item">
              <span className="stat-value p1-medium">{suppliers.length}</span>
              <span className="stat-label l1">proveedores</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
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

        {/* Grilla de productos */}
        <div className="products-section">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3 className="h2">No hay productos</h3>
              <p className="p1">
                No se encontraron resultados con los filtros aplicados.
              </p>
              <button className="btn btn-primary cta1" onClick={handleClearAll}>
                Limpiar filtros
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
