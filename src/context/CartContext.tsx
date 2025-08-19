// src/context/CartContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CartItem, PriceBreak, Product } from "../types/Product";

type AddOptions = {
  color?: string;
  size?: string;
  overrideUnitPrice?: number; // opcional: forzar precio unitario
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
  update: (productId: number, quantity: number, options?: MatchOptions) => void;
  remove: (productId: number, options?: MatchOptions) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "swag_cart_v1";
const HARD_MAX = 10000;

const clampQty = (q: number, stock?: number) =>
  Math.max(1, Math.min(q, stock ?? HARD_MAX));

// Precio unitario óptimo según breaks
function bestUnitPrice(
  qty: number,
  basePrice: number,
  breaks?: PriceBreak[]
): number {
  if (!breaks || breaks.length === 0) return basePrice;
  const eligible = breaks.filter((b) => qty >= b.minQty);
  if (eligible.length === 0) return basePrice;
  return eligible.reduce((min, b) => Math.min(min, b.price), Infinity);
}

// Coincidencia consistente por producto + variante
function sameVariant(it: CartItem, id: number, opts?: MatchOptions) {
  if (it.id !== id) return false;
  if (opts?.color !== undefined && it.selectedColor !== opts.color)
    return false;
  if (opts?.size !== undefined && it.selectedSize !== opts.size) return false;
  return true;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add: CartContextValue["add"] = (product, quantity, options) => {
    // aplica clamp usando stock del producto
    const initialQty = clampQty(quantity, product.stock);
    if (initialQty <= 0) return;

    const computedUnit =
      options?.overrideUnitPrice ??
      bestUnitPrice(initialQty, product.basePrice, product.priceBreaks);

    setItems((prev) => {
      const idx = prev.findIndex((it) =>
        sameVariant(it, product.id, {
          color: options?.color,
          size: options?.size,
        })
      );

      if (idx >= 0) {
        const current = prev[idx];
        const nextQty = clampQty(current.quantity + initialQty, product.stock);
        const nextUnit =
          options?.overrideUnitPrice ??
          bestUnitPrice(nextQty, product.basePrice, product.priceBreaks);

        const updated: CartItem = {
          ...current,
          quantity: nextQty,
          unitPrice: nextUnit,
          totalPrice: nextQty * nextUnit,
        };
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
        // nota: si el clamp recorta, no pasamos del stock
      }

      const newItem: CartItem = {
        ...product,
        quantity: initialQty,
        selectedColor: options?.color,
        selectedSize: options?.size,
        unitPrice: computedUnit,
        totalPrice: computedUnit * initialQty,
      };
      return [...prev, newItem];
    });
  };

  // actualizar cantidad (si <=0, elimina)
  const update: CartContextValue["update"] = (productId, quantity, options) => {
    setItems((prev) => {
      const out: CartItem[] = [];
      for (const it of prev) {
        if (!sameVariant(it, productId, options)) {
          out.push(it);
          continue;
        }

        const clamped =
          it.stock && it.stock > 0
            ? Math.max(0, Math.min(quantity, it.stock))
            : Math.max(0, quantity);

        if (clamped <= 0) {
          // eliminar línea
          continue;
        }

        const nextUnit = bestUnitPrice(clamped, it.basePrice, it.priceBreaks);
        out.push({
          ...it,
          quantity: clamped,
          unitPrice: nextUnit,
          totalPrice: clamped * nextUnit,
        });
      }
      return out;
    });
  };

  const remove: CartContextValue["remove"] = (productId, options) => {
    setItems((prev) =>
      prev.filter((it) => !sameVariant(it, productId, options))
    );
  };

  const clear = () => setItems([]);

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
