import { categories, suppliers } from "../data/products";
import "./ProductFilters.css";

interface ProductFiltersProps {
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;

  // NUEVO: filtros avanzados
  selectedSuppliers: string[];
  priceMin: number | "";
  priceMax: number | "";

  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;

  // NUEVO: handlers
  onSuppliersChange: (ids: string[]) => void;
  onPriceChange: (min: number | "", max: number | "") => void;
  onClearAll: () => void;
}

const ProductFilters = ({
  selectedCategory,
  searchQuery,
  sortBy,
  selectedSuppliers,
  priceMin,
  priceMax,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onSuppliersChange,
  onPriceChange,
  onClearAll,
}: ProductFiltersProps) => {
  const toggleSupplier = (id: string) => {
    const next = selectedSuppliers.includes(id)
      ? selectedSuppliers.filter((x) => x !== id)
      : [...selectedSuppliers, id];
    onSuppliersChange(next);
  };

  const onMinChange = (val: string) => {
    const n = val === "" ? "" : Math.max(0, parseInt(val, 10) || 0);
    onPriceChange(n, priceMax);
  };

  const onMaxChange = (val: string) => {
    const n = val === "" ? "" : Math.max(0, parseInt(val, 10) || 0);
    onPriceChange(priceMin, n);
  };

  return (
    <div className="product-filters">
      <div className="filters-card">
        {/* Buscador */}
        <div className="search-section">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Buscar productos, SKU…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input p1"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => onSearchChange("")}
                aria-label="Limpiar búsqueda"
                title="Limpiar búsqueda"
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Categorías */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Categorías</h3>
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="material-icons">{category.icon}</span>
                <span className="category-name l1">{category.name}</span>
                <span className="category-count l1">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Orden */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Ordenar por</h3>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select p1"
          >
            <option value="name">Nombre A-Z</option>
            <option value="price">Precio</option>
            <option value="stock">Stock disponible</option>
          </select>
        </div>

        {/* Proveedores (checkboxes) */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Proveedores</h3>
          <div className="supplier-list">
            {suppliers.map((s) => (
              <label key={s.id} className="supplier-item">
                <input
                  type="checkbox"
                  checked={selectedSuppliers.includes(s.id)}
                  onChange={() => toggleSupplier(s.id)}
                />
                <span className="supplier-name l1">{s.name}</span>
                <span className="supplier-count l1">{s.products}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rango de precios */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Rango de precios (CLP)</h3>
          <div className="price-range">
            <div className="price-field">
              <label className="l1" htmlFor="min">
                Mínimo
              </label>
              <input
                id="min"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="0"
                className="p1"
                value={priceMin === "" ? "" : String(priceMin)}
                onChange={(e) => onMinChange(e.target.value)}
              />
            </div>
            <div className="price-sep">—</div>
            <div className="price-field">
              <label className="l1" htmlFor="max">
                Máximo
              </label>
              <input
                id="max"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="∞"
                className="p1"
                value={priceMax === "" ? "" : String(priceMax)}
                onChange={(e) => onMaxChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Limpiar todo */}
        <div className="filter-actions">
          <button className="btn btn-outline" onClick={onClearAll}>
            <span className="material-icons">refresh</span>
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
