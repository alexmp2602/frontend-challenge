import { Link } from "react-router-dom";
import { Product, PriceBreak } from "../types/Product";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
}

// Currency formatter (CLP, no decimals)
const formatCLP = (n: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);

// Pick the best (lowest) unit price from price breaks
function getBestPriceBreak(priceBreaks?: PriceBreak[]) {
  if (!priceBreaks || priceBreaks.length === 0) return null;
  // choose the break with the **lowest** unit price
  const best = [...priceBreaks].sort((a, b) => a.price - b.price)[0];
  return best;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Status badge
  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="status-badge status-active l1">Disponible</span>
        );
      case "inactive":
        return (
          <span className="status-badge status-inactive l1">No disponible</span>
        );
      case "pending":
        // pending should NOT look like available
        return (
          <span className="status-badge status-pending l1">Pendiente</span>
        );
      default:
        return null;
    }
  };

  // Stock indicator
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <span className="stock-status out-of-stock l1">Sin stock</span>;
    } else if (stock < 10) {
      return (
        <span className="stock-status low-stock l1">Stock bajo ({stock})</span>
      );
    }
    return (
      <span className="stock-status in-stock l1">{stock} disponibles</span>
    );
  };

  const bestBreak = getBestPriceBreak(product.priceBreaks);
  const canQuote = product.status === "active" && product.stock > 0;

  return (
    <div className="product-card">
      <Link
        to={`/product/${product.id}`}
        className="product-link"
        aria-label={`Ver detalle de ${product.name}`}
      >
        {/* Product Image */}
        <div className="product-image">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="image-cover"
            />
          ) : (
            <div className="image-placeholder" aria-hidden="true">
              <span className="material-icons">image</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="product-status">{getStatusBadge(product.status)}</div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-header">
            <h3 className="product-name p1-medium">{product.name}</h3>
            <p className="product-sku l1">{product.sku}</p>
          </div>

          <div className="product-details">
            <div className="product-category">
              <span className="material-icons" aria-hidden="true">
                category
              </span>
              <span className="l1">{product.category}</span>
            </div>

            {getStockStatus(product.stock)}
          </div>

          {/* Features (limit to 4 chips) */}
          {product.features && product.features.length > 0 && (
            <div className="product-features">
              {product.features.slice(0, 4).map((feature, index) => (
                <span key={index} className="feature-tag l1">
                  {feature}
                </span>
              ))}
              {product.features.length > 4 && (
                <span className="feature-tag l1">
                  +{product.features.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Colors preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="product-colors">
              <span className="colors-label l1">
                {product.colors.length} colores:
              </span>
              <div className="colors-preview">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="color-dot"
                    title={color}
                    style={{ background: color }}
                    aria-label={`Color ${color}`}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="more-colors l1">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Footer */}
      <div className="product-footer">
        <div className="price-section">
          <div className="current-price p1-medium">
            {formatCLP(product.basePrice)}
          </div>

          {bestBreak && (
            <div className="discount-info">
              <span className="discount-price l1">
                {formatCLP(bestBreak.price)}
              </span>
              <span className="discount-label l1">
                desde {bestBreak.minQty} unidades
              </span>
            </div>
          )}
        </div>

        <div className="card-actions">
          <button
            className="btn btn-secondary l1"
            disabled={!canQuote}
            aria-disabled={!canQuote}
            onClick={(e) => {
              e.preventDefault();
              if (!canQuote) return;
              alert("Función de cotización por implementar");
            }}
          >
            <span className="material-icons">calculate</span>
            Cotizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
