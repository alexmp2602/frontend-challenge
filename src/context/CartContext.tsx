import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
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
  update: (productId: number, quantity: number, options?: MatchOptions) => void; // NEW
  remove: (productId: number, options?: MatchOptions) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "swag_cart_v1";

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
    if (quantity <= 0) return;

    const unit =
      options?.overrideUnitPrice ??
      bestUnitPrice(quantity, product.basePrice, product.priceBreaks);

    setItems((prev) => {
      const idx = prev.findIndex(
        (it) =>
          it.id === product.id &&
          it.selectedColor === (options?.color ?? undefined) &&
          it.selectedSize === (options?.size ?? undefined)
      );

      if (idx >= 0) {
        const nextQty = prev[idx].quantity + quantity;
        const nextUnit = options?.overrideUnitPrice
          ? unit
          : bestUnitPrice(nextQty, product.basePrice, product.priceBreaks);
        const updated: CartItem = {
          ...prev[idx],
          quantity: nextQty,
          unitPrice: nextUnit,
          totalPrice: nextQty * nextUnit,
        };
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }

      const newItem: CartItem = {
        ...product,
        quantity,
        selectedColor: options?.color,
        selectedSize: options?.size,
        unitPrice: unit,
        totalPrice: unit * quantity,
      };
      return [...prev, newItem];
    });
  };

  // NEW: actualizar cantidad (si <=0, elimina)
  const update: CartContextValue["update"] = (productId, quantity, options) => {
    setItems((prev) => {
      const out: CartItem[] = [];
      for (const it of prev) {
        const isMatch =
          it.id === productId &&
          (options?.color ?? it.selectedColor) === it.selectedColor &&
          (options?.size ?? it.selectedSize) === it.selectedSize;

        if (!isMatch) {
          out.push(it);
          continue;
        }

        const clamped =
          it.stock && it.stock > 0
            ? Math.max(0, Math.min(quantity, it.stock))
            : Math.max(0, quantity);

        if (clamped <= 0) {
          // eliminar
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
      prev.filter(
        (it) =>
          !(
            it.id === productId &&
            (options?.color ?? it.selectedColor) === it.selectedColor &&
            (options?.size ?? it.selectedSize) === it.selectedSize
          )
      )
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
    update, // NEW
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
