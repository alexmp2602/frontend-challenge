import type { KeyboardEvent } from "react";
import { categories, suppliers } from "../data/products";
import "./ProductFilters.css";

interface ProductFiltersProps {
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;

  // Filtros avanzados
  selectedSuppliers: string[];
  priceMin: number | "";
  priceMax: number | "";

  // Callbacks
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
  onSuppliersChange: (ids: string[]) => void;
  onPriceChange: (min: number | "", max: number | "") => void;
  onClearAll: () => void;
}

/** Evita caracteres inválidos en <input type="number"> */
const preventInvalidChars = (e: KeyboardEvent<HTMLInputElement>) => {
  if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
};

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
  /** Alterna un proveedor en la lista */
  const toggleSupplier = (id: string) => {
    const next = selectedSuppliers.includes(id)
      ? selectedSuppliers.filter((x) => x !== id)
      : [...selectedSuppliers, id];
    onSuppliersChange(next);
  };

  /** Sanitiza valores numéricos del rango de precios */
  const onMinChange = (val: string) => {
    const n = val === "" ? "" : Math.max(0, parseInt(val, 10) || 0);
    onPriceChange(n, priceMax);
  };
  const onMaxChange = (val: string) => {
    const n = val === "" ? "" : Math.max(0, parseInt(val, 10) || 0);
    onPriceChange(priceMin, n);
  };

  /** Helpers de limpieza individual */
  const clearSearch = () => onSearchChange("");
  const clearCategory = () => onCategoryChange("all");
  const clearSupplier = (id: string) =>
    onSuppliersChange(selectedSuppliers.filter((x) => x !== id));
  const clearSuppliersAll = () => onSuppliersChange([]);
  const clearPriceMin = () => onPriceChange("", priceMax);
  const clearPriceMax = () => onPriceChange(priceMin, "");
  const clearPriceBoth = () => onPriceChange("", "");

  /** Estado de filtros activos (no contamos “orden”) */
  const hasCategory = selectedCategory !== "all";
  const hasSearch = !!searchQuery.trim();
  const hasSuppliers = selectedSuppliers.length > 0;
  const hasPrice = priceMin !== "" || priceMax !== "";
  const hasActiveFilters = hasCategory || hasSearch || hasSuppliers || hasPrice;

  const activeCount =
    (hasSearch ? 1 : 0) +
    (hasCategory ? 1 : 0) +
    (hasSuppliers ? 1 : 0) +
    (hasPrice ? 1 : 0);

  /** Chips de filtros activos (para limpiar rápido) */
  const activeChips = [
    hasSearch && {
      key: "q",
      label: `Búsqueda: "${searchQuery.trim()}"`,
      onClear: clearSearch,
    },
    hasCategory && {
      key: "cat",
      label:
        "Categoría: " +
        (categories.find((c) => c.id === selectedCategory)?.name ??
          selectedCategory),
      onClear: clearCategory,
    },
    ...selectedSuppliers.map((id) => ({
      key: `sup-${id}`,
      label: suppliers.find((s) => s.id === id)?.name ?? id,
      onClear: () => clearSupplier(id),
    })),
    hasPrice && {
      key: "price",
      label: `Precio: ${priceMin === "" ? "0" : priceMin} – ${
        priceMax === "" ? "∞" : priceMax
      } CLP`,
      onClear: clearPriceBoth,
    },
  ].filter(Boolean) as { key: string; label: string; onClear: () => void }[];

  return (
    <section
      className="product-filters"
      role="region"
      aria-labelledby="filters-title"
    >
      <div className="filters-card">
        {/* Resumen colapsable (útil en mobile) */}
        <details className="filters-collapsible" open>
          <summary className="filters-summary p1-medium" aria-live="polite">
            Filtros {hasActiveFilters ? `· ${activeCount} activos` : ""}
          </summary>

          {/* Chips de filtros activos */}
          {hasActiveFilters && (
            <div
              className="active-chips"
              role="list"
              aria-label="Filtros activos"
            >
              {activeChips.map((chip) => (
                <div key={chip.key} role="listitem" className="chip">
                  <span className="chip-label l1">{chip.label}</span>
                  <button
                    type="button"
                    className="chip-clear"
                    onClick={chip.onClear}
                    aria-label={`Quitar ${chip.label}`}
                    title="Quitar"
                  >
                    <span className="material-icons" aria-hidden>
                      close
                    </span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="chip chip-reset"
                onClick={onClearAll}
                aria-label="Limpiar todos los filtros"
                title="Limpiar todos"
              >
                <span className="material-icons" aria-hidden>
                  refresh
                </span>
                <span className="l1">Limpiar todo</span>
              </button>
            </div>
          )}

          {/* Buscador */}
          <div className="search-section">
            <div className="search-box" role="search">
              <span className="material-icons" aria-hidden>
                search
              </span>
              <label htmlFor="search" className="visually-hidden">
                Buscar por nombre, SKU, proveedor o categoría
              </label>
              <input
                id="search"
                type="text"
                placeholder="Buscar productos, SKU…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input p1"
                autoComplete="off"
                spellCheck={false}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={clearSearch}
                  aria-label="Limpiar búsqueda"
                  title="Limpiar búsqueda"
                >
                  <span className="material-icons" aria-hidden>
                    close
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Categorías */}
          <div className="filter-section">
            <h3 id="filters-title" className="filter-title p1-medium">
              Categorías
            </h3>
            <div
              className="category-filters"
              role="group"
              aria-label="Categorías"
            >
              {categories.map((category) => {
                const active = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    className={`category-btn ${active ? "active" : ""}`}
                    onClick={() => onCategoryChange(category.id)}
                    aria-pressed={active}
                  >
                    <span className="material-icons" aria-hidden>
                      {category.icon}
                    </span>
                    <span className="category-name l1">{category.name}</span>
                    <span className="category-count l1">
                      ({category.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Orden */}
          <div className="filter-section">
            <h3 className="filter-title p1-medium">Ordenar por</h3>
            <label htmlFor="sort" className="visually-hidden">
              Ordenar resultados
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="sort-select p1"
            >
              <option value="name">Nombre A–Z</option>
              <option value="price">Precio</option>
              <option value="stock">Stock disponible</option>
            </select>
          </div>

          {/* Proveedores */}
          <div className="filter-section">
            <h3 className="filter-title p1-medium">Proveedores</h3>
            {hasSuppliers && (
              <button
                type="button"
                className="btn btn-xs btn-clear-suppliers"
                onClick={clearSuppliersAll}
                aria-label="Quitar todos los proveedores"
                title="Quitar todos"
              >
                Quitar todos
              </button>
            )}
            <div
              className="supplier-list"
              role="group"
              aria-label="Proveedores"
            >
              {suppliers.map((s) => (
                <label key={s.id} className="supplier-item">
                  <input
                    type="checkbox"
                    checked={selectedSuppliers.includes(s.id)}
                    onChange={() => toggleSupplier(s.id)}
                    aria-checked={selectedSuppliers.includes(s.id)}
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
            <div
              className="price-range"
              role="group"
              aria-label="Rango de precios"
            >
              <div className="price-field">
                <label className="l1" htmlFor="min">
                  Mínimo
                </label>
                <div className="price-input-wrap">
                  <input
                    id="min"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="0"
                    className="p1"
                    value={priceMin === "" ? "" : String(priceMin)}
                    onChange={(e) => onMinChange(e.target.value)}
                    onKeyDown={preventInvalidChars}
                  />
                  {priceMin !== "" && (
                    <button
                      type="button"
                      className="price-clear"
                      onClick={clearPriceMin}
                      aria-label="Limpiar mínimo"
                      title="Limpiar mínimo"
                    >
                      <span className="material-icons" aria-hidden>
                        close
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="price-sep" aria-hidden>
                —
              </div>

              <div className="price-field">
                <label className="l1" htmlFor="max">
                  Máximo
                </label>
                <div className="price-input-wrap">
                  <input
                    id="max"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="∞"
                    className="p1"
                    value={priceMax === "" ? "" : String(priceMax)}
                    onChange={(e) => onMaxChange(e.target.value)}
                    onKeyDown={preventInvalidChars}
                  />
                  {priceMax !== "" && (
                    <button
                      type="button"
                      className="price-clear"
                      onClick={clearPriceMax}
                      aria-label="Limpiar máximo"
                      title="Limpiar máximo"
                    >
                      <span className="material-icons" aria-hidden>
                        close
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="filter-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClearAll}
              disabled={!hasActiveFilters}
              title={
                hasActiveFilters
                  ? "Restablecer filtros"
                  : "No hay filtros activos"
              }
            >
              <span className="material-icons" aria-hidden>
                refresh
              </span>
              Limpiar filtros
            </button>
          </div>
        </details>
      </div>
    </section>
  );
};

export default ProductFilters;
