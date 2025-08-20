import { memo, useCallback } from "react";
import { NavLink, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Header.css";

/** Formato CLP sin decimales */
const formatCLP = (n: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);

/** Prefetch suave de rutas (mejora de performance percibida) */
const prefetchCatalog = () => import("../pages/ProductList");
const prefetchCart = () => import("../pages/CartPage");

const Header = () => {
  const { count, subtotal } = useCart();

  const onHoverCatalog = useCallback(() => void prefetchCatalog(), []);
  const onHoverCart = useCallback(() => void prefetchCart(), []);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link
            to="/"
            className="logo"
            onMouseEnter={onHoverCatalog}
            onFocus={onHoverCatalog}
          >
            <div className="logo-icon" aria-hidden="true">
              <span className="material-icons" aria-hidden="true">
                store
              </span>
            </div>
            <span className="logo-text p1-medium">SWAG Challenge</span>
          </Link>

          {/* Navigation */}
          <nav className="nav" aria-label="Navegación principal">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link l1 ${isActive ? "active" : ""}`
              }
              onMouseEnter={onHoverCatalog}
              onFocus={onHoverCatalog}
              aria-current="page"
            >
              <span className="material-icons" aria-hidden="true">
                home
              </span>
              Catálogo
            </NavLink>

            {/* Carrito (contador dinámico, accesible) */}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `nav-link l1 cart-button ${isActive ? "active" : ""}`
              }
              onMouseEnter={onHoverCart}
              onFocus={onHoverCart}
              aria-label={`Carrito: ${count} ${count === 1 ? "item" : "items"}`}
              title={
                count > 0 ? `Subtotal: ${formatCLP(subtotal)}` : "Carrito vacío"
              }
            >
              <span className="material-icons" aria-hidden="true">
                shopping_cart
              </span>
              <span>Carrito</span>
              {count > 0 ? (
                // aria-live para lectores de pantalla cuando cambia la cantidad
                <span
                  className="cart-badge"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {/* cap a 99+ para evitar overflow en mobile */}
                  {count > 99 ? "99+" : count}
                </span>
              ) : (
                <span className="cart-count l1">(0)</span>
              )}
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            <button className="btn btn-secondary cta1">
              <span className="material-icons" aria-hidden="true">
                person
              </span>
              <span>Iniciar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
