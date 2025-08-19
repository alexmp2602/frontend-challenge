import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartPage.css";

// Formato CLP sin decimales
const formatCLP = (n: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);

// Sanitiza cantidad (>=1 y <= stock/máximo razonable)
const clampQty = (val: number, stock?: number) => {
  const HARD_MAX = 10000;
  const max = Math.min(stock ?? HARD_MAX, HARD_MAX);
  return Math.max(1, Math.min(max, isNaN(val) ? 1 : val));
};

// Evita caracteres no válidos en <input type="number">
const preventInvalidChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
};

const CartPage = () => {
  const { items, subtotal, update, remove, clear } = useCart();
  const totalItems = items.reduce((acc, it) => acc + it.quantity, 0);
  const isEmpty = items.length === 0;

  // Exportar JSON del carrito completo
  const exportCartJSON = () => {
    const payload = {
      cartId: `cart-${Date.now()}`,
      createdAt: new Date().toISOString(),
      currency: "CLP",
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        sku: it.sku,
        supplier: it.supplier,
        quantity: it.quantity,
        unitPrice: it.unitPrice ?? it.basePrice,
        lineTotal: (it.unitPrice ?? it.basePrice) * it.quantity,
        color: it.selectedColor ?? null,
        size: it.selectedSize ?? null,
      })),
      totals: {
        items: totalItems,
        subtotal,
      },
      note: "Pre-cotización generada desde SWAG Challenge (frontend).",
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carrito-${payload.cartId}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Vista imprimible (para PDF del navegador)
  const printCart = () => {
    const win = window.open("", "_blank", "width=900,height=1100");
    if (!win) {
      alert(
        "No se pudo abrir la ventana de impresión. Habilita pop-ups e inténtalo otra vez."
      );
      return;
    }

    const rows = items
      .map(
        (it) => `
      <tr>
        <td>${it.name} <span class="muted">(${it.sku})</span>
            ${
              it.selectedColor
                ? ` · <span class="muted">Color: ${it.selectedColor}</span>`
                : ""
            }
            ${
              it.selectedSize
                ? ` · <span class="muted">Talle: ${it.selectedSize}</span>`
                : ""
            }
        </td>
        <td class="num">${it.quantity}</td>
        <td class="num">${formatCLP(it.unitPrice ?? it.basePrice)}</td>
        <td class="num">${formatCLP(
          (it.unitPrice ?? it.basePrice) * it.quantity
        )}</td>
      </tr>`
      )
      .join("");

    win.document.write(`<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<title>Carrito - Pre-cotización</title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  :root { color-scheme: light; }
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Helvetica, Arial; padding: 24px; color: #111827; }
  h1 { margin: 0 0 6px; font-size: 20px; }
  .muted { color: #6b7280; }
  .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 12px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: left; }
  th.num, td.num { text-align: right; }
  .summary { display: flex; justify-content: flex-end; gap: 24px; margin-top: 12px; }
  .total { font-weight: 700; font-size: 18px; }
  .small { font-size: 12px; color: #6b7280; }
</style>
</head>
<body>
  <h1>SWAG Chile – Pre-cotización del carrito</h1>
  <div class="small muted">${new Date().toLocaleString("es-CL")}</div>

  <div class="card">
    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th class="num">Cantidad</th>
          <th class="num">Precio unitario</th>
          <th class="num">Total línea</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <div class="summary">
      <div><strong>Items:</strong> ${totalItems}</div>
      <div class="total">Subtotal: ${formatCLP(subtotal)}</div>
    </div>
    <div class="small">Moneda: CLP. Los precios no incluyen envío ni impuestos.</div>
  </div>

  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 200));</script>
</body>
</html>`);
    win.document.close();
  };

  if (isEmpty) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <span className="material-icons">shopping_cart</span>
            <h2 className="h2">Tu carrito está vacío</h2>
            <p className="p1">
              Agregá productos desde el catálogo para verlos acá.
            </p>
            <Link to="/" className="btn btn-primary cta1">
              Ver catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-layout">
          {/* Lista de items */}
          <div className="cart-card">
            <h2 className="p1-medium">Carrito ({totalItems} items)</h2>
            <div className="cart-list">
              {items.map((it) => (
                <div
                  key={`${it.id}-${it.selectedColor ?? ""}-${
                    it.selectedSize ?? ""
                  }`}
                  className="cart-item"
                >
                  <div className="thumb">
                    <div className="thumb-placeholder">
                      <span className="material-icons">image</span>
                    </div>
                  </div>

                  <div className="item-main">
                    <div className="item-title">
                      <div className="p1-medium">{it.name}</div>
                      <div className="l1 muted">{it.sku}</div>
                      {(it.selectedColor || it.selectedSize) && (
                        <div className="l1 muted">
                          {it.selectedColor ? (
                            <> · Color: {it.selectedColor}</>
                          ) : null}
                          {it.selectedSize ? (
                            <> · Talle: {it.selectedSize}</>
                          ) : null}
                        </div>
                      )}
                    </div>

                    <div className="item-meta">
                      <div className="price">
                        {formatCLP(it.unitPrice ?? it.basePrice)}
                        <span className="l1 muted"> / unidad</span>
                      </div>

                      <div className="qty">
                        <label htmlFor={`qty-${it.id}`} className="l1">
                          Cant.
                        </label>
                        <input
                          id={`qty-${it.id}`}
                          type="number"
                          className="qty-input p1"
                          value={it.quantity}
                          min={1}
                          max={it.stock || 10000}
                          step={1}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onWheel={(e) =>
                            (e.currentTarget as HTMLInputElement).blur()
                          }
                          onKeyDown={preventInvalidChars}
                          onChange={(e) => {
                            const next = clampQty(
                              parseInt(e.target.value, 10),
                              it.stock
                            );
                            // 🔴 PASAMOS color/talle para identificar la variante correcta
                            update(it.id, next, {
                              color: it.selectedColor,
                              size: it.selectedSize,
                            });
                          }}
                        />
                      </div>

                      <div className="line-total h3">
                        {formatCLP(
                          (it.unitPrice ?? it.basePrice) * it.quantity
                        )}
                      </div>

                      <button
                        className="icon-btn"
                        aria-label="Quitar del carrito"
                        title="Quitar"
                        onClick={() =>
                          remove(it.id, {
                            color: it.selectedColor,
                            size: it.selectedSize,
                          })
                        }
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-actions">
              <Link to="/" className="btn btn-outline cta1">
                <span className="material-icons">arrow_back</span>
                Seguir comprando
              </Link>
              <button className="btn btn-danger cta1" onClick={clear}>
                <span className="material-icons">delete_sweep</span>
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* Resumen */}
          <aside className="cart-summary">
            <div className="summary-card">
              <h3 className="p1-medium">Resumen</h3>
              <div className="summary-row">
                <span className="p1">Items</span>
                <span className="p1-medium">{totalItems}</span>
              </div>
              <div className="summary-row total">
                <span className="p1-medium">Subtotal</span>
                <span className="h3">{formatCLP(subtotal)}</span>
              </div>
              <div className="summary-actions">
                <button
                  className="btn btn-outline cta1"
                  onClick={exportCartJSON}
                >
                  <span className="material-icons">download</span>
                  Exportar JSON
                </button>
                <button className="btn btn-primary cta1" onClick={printCart}>
                  <span className="material-icons">picture_as_pdf</span>
                  Imprimir / PDF
                </button>
              </div>
            </div>

            <div className="summary-note l1">
              * Los precios no incluyen envío ni impuestos. La exportación JSON
              es una pre-cotización.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
