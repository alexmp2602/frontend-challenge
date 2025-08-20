import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import { Product } from "../types/Product";
import PricingCalculator from "../components/PricingCalculator";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "./ProductDetail.css";

/* Cantidad segura */
function getQtyLimits(product: Product) {
  const min = Math.max(1, product.minQuantity ?? 1);
  const hardMax = 10000;
  const candidates = [product.maxQuantity, product.stock, hardMax].filter(
    (x): x is number => typeof x === "number" && x > 0
  );
  const max = candidates.length ? Math.min(...candidates) : hardMax;
  return { min, max };
}

/* Evita chars inválidos en <input type="number"> */
const preventInvalidChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
};

/* ===== Helpers de colores (map, normalizador y contraste) ===== */
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const normalizeKey = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const NAME_TO_HEX: Record<string, string> = {
  // básicos ES/EN
  negro: "#111827",
  black: "#111827",
  blanco: "#ffffff",
  white: "#ffffff",
  rojo: "#ef4444",
  red: "#ef4444",
  verde: "#10b981",
  green: "#10b981",
  azul: "#3b82f6",
  blue: "#3b82f6",
  amarillo: "#facc15",
  yellow: "#facc15",
  naranja: "#f97316",
  orange: "#f97316",
  morado: "#8b5cf6",
  violeta: "#8b5cf6",
  purple: "#8b5cf6",
  rosa: "#f472b6",
  pink: "#f472b6",
  gris: "#9ca3af",
  gray: "#9ca3af",
  plata: "#cbd5e1",
  plateado: "#cbd5e1",
  silver: "#cbd5e1",
  dorado: "#f59e0b",
  oro: "#f59e0b",
  gold: "#f59e0b",

  // comunes de catálogo
  "azul marino": "#0b1e3d",
  marino: "#0b1e3d",
  navy: "#0b1e3d",
  celeste: "#38bdf8",
  lila: "#a78bfa",
  marron: "#8B4513",
  marrón: "#8B4513",
  cafe: "#6F4E37",
  café: "#6F4E37",
  beige: "#f5f5dc",
  hueso: "#f7f7f0",
  crema: "#f7efe1",
  carmesi: "#dc2626",
  turquesa: "#14b8a6",
  lima: "#84cc16",
  plateado2: "#d1d5db",
};

function cssColor(label: string): string {
  if (!label) return "#e5e7eb";
  const raw = label.trim();
  if (HEX.test(raw)) return raw;
  return NAME_TO_HEX[normalizeKey(raw)] ?? raw; // si es css keyword válida, el navegador la toma
}

function hexToRgb(hex: string) {
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function isLightColor(input: string): boolean {
  const v = cssColor(input).toLowerCase();

  // atajos para claro
  if (
    [
      "white",
      "#fff",
      "#ffffff",
      "blanco",
      "beige",
      "ivory",
      "hueso",
      "crema",
    ].includes(v)
  ) {
    return true;
  }

  if (v.startsWith("#")) {
    const { r, g, b } = hexToRgb(v);
    const toLin = (x: number) => {
      const c = x / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const R = toLin(r),
      G = toLin(g),
      B = toLin(b);
    const L = 0.2126 * R + 0.7152 * G + 0.0722 * B; // luminancia
    return L > 0.72;
  }

  return false;
}
/* ============================================================= */

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { add } = useCart();
  const { show } = useToast();

  /* Límites (fallback si no hay producto) */
  const { min, max } = useMemo(() => {
    if (!product) return { min: 1, max: 10000 };
    return getQtyLimits(product);
  }, [product]);

  /* Cargar producto + defaults */
  useEffect(() => {
    const pid = Number(id);
    const found = Number.isFinite(pid)
      ? products.find((p) => p.id === pid)
      : undefined;

    if (found) {
      setProduct(found);
      if (found.colors?.length) setSelectedColor(found.colors[0]);
      if (found.sizes?.length) setSelectedSize(found.sizes[0]);
      setQuantity(getQtyLimits(found).min);
    } else {
      setProduct(null);
    }
  }, [id]);

  const onQtyInput = (val: string) => {
    const raw = parseInt(val, 10);
    const next = isNaN(raw) ? min : Math.max(min, Math.min(max, raw));
    setQuantity(next);
  };

  const canAddToCart =
    !!product &&
    product.status === "active" &&
    product.stock > 0 &&
    quantity <= product.stock;

  const handleAddToCart = () => {
    if (!product || !canAddToCart) {
      show("Producto no disponible", "error");
      return;
    }
    add(product, quantity, {
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    });
    show("Producto agregado al carrito", "success");
  };

  /* No encontrado */
  if (!product) {
    return (
      <div className="container">
        <div className="product-not-found">
          <span className="material-icons">error_outline</span>
          <h2 className="h2">Producto no encontrado</h2>
          <p className="p1">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <Link to="/" className="btn btn-primary cta1">
            <span className="material-icons">arrow_back</span>
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link l1">
            Catálogo
          </Link>
          <span className="breadcrumb-separator l1">/</span>
          <span className="breadcrumb-current l1">{product.name}</span>
        </nav>

        <div className="product-detail">
          {/* Imágenes */}
          <div className="product-images">
            <div className="main-image">
              <div className="image-placeholder">
                <span className="material-icons">image</span>
              </div>
            </div>
            <div className="image-thumbnails">
              {[1, 2, 3].map((i) => (
                <div key={i} className="thumbnail" role="button" tabIndex={0}>
                  <span className="material-icons">image</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="product-details">
            <div className="product-header">
              <h1 className="product-title h2">{product.name}</h1>
              <p className="product-sku p1">SKU: {product.sku}</p>

              <div className="product-status">
                {product.status === "active" ? (
                  <span className="status-badge status-active l1">
                    ✓ Disponible
                  </span>
                ) : product.status === "pending" ? (
                  <span className="status-badge status-pending l1">
                    ⏳ Pendiente
                  </span>
                ) : (
                  <span className="status-badge status-inactive l1">
                    ❌ No disponible
                  </span>
                )}
              </div>
            </div>

            {product.description && (
              <div className="product-description">
                <h3 className="p1-medium">Descripción</h3>
                <p className="p1">{product.description}</p>
              </div>
            )}

            {product.features?.length ? (
              <div className="product-features">
                <h3 className="p1-medium">Características</h3>
                <ul className="features-list">
                  {product.features.map((f, i) => (
                    <li key={i} className="feature-item l1">
                      <span className="material-icons">check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Colores */}
            {product.colors?.length ? (
              <div className="selection-group">
                <h3 className="selection-title p1-medium">
                  Colores disponibles
                </h3>
                <div className="color-options">
                  {product.colors.map((color) => {
                    const value = cssColor(color);
                    const light = isLightColor(color);
                    const selected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        className={`color-option ${selected ? "selected" : ""}`}
                        onClick={() => setSelectedColor(color)}
                        aria-pressed={selected}
                        title={color}
                      >
                        <div
                          className={`color-preview ${light ? "is-light" : ""}`}
                          style={{ background: value }}
                          aria-hidden
                        />
                        <span className="l1">{color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Tallas */}
            {product.sizes?.length ? (
              <div className="selection-group">
                <h3 className="selection-title p1-medium">
                  Tallas disponibles
                </h3>
                <div className="size-options">
                  {product.sizes.map((size) => {
                    const selected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        className={`size-option ${selected ? "selected" : ""}`}
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={selected}
                        title={`Talla ${size}`}
                      >
                        <span className="l1">{size}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Acciones */}
            <div className="product-actions">
              <div className="quantity-selector">
                <label className="quantity-label l1">Cantidad:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(min, quantity - 1))}
                    className="quantity-btn"
                    type="button"
                  >
                    <span className="material-icons">remove</span>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => onQtyInput(e.target.value)}
                    onKeyDown={preventInvalidChars}
                    onWheel={(e) =>
                      (e.currentTarget as HTMLInputElement).blur()
                    }
                    className="quantity-input"
                    min={min}
                    max={max}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(max, quantity + 1))}
                    className="quantity-btn"
                    type="button"
                  >
                    <span className="material-icons">add</span>
                  </button>
                </div>
                <small className="l1">
                  Mín: {min} • Máx: {Math.min(max, product.stock)}
                </small>
              </div>

              <div className="action-buttons">
                <button
                  className={`btn btn-primary cta1 ${
                    !canAddToCart ? "disabled" : ""
                  }`}
                  disabled={!canAddToCart}
                  onClick={handleAddToCart}
                  type="button"
                  title={
                    canAddToCart
                      ? "Agregar al carrito"
                      : "Producto no disponible"
                  }
                >
                  <span className="material-icons">shopping_cart</span>
                  {canAddToCart ? "Agregar al carrito" : "No disponible"}
                </button>

                <button
                  className="btn btn-secondary cta1"
                  onClick={() =>
                    document
                      .querySelector(".pricing-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  type="button"
                >
                  <span className="material-icons">calculate</span>
                  Solicitar cotización
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calculadora */}
        <div className="pricing-section">
          <PricingCalculator product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
