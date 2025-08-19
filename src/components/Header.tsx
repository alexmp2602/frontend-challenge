import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Header.css";

const Header = () => {
  const { count, subtotal } = useCart();

  // Formato CLP sin decimales
  const formatCLP = (n: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-icon">
              <span className="material-icons">store</span>
            </div>
            <span className="logo-text p1-medium">SWAG Challenge</span>
          </Link>

          {/* Navigation */}
          <nav className="nav">
            <Link to="/" className="nav-link l1">
              <span className="material-icons">home</span>
              Catálogo
            </Link>

            {/* Carrito (contador dinámico) */}
            <Link
              to="/cart"
              className="nav-link l1 cart-button"
              aria-label={`Carrito: ${count} ${count === 1 ? "item" : "items"}`}
              title={
                count > 0 ? `Subtotal: ${formatCLP(subtotal)}` : "Carrito vacío"
              }
            >
              <span className="material-icons">shopping_cart</span>
              <span>Carrito</span>
              {count > 0 ? (
                <span className="cart-badge" aria-live="polite">
                  {count}
                </span>
              ) : (
                <span className="cart-count l1">(0)</span>
              )}
            </Link>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            <button className="btn btn-secondary cta1">
              <span className="material-icons">person</span>
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
