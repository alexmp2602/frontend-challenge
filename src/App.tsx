import React, { Suspense, lazy, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";

/* === Code-splitting con preload “inteligente” === */
const preloadProductList = () => import("./pages/ProductList");
const ProductList = lazy(preloadProductList);

const preloadProductDetail = () => import("./pages/ProductDetail");
const ProductDetail = lazy(preloadProductDetail);

const preloadCartPage = () => import("./pages/CartPage");
const CartPage = lazy(preloadCartPage);

const preloadNotFound = () => import("./pages/NotFound");
const NotFound = lazy(preloadNotFound);

/* === ErrorBoundary simple para caídas de chunks === */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown, info: unknown) {
    // útil en desarrollo
    console.error("ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="container">
          <div className="error-boundary">
            <h2 className="h2">Ups, no pudimos cargar la vista.</h2>
            <p className="p1">Reintenta o recarga la página.</p>
            <button
              className="btn btn-primary cta1"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // En cada cambio de ruta: foco en <main> (a11y) y scroll-to-top ya lo maneja ScrollToTop
  useEffect(() => {
    mainRef.current?.focus();
  }, [location.pathname]);

  // Preload de rutas en idle si la red lo permite (mejora de performance percibida)
  useEffect(() => {
    const conn = (navigator as any)?.connection;
    const canPrefetch =
      !conn || (!conn.saveData && (conn.effectiveType || "").includes("4g"));
    const idle =
      (window as any).requestIdleCallback ||
      ((cb: () => void) => setTimeout(cb, 1200));
    if (canPrefetch) {
      idle(() => {
        preloadProductDetail();
        preloadCartPage();
        preloadNotFound();
      });
    }
  }, []);

  return (
    <div className="App">
      {/* Enlace “Saltar al contenido” (a11y) */}
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>

      <Header />
      <ScrollToTop />

      <main id="main" ref={mainRef} tabIndex={-1} role="main">
        <ErrorBoundary>
          <Suspense
            fallback={
              <div
                className="container p1 loading-fallback"
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                Cargando…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
