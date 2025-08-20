// src/context/CartContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CartItem, PriceBreak, Product } from "../types/Product";

type AddOptions = {
  color?: string;
  size?: string;
  overrideUnitPrice?: number; // forzar precio unitario
};

type MatchOptions = {
  color?: string;
  size?: string;
};

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product, quantity: number, options?: AddOptions) => void;
  update: (productId: number, quantity: number, options: MatchOptions) => void;
  remove: (productId: number, options: MatchOptions) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "swag_cart_v1";
const STORAGE_VERSION = 1;
const HARD_MAX = 10000;
const SAVE_DEBOUNCE_MS = 120;

/* Utils */
const clampQty = (q: number, stock?: number, min = 1) =>
  Math.max(min, Math.min(q, stock ?? HARD_MAX));

const variantKey = (id: number, color?: string, size?: string) =>
  `${id}|${color ?? ""}|${size ?? ""}`;

function bestUnitPrice(qty: number, basePrice: number, breaks?: PriceBreak[]) {
  if (!breaks?.length) return basePrice;
  let min = basePrice;
  for (const b of breaks) if (qty >= b.minQty) min = Math.min(min, b.price);
  return min;
}

function isValidItem(x: any): x is CartItem {
  return (
    x &&
    typeof x.id === "number" &&
    typeof x.basePrice === "number" &&
    typeof x.quantity === "number" &&
    (typeof x.unitPrice === "number" || x.unitPrice === undefined)
  );
}

/* Carga con migración (array antiguo → {v, items}) + saneo */
function loadInitial(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const items: unknown[] = Array.isArray(parsed)
      ? parsed // legacy
      : Array.isArray(parsed?.items)
      ? parsed.items
      : [];
    return items.filter(isValidItem).map((it) => ({
      ...it,
      unitPrice:
        typeof it.unitPrice === "number"
          ? it.unitPrice
          : bestUnitPrice(it.quantity, it.basePrice, it.priceBreaks),
      totalPrice:
        typeof it.totalPrice === "number"
          ? it.totalPrice
          : (typeof it.unitPrice === "number"
              ? it.unitPrice
              : bestUnitPrice(it.quantity, it.basePrice, it.priceBreaks)) *
            it.quantity,
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitial);
  const saveTimer = useRef<number | undefined>(undefined);

  /* Persistencia debounced */
  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        const payload = { v: STORAGE_VERSION, items };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // ignore
      }
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [items]);

  /* Sync entre pestañas */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        const next = Array.isArray(parsed?.items) ? parsed.items : [];
        if (JSON.stringify(next) !== JSON.stringify(items)) {
          setItems(loadInitial()); // rehidrata con saneo
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [items]);

  /* Add respetando minQuantity y stock */
  const add: CartContextValue["add"] = (product, quantity, options) => {
    const minQ = Math.max(1, product.minQuantity ?? 1);
    const q0 = clampQty(quantity, product.stock, minQ);
    if (q0 <= 0) return;

    const key = variantKey(product.id, options?.color, options?.size);
    setItems((prev) => {
      const idx = prev.findIndex(
        (it) => variantKey(it.id, it.selectedColor, it.selectedSize) === key
      );

      if (idx >= 0) {
        const current = prev[idx];
        const nextQty = clampQty(current.quantity + q0, product.stock, 1);
        const unit =
          options?.overrideUnitPrice ??
          bestUnitPrice(nextQty, product.basePrice, product.priceBreaks);
        const updated: CartItem = {
          ...current,
          quantity: nextQty,
          unitPrice: unit,
          totalPrice: unit * nextQty,
        };
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }

      const unit =
        options?.overrideUnitPrice ??
        bestUnitPrice(q0, product.basePrice, product.priceBreaks);
      const newItem: CartItem = {
        ...product,
        quantity: q0,
        selectedColor: options?.color,
        selectedSize: options?.size,
        unitPrice: unit,
        totalPrice: unit * q0,
      };
      return [...prev, newItem];
    });
  };

  /* Update por variante exacta (si quantity<=0, elimina) */
  const update: CartContextValue["update"] = (productId, quantity, options) => {
    const key = variantKey(productId, options.color, options.size);
    setItems((prev) => {
      const out: CartItem[] = [];
      for (const it of prev) {
        const same =
          variantKey(it.id, it.selectedColor, it.selectedSize) === key;
        if (!same) {
          out.push(it);
          continue;
        }
        const clamped =
          it.stock && it.stock > 0
            ? Math.max(0, Math.min(quantity, it.stock))
            : Math.max(0, quantity);

        if (clamped <= 0) continue; // elimina línea

        const unit = bestUnitPrice(clamped, it.basePrice, it.priceBreaks);
        out.push({
          ...it,
          quantity: clamped,
          unitPrice: unit,
          totalPrice: unit * clamped,
        });
      }
      return out;
    });
  };

  /* Remove por variante exacta */
  const remove: CartContextValue["remove"] = (productId, options) => {
    const key = variantKey(productId, options.color, options.size);
    setItems((prev) =>
      prev.filter(
        (it) => variantKey(it.id, it.selectedColor, it.selectedSize) !== key
      )
    );
  };

  const clear = () => setItems([]);

  /* Derivados */
  const count = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.totalPrice, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    add,
    update,
    remove,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
