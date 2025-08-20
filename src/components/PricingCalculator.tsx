import { useMemo, useState } from "react";
import { Product, PriceBreak } from "../types/Product";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "./PricingCalculator.css";

interface PricingCalculatorProps {
  product: Product;
}

// CLP (sin decimales)
const formatCLP = (n: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);

/** Menor precio unitario elegible según cantidad */
function bestUnitPrice(qty: number, basePrice: number, breaks?: PriceBreak[]) {
  if (!breaks || breaks.length === 0) return basePrice;
  const eligible = breaks.filter((b) => qty >= b.minQty);
  if (eligible.length === 0) return basePrice;
  return eligible.reduce((min, b) => Math.min(min, b.price), Infinity);
}

/** Break aplicable (mayor minQty <= qty) */
function applicableBreak(qty: number, breaks?: PriceBreak[]) {
  if (!breaks || breaks.length === 0) return null;
  return (
    [...breaks]
      .filter((b) => qty >= b.minQty)
      .sort((a, b) => b.minQty - a.minQty)[0] ?? null
  );
}

/** Límites de cantidad */
function getQtyLimits(product: Product) {
  const min = Math.max(1, product.minQuantity ?? 1);
  const HARD_MAX = 10000;
  const candidates = [product.maxQuantity, product.stock, HARD_MAX].filter(
    (x): x is number => typeof x === "number" && x > 0
  );
  const max = candidates.length ? Math.min(...candidates) : HARD_MAX;
  return { min, max };
}

const emailRegex = /^\S+@\S+\.\S+$/;

const PricingCalculator = ({ product }: PricingCalculatorProps) => {
  const { min, max } = getQtyLimits(product);
  const [quantity, setQuantity] = useState<number>(min);
  const { add } = useCart();
  const toast = useToast();

  // Form cotización
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    notes: "",
  });

  // Derivados
  const unitPrice = useMemo(
    () => bestUnitPrice(quantity, product.basePrice, product.priceBreaks),
    [quantity, product.basePrice, product.priceBreaks]
  );
  const currentTotal = useMemo(
    () => unitPrice * quantity,
    [unitPrice, quantity]
  );

  const baseTotal = product.basePrice * quantity;
  const discountPercent =
    baseTotal > 0 ? ((baseTotal - currentTotal) / baseTotal) * 100 : 0;

  const activeBreak = applicableBreak(quantity, product.priceBreaks);

  const onQtyChange = (val: string) => {
    const raw = parseInt(val, 10);
    if (isNaN(raw)) {
      setQuantity(min);
      return;
    }
    let next = raw;
    if (raw < min) {
      next = min;
      toast?.warning?.(`Cantidad mínima: ${min}`);
    } else if (raw > max) {
      next = max;
      const reason =
        product.stock && product.stock < (product.maxQuantity ?? Infinity)
          ? `stock disponible: ${product.stock}`
          : `máximo permitido: ${max}`;
      toast?.warning?.(`Se ajustó la cantidad al ${reason}`);
    }
    setQuantity(next);
  };

  // Habilitaciones
  const canAdd =
    product.status === "active" &&
    product.stock > 0 &&
    quantity >= min &&
    quantity <= max &&
    quantity <= product.stock;

  const emailOk = emailRegex.test(form.email);
  const canExport =
    form.company.trim() !== "" &&
    form.name.trim() !== "" &&
    emailOk &&
    quantity >= min &&
    quantity <= max;

  // Export JSON
  const exportJSON = () => {
    const payload = {
      quoteId: `${product.sku}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customer: {
        company: form.company.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        notes: form.notes.trim(),
      },
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        supplier: product.supplier,
      },
      pricing: {
        quantity,
        unitPrice,
        total: currentTotal,
        currency: "CLP",
        priceBreakApplied: activeBreak?.minQty ?? null,
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cotizacion-${product.sku}-${quantity}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    toast?.success?.("Resumen de cotización exportado (JSON).");
  };

  // Imprimir / PDF
  const printQuote = () => {
    const unitCLP = formatCLP(unitPrice);
    const totalCLP = formatCLP(currentTotal);

    const discountRow =
      discountPercent > 0
        ? `<div class="row"><span>Descuento</span><strong>-${discountPercent.toFixed(
            1
          )}%</strong></div>`
        : "";

    const win = window.open("", "_blank", "width=820,height=980");
    if (!win) {
      toast?.error?.(
        "No se pudo abrir la ventana de impresión. Habilitá pop-ups e intentá de nuevo."
      );
      return;
    }

    win.document.write(`<!doctype html>
<html lang="es">
<head>…</head>
<body>
  …
  <div class="card">
    <h2>Producto</h2>
    <div>${product.name} <span class="small">(${product.sku})</span></div>
    <div class="row"><span>Cantidad</span><strong>${quantity} u.</strong></div>
    <div class="row"><span>Precio unitario</span><strong>${unitCLP}</strong></div>
    ${discountRow}
    <div class="row total"><span>Total</span><span>${totalCLP}</span></div>
    <div class="small muted">Moneda: CLP. Los precios no incluyen envío ni impuestos.</div>
  </div>
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 200));</script>
</body>
</html>`);
    win.document.close();
    toast?.info?.("Abriendo vista de impresión…");
  };

  return (
    <div className="pricing-calculator">
      <div className="calculator-header">
        <h3 className="calculator-title p1-medium">Calculadora de Precios</h3>
        <p className="calculator-subtitle l1">
          Calcula el precio según la cantidad que necesitas
        </p>
      </div>

      <div className="calculator-content">
        {/* Cantidad */}
        <div className="quantity-section">
          <label htmlFor="qty" className="quantity-label p1-medium">
            Cantidad
          </label>
          <div className="quantity-input-group">
            <input
              id="qty"
              type="number"
              value={quantity}
              onChange={(e) => onQtyChange(e.target.value)}
              className="quantity-input p1"
              min={min}
              max={max}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <span className="quantity-unit l1">unidades</span>
          </div>
          <small className="l1">
            Entre {min} y {max} unidades
          </small>
        </div>

        {/* Price Breaks */}
        {product.priceBreaks && product.priceBreaks.length > 0 && (
          <div className="price-breaks-section">
            <h4 className="breaks-title p1-medium">Descuentos por volumen</h4>
            <div className="price-breaks">
              {[...product.priceBreaks]
                .sort((a, b) => a.minQty - b.minQty)
                .map((pb, index) => {
                  const isActive = quantity >= pb.minQty;
                  const isSelected = activeBreak?.minQty === pb.minQty;
                  return (
                    <button
                      type="button"
                      key={index}
                      className={`price-break ${isActive ? "active" : ""} ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() => {
                        const next = Math.max(min, Math.min(max, pb.minQty));
                        setQuantity(next);
                        toast?.info?.(
                          `Aplicado precio por volumen desde ${pb.minQty}+`
                        );
                      }}
                      aria-pressed={isSelected}
                    >
                      <div className="break-quantity l1">
                        {pb.minQty}+ unidades
                      </div>
                      <div className="break-price p1-medium">
                        {formatCLP(pb.price)}
                      </div>
                      {typeof pb.discount === "number" && (
                        <div className="break-discount l1">-{pb.discount}%</div>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* Resumen */}
        <div className="price-summary">
          <div className="summary-row">
            <span className="summary-label p1">Precio unitario:</span>
            <span className="summary-value p1-medium">
              {formatCLP(unitPrice)}
            </span>
          </div>

          <div className="summary-row">
            <span className="summary-label p1">Cantidad:</span>
            <span className="summary-value p1-medium">{quantity} unidades</span>
          </div>

          {discountPercent > 0 && (
            <div className="summary-row discount-row">
              <span className="summary-label p1">Descuento:</span>
              <span className="summary-value discount-value p1-medium">
                -{discountPercent.toFixed(1)}%
              </span>
            </div>
          )}

          <div className="summary-row total-row">
            <span className="summary-label p1-medium">Total:</span>
            <span className="summary-value total-value h2">
              {formatCLP(currentTotal)}
            </span>
          </div>
        </div>

        {/* Form cotización */}
        <div className="quote-form">
          <h4 className="p1-medium">Datos para la cotización</h4>
          <div className="quote-grid">
            <input
              className="p1"
              placeholder="Empresa"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
            <input
              className="p1"
              placeholder="Nombre y apellido"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="p1"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              aria-invalid={!!form.email && !emailOk}
              required
            />
            <input
              className="p1"
              placeholder="Notas (opcional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          {!emailOk && form.email && (
            <small className="l1" style={{ color: "#ef4444" }}>
              Email inválido
            </small>
          )}

          <div className="quote-actions">
            <button
              className="btn btn-outline cta1"
              disabled={!canExport}
              onClick={exportJSON}
            >
              <span className="material-icons">download</span>
              Exportar resumen (.json)
            </button>

            <button
              className="btn btn-outline cta1"
              disabled={!canExport}
              onClick={printQuote}
            >
              <span className="material-icons">picture_as_pdf</span>
              Imprimir / PDF
            </button>
          </div>
        </div>

        {/* Acciones */}
        <div className="calculator-actions">
          <button
            className="btn btn-secondary cta1"
            onClick={() => {
              toast?.info?.(
                `Solicitud enviada por ${quantity} u. de ${product.name}`
              );
            }}
          >
            <span className="material-icons">email</span>
            Solicitar cotización oficial
          </button>

          <button
            className="btn btn-primary cta1"
            disabled={!canAdd}
            title={
              canAdd
                ? "Agregar al carrito"
                : "Producto sin stock o no disponible"
            }
            onClick={() => {
              add(product, quantity);
              toast?.success?.(
                `Agregado: ${quantity} × ${product.name} al carrito`
              );
            }}
          >
            <span className="material-icons">shopping_cart</span>
            Agregar al carrito
          </button>
        </div>

        {/* Info extra */}
        <div className="additional-info">
          <div className="info-item">
            <span className="material-icons">local_shipping</span>
            <div className="info-content">
              <span className="info-title l1">Envío gratis</span>
              <span className="info-detail l1">
                En pedidos sobre {formatCLP(50000)}
              </span>
            </div>
          </div>

          <div className="info-item">
            <span className="material-icons">schedule</span>
            <div className="info-content">
              <span className="info-title l1">Tiempo de producción</span>
              <span className="info-detail l1">7-10 días hábiles</span>
            </div>
          </div>

          <div className="info-item">
            <span className="material-icons">verified</span>
            <div className="info-content">
              <span className="info-title l1">Garantía</span>
              <span className="info-detail l1">30 días de garantía</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
