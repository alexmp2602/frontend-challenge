# SWAG Frontend Challenge – Solución

Catálogo de productos con React + TypeScript, carrito con variantes, filtros avanzados y simulador de cotización. Enfocado en UX, accesibilidad y performance.

## 🔗 Links
- Repo: https://github.com/alexmp2602/frontend-challenge
- Demo: https://frontend-challenge-swag.vercel.app/

## ⚡️ Quick Start
```bash
# 1) Clonar e instalar
git clone https://github.com/alexmp2602/frontend-challenge
cd frontend-challenge
npm install

# 2) Desarrollo
npm run dev

# 3) Producción
npm run build
npm run preview
```
---

## ✅ Qué entrego

### 1. Bugs corregidos
- **Búsqueda case-insensitive** y ampliada a `name/sku/supplier/category`.
- **Ordenamiento** por nombre, precio y stock.
- **Estados de producto**: `active/pending/inactive` con badges correctos (el “pending” ya no parece “disponible”).
- **Formatos CLP** con `Intl.NumberFormat("es-CL")`.
- **Cantidad máxima/mínima** validada y “sanitizada” (clamp + bloqueo de `e/E/+/-/.` en inputs numéricos).
- **Price breaks**: cálculo del **mejor** precio unitario elegible (`bestUnitPrice`) y selección directa desde la UI.

> Nota: issues de **datos** (stock/cantidad de productos) se dejan como dataset de ejemplo; la app es resiliente si cambian.

### 2. Funcionalidades implementadas
- **Carrito de compras**
  - Agregar productos (con variantes color/talle)
  - **Contador** en el header + **subtotal** en tooltip
  - **Persistencia** en `localStorage` (con versión + migración + debounce + sync entre pestañas)
- **Filtros avanzados**
  - **Proveedor** (checkbox múltiple)
  - **Rango de precios** (min/max numéricos sanitizados)
  - **Limpiar todo** (estado deshabilitado si no hay filtros activos)
- **Simulador de cotización**
  - Form con empresa/nombre/email/notas (validación de email)
  - Cálculo con **descuentos por volumen**
  - **Exportar JSON** y **vista imprimible** (para PDF del navegador)
- **Mejoras de UX**
  - **Skeleton** en grillas durante recomputación
  - Transiciones sutiles + `prefers-reduced-motion`
  - **Toasts** de feedback (info/success/warning/error)

### 3. Creatividad y mejoras
- **Performance**
  - **Lazy loading** de rutas con `Suspense`
  - `useMemo`/función pura para compute de filtros/orden
  - Persistencia **debounced** y **sync multi-pestaña** (`storage` event)
- **Accesibilidad**
  - Foco visible y consistente, `aria-label/aria-live`, `aria-pressed`
  - Labels ocultos “visually-hidden” para inputs
  - Inputs numéricos sin caracteres inválidos, `onWheel` blur
  - Skip-link y estados deshabilitados accesibles
- **Mobile**
  - Layouts responsivos (grid adaptable, summary sticky en desktop)
  - Botoneras en columna, touch targets cómodos
- **Detalles extra**
  - **Color chips reales**: mapeo ES/EN/HEX y **detección de colores claros** para bordes visibles (p. ej. blanco)
  - **Export/Print** en carrito y cotización con plantillas listas para PDF
  - Componentes con comentarios concisos y consistentes

---

## 🧱 Arquitectura (resumen)
- **Estado global del carrito**: `CartContext`  
  - `add/update/remove/clear`, `count`, `subtotal`
  - `variantKey(id|color|size)` para actualizar exactamente la variante
  - `bestUnitPrice(qty, basePrice, breaks)` para price breaks
  - Persistencia `{ v: 1, items }` + migración del formato antiguo
- **Toasts**: `ToastContext` (sin dependencia externa)
- **Ruteo**: `react-router-dom`, **lazy** (`ProductList`, `ProductDetail`, `CartPage`, `NotFound`)
- **UI**
  - `ProductList` + `ProductFilters` + `ProductCard`
  - `ProductDetail` + `PricingCalculator`
  - `CartPage` con export/print

---

## 🧪 Cómo probar rápido

1) **Búsqueda y filtros**
- Buscar por nombre, SKU, proveedor o categoría.
- Activar proveedores; ajustar precios min/max.
- Usar “Limpiar filtros” (queda desactivado si no hay filtros activos).

2) **Price breaks**
- En producto: subir cantidad hasta cruzar los umbrales → baja el **precio unitario** y aparece **descuento**.
- Clickear un break aplica su cantidad mínima.

3) **Carrito**
- Agregar productos (con color/talle si aplica).
- Cambiar cantidades en el carrito; se recalcula unitario si cambia el break.
- Exportar **JSON** o **Imprimir/PDF**.

4) **Cotización**
- Completar empresa/nombre/email; exportar **JSON** o **Imprimir/PDF**.
- Email inválido muestra validación.

5) **Accesibilidad/UX**
- Navegar sólo con teclado (foco visible y orden)
- `prefers-reduced-motion`: animaciones minimizadas
- Mobile: cards en 1 columna, botones full-width

---

## 🗂️ Estructura relevante
```
src/
  components/
    Header.tsx
    PricingCalculator.tsx
    ProductCard.tsx
    ProductFilters.tsx
    ScrollToTop.tsx
  context/
    CartContext.tsx
    ToastContext.tsx
  pages/
    ProductList.tsx
    ProductDetail.tsx
    CartPage.tsx
    NotFound.tsx
  utils/
    colors.ts // mapeo ES/EN + hex + detección "isLightColor"
  data/
    products.ts
```

---

## 📝 Convenciones y DX
- TypeScript estricto en componentes clave
- Comentarios **breves** y normalizados
- Estilos en CSS modular por vista/componente
- Commits sugeridos:  
  - `feat(cart): variant-safe updates + debounced persistence`  
  - `feat(filters): supplier & price range + clear state`  
  - `feat(quote): export json & print template`  
  - `fix(pricing): bestUnitPrice + input guards`  
  - `ux(a11y): focus-visible, aria-* and reduced motion`  
  - `perf(app): route-level code splitting + memoized compute`  

---

## 🚧 Limitaciones / Next
- Filtros no persisten en URL (se podría agregar `searchParams`).
- Sin paginación/virtualización para catálogos masivos (posible mejora).
- Dataset de productos es mock: validado para UX, no para exhaustividad.

---

## 👤 Autor
**Alex Pereyra**  
- LinkedIn: https://linkedin.com/in/alex-pereyra-dev  
- Portafolio: https://www.alexpereyra.dev
