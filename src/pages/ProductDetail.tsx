import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import { Product } from "../types/Product";
import PricingCalculator from "../components/PricingCalculator";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext"; // ✅ NEW
import "./ProductDetail.css";

/** Límites seguros para la cantidad */
function getQtyLimits(product: Product) {
  const min = Math.max(1, product.minQuantity ?? 1);
  const hardMax = 10000;
  const candidates = [product.maxQuantity, product.stock, hardMax].filter(
    (x): x is number => typeof x === "number" && x > 0
  );
  const max = candidates.length ? Math.min(...candidates) : hardMax;
  return { min, max };
}

const preventInvalidChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { add } = useCart();
  const { show } = useToast(); // ✅ NEW

  // Hook SIEMPRE llamado (con fallback cuando product es null)
  const { min, max } = useMemo(() => {
    if (!product) return { min: 1, max: 10000 };
    return getQtyLimits(product);
  }, [product]);

  // Cargar producto y defaults
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

    show("Producto agregado al carrito", "success"); // ✅ toast en lugar de alert
  };

  // UI de no encontrado
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
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${
                        selectedColor === color ? "selected" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                      type="button"
                    >
                      <div className="color-preview" />
                      <span className="l1">{color}</span>
                    </button>
                  ))}
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
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-option ${
                        selectedSize === size ? "selected" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                      type="button"
                    >
                      <span className="l1">{size}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Acciones rápidas */}
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
