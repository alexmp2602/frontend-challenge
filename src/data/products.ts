import { Product, Category, Supplier } from "../types/Product";

/**
 * Product catalog data (20 items)
 * NOTE: Keep this array as the single source of truth.
 */
export const products: Product[] = [
  {
    id: 1,
    name: "Audífonos COPPER Bluetooth",
    sku: "AUD-COPPER-001",
    category: "tech",
    supplier: "smart-gifts",
    status: "active",
    basePrice: 8500,
    stock: 250,
    description:
      "Audífonos inalámbricos con tecnología Bluetooth 5.0, batería de larga duración y calidad premium.",
    colors: ["Negro", "Blanco"],
    features: ["Bluetooth 5.0", "Batería 20h", "Cancelación ruido"],
    priceBreaks: [
      { minQty: 1, price: 8500 },
      { minQty: 10, price: 7500, discount: 12 },
      { minQty: 50, price: 6800, discount: 20 },
    ],
  },
  {
    id: 2,
    name: "Taza Térmica Smart 350ml",
    sku: "TZA-SMART-350",
    category: "home",
    supplier: "top-gifts",
    status: "active",
    basePrice: 4200,
    stock: 180,
    description:
      "Taza térmica inteligente que mantiene la temperatura perfecta por horas.",
    colors: ["Rojo", "Azul", "Negro", "Blanco", "Verde"],
    features: ["Doble pared", "Tapa hermética", "Apto lavavajillas"],
    priceBreaks: [
      { minQty: 1, price: 4200 },
      { minQty: 25, price: 3800, discount: 10 },
      { minQty: 100, price: 3400, discount: 19 },
    ],
  },
  {
    id: 3,
    name: "Bolso Ejecutivo Premium",
    sku: "BOL-EXEC-PREM",
    category: "office",
    supplier: "qr-code",
    status: "pending",
    basePrice: 12300,
    stock: 45,
    description:
      "Bolso ejecutivo de cuero sintético premium con compartimentos organizadores.",
    colors: ["Negro", "Marrón", "Azul Marino"],
    features: ["15 compartimentos", "Resistente al agua", "Correas acolchadas"],
    priceBreaks: [
      { minQty: 1, price: 12300 },
      { minQty: 5, price: 11500, discount: 7 },
      { minQty: 20, price: 10800, discount: 12 },
    ],
  },
  {
    id: 4,
    name: "Polera Polo Corporativa",
    sku: "POL-POLO-CORP",
    category: "textile",
    supplier: "smart-gifts",
    status: "active",
    basePrice: 6800,
    stock: 150,
    description: "Polera polo de algodón 100% con bordado personalizable.",
    colors: ["Azul", "Blanco", "Negro", "Gris"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: ["Algodón 100%", "Bordado incluido", "Todas las tallas"],
    priceBreaks: [
      { minQty: 1, price: 6800 },
      { minQty: 50, price: 6200, discount: 9 },
      { minQty: 200, price: 5800, discount: 15 },
    ],
  },
  {
    id: 5,
    name: "Power Bank Ultra 10000mAh",
    sku: "PWR-ULTRA-10K",
    category: "tech",
    supplier: "smart-gifts",
    status: "active",
    basePrice: 7200,
    stock: 320,
    description:
      "Batería portátil de alta capacidad con carga rápida y múltiples puertos.",
    colors: ["Negro", "Plata"],
    features: ["Carga rápida", "USB-C + USB-A", "Display LED"],
    priceBreaks: [
      { minQty: 1, price: 7200 },
      { minQty: 15, price: 6500, discount: 10 },
      { minQty: 75, price: 5900, discount: 18 },
    ],
  },
  {
    id: 6,
    name: "Agenda Ejecutiva 2024",
    sku: "AGE-EXEC-2024",
    category: "office",
    supplier: "top-gifts",
    status: "active",
    basePrice: 3500,
    stock: 90,
    description: "Agenda ejecutiva con tapa de cuero y planificación semanal.",
    colors: ["Negro", "Marrón"],
    features: ["Tapa cuero", "Planificación semanal", "Bolsillo interno"],
    priceBreaks: [
      { minQty: 1, price: 3500 },
      { minQty: 20, price: 3200, discount: 9 },
      { minQty: 100, price: 2900, discount: 17 },
    ],
  },
  {
    id: 7,
    name: "Mochila Tech Pro",
    sku: "MCH-TECH-PRO",
    category: "tech",
    supplier: "smart-gifts",
    status: "active",
    basePrice: 15600,
    stock: 150,
    description:
      "Mochila técnica con compartimento para laptop y cargador USB integrado.",
    colors: ["Negro", "Gris Carbón"],
    features: ['Compartimento laptop 15"', "Puerto USB", "Resistente agua"],
    priceBreaks: [
      { minQty: 1, price: 15600 },
      { minQty: 10, price: 14200, discount: 9 },
      { minQty: 30, price: 13100, discount: 16 },
    ],
  },
  {
    id: 8,
    name: "Mouse Pad RGB Premium",
    sku: "MSP-RGB-PREM",
    category: "tech",
    supplier: "qr-code",
    status: "active",
    basePrice: 2800,
    stock: 420,
    description:
      "Mouse pad gaming con iluminación RGB personalizable y superficie de precisión.",
    colors: ["Negro RGB"],
    features: [
      "Iluminación RGB",
      "Superficie micro-texturizada",
      "Base antideslizante",
    ],
    priceBreaks: [
      { minQty: 1, price: 2800 },
      { minQty: 50, price: 2500, discount: 11 },
      { minQty: 200, price: 2200, discount: 21 },
    ],
  },
  {
    id: 9,
    name: "Termo Ejecutivo 500ml",
    sku: "TRM-EXEC-500",
    category: "home",
    supplier: "top-gifts",
    status: "active",
    basePrice: 5900,
    stock: 160,
    description:
      "Termo de acero inoxidable con aislamiento térmico de 12 horas.",
    colors: ["Plata", "Negro Mate", "Azul Navy"],
    features: ["Acero inoxidable", "Aislamiento 12h", "Tapa rosca hermética"],
    priceBreaks: [
      { minQty: 1, price: 5900 },
      { minQty: 20, price: 5300, discount: 10 },
      { minQty: 100, price: 4700, discount: 20 },
    ],
  },
  {
    id: 10,
    name: "Camiseta Soft Cotton",
    sku: "CAM-SOFT-COT",
    category: "textile",
    supplier: "smart-gifts",
    status: "active",
    basePrice: 4500,
    stock: 280,
    description: "Camiseta 100% algodón peinado con logo bordado.",
    colors: ["Blanco", "Negro", "Gris", "Azul", "Verde"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    features: ["Algodón peinado", "Logo bordado", "Corte unisex"],
    priceBreaks: [
      { minQty: 1, price: 4500 },
      { minQty: 100, price: 4100, discount: 9 },
      { minQty: 500, price: 3800, discount: 16 },
    ],
  },
  {
    id: 11,
    name: "Teclado Bluetooth Mini",
    sku: "TEC-BT-MINI",
    category: "tech",
    supplier: "qr-code",
    status: "active",
    basePrice: 9800,
    stock: 95,
    description: "Teclado compacto inalámbrico con teclas mecánicas suaves.",
    colors: ["Blanco", "Negro"],
    features: ["Bluetooth 5.0", "Teclas mecánicas", "Batería recargable"],
    priceBreaks: [
      { minQty: 1, price: 9800 },
      { minQty: 5, price: 8900, discount: 9 },
      { minQty: 25, price: 8200, discount: 16 },
    ],
  },
  {
    id: 12,
    name: "Libreta Ejecutiva A5",
    sku: "LIB-EXEC-A5",
    category: "office",
    supplier: "top-gifts",
    status: "active",
    basePrice: 2900,
    stock: 200,
    description:
      "Libreta de cuero sintético con hojas punteadas y bolsillo interno.",
    colors: ["Negro", "Marrón", "Azul"],
    features: ["Hojas punteadas", "Tapa cuero sintético", "Elástico cierre"],
    priceBreaks: [
      { minQty: 1, price: 2900 },
      { minQty: 50, price: 2600, discount: 10 },
      { minQty: 200, price: 2400, discount: 17 },
    ],
  },
  {
    id: 13,
    name: "Hoodie Corporativo",
    sku: "HOO-CORP-001",
    category: "textile",
    supplier: "smart-gifts",
    status: "active",
    basePrice: 12800,
    stock: 120,
    description:
      "Sudadera con capucha de algodón premium con bordado corporativo.",
    colors: ["Gris Melange", "Negro", "Azul Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: [
      "80% algodón 20% poliéster",
      "Capucha ajustable",
      "Bolsillo canguro",
    ],
    priceBreaks: [
      { minQty: 1, price: 12800 },
      { minQty: 25, price: 11500, discount: 10 },
      { minQty: 100, price: 10200, discount: 20 },
    ],
  },
  {
    id: 14,
    name: "Lámpara LED USB",
    sku: "LAM-LED-USB",
    category: "tech",
    supplier: "qr-code",
    status: "active",
    basePrice: 3200,
    stock: 350,
    description:
      "Lámpara LED flexible con conexión USB y 3 niveles de intensidad.",
    colors: ["Blanco", "Negro"],
    features: ["3 niveles intensidad", "Cuello flexible", "Alimentación USB"],
    priceBreaks: [
      { minQty: 1, price: 3200 },
      { minQty: 100, price: 2900, discount: 9 },
      { minQty: 300, price: 2600, discount: 19 },
    ],
  },
  {
    id: 15,
    name: "Portavasos Bambú",
    sku: "PTV-BAMBU-01",
    category: "office",
    supplier: "top-gifts",
    status: "active",
    basePrice: 1800,
    stock: 480,
    description: "Set de 4 portavasos de bambú natural con grabado láser.",
    colors: ["Natural"],
    features: ["Bambú 100%", "Grabado láser", "Set de 4 unidades"],
    priceBreaks: [
      { minQty: 1, price: 1800 },
      { minQty: 100, price: 1600, discount: 11 },
      { minQty: 500, price: 1400, discount: 22 },
    ],
  },
  {
    id: 16,
    name: "Chaqueta Softshell",
    sku: "CHA-SOFT-001",
    category: "textile",
    supplier: "smart-gifts",
    status: "active",
    basePrice: 18900,
    stock: 65,
    description: "Chaqueta técnica impermeable con forro polar desmontable.",
    colors: ["Negro", "Azul Navy", "Gris"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: ["Impermeable", "Forro desmontable", "Cremalleras YKK"],
    priceBreaks: [
      { minQty: 1, price: 18900 },
      { minQty: 10, price: 17200, discount: 9 },
      { minQty: 50, price: 15800, discount: 16 },
    ],
  },
  {
    id: 17,
    name: "Webcam HD Pro",
    sku: "WEB-HD-PRO",
    category: "tech",
    supplier: "qr-code",
    status: "active",
    basePrice: 11200,
    stock: 75,
    description:
      "Cámara web 1080p con micrófono integrado y enfoque automático.",
    colors: ["Negro"],
    features: ["Resolución 1080p", "Micrófono dual", "Enfoque automático"],
    priceBreaks: [
      { minQty: 1, price: 11200 },
      { minQty: 10, price: 10100, discount: 10 },
      { minQty: 50, price: 9300, discount: 17 },
    ],
  },
  {
    id: 18,
    name: "Organizador Escritorio",
    sku: "ORG-ESC-BAMB",
    category: "office",
    supplier: "top-gifts",
    status: "active",
    basePrice: 4800,
    stock: 140,
    description:
      "Organizador de escritorio de bambú con múltiples compartimentos.",
    colors: ["Natural", "Oscuro"],
    features: ["Bambú sostenible", "6 compartimentos", "Base antideslizante"],
    priceBreaks: [
      { minQty: 1, price: 4800 },
      { minQty: 25, price: 4300, discount: 10 },
      { minQty: 100, price: 3900, discount: 19 },
    ],
  },
  {
    id: 19,
    name: "Gorra Snapback",
    sku: "GOR-SNAP-001",
    category: "textile",
    supplier: "smart-gifts",
    status: "active",
    basePrice: 3800,
    stock: 220,
    description:
      "Gorra snapback de algodón con bordado frontal personalizable.",
    colors: ["Negro", "Azul", "Gris", "Blanco"],
    features: ["100% algodón", "Visera plana", "Cierre snapback"],
    priceBreaks: [
      { minQty: 1, price: 3800 },
      { minQty: 50, price: 3400, discount: 11 },
      { minQty: 200, price: 3100, discount: 18 },
    ],
  },
  {
    id: 20,
    name: "Hub USB-C 7 en 1",
    sku: "HUB-USBC-7IN1",
    category: "tech",
    supplier: "qr-code",
    status: "active",
    basePrice: 13500,
    stock: 55,
    description:
      "Hub multifunción con 7 puertos: HDMI, USB-A, USB-C, lector SD.",
    colors: ["Gris Espacial", "Plata"],
    features: ["Salida HDMI 4K", "3x USB-A 3.0", "Lector SD/microSD"],
    priceBreaks: [
      { minQty: 1, price: 13500 },
      { minQty: 5, price: 12200, discount: 10 },
      { minQty: 20, price: 11000, discount: 19 },
    ],
  },
];

/**
 * Derive category and supplier stats dynamically from products
 * (prevents hardcoded counts from going stale).
 */
const categoryMeta: Record<string, { name: string; icon: string }> = {
  tech: { name: "Tecnología", icon: "devices" },
  textile: { name: "Textil", icon: "checkroom" },
  office: { name: "Oficina", icon: "work" },
  home: { name: "Hogar", icon: "home" },
};

const categoryCounts: Record<string, number> = {};
const supplierCounts: Record<string, number> = {};

for (const p of products) {
  categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1;
  supplierCounts[p.supplier] = (supplierCounts[p.supplier] ?? 0) + 1;
}

export const categories: Category[] = [
  { id: "all", name: "Todos", icon: "apps", count: products.length },
  ...Object.entries(categoryMeta).map(([id, meta]) => ({
    id,
    name: meta.name,
    icon: meta.icon,
    count: categoryCounts[id] ?? 0,
  })),
];

// Map supplier id -> display name
const supplierNameMap: Record<string, string> = {
  "smart-gifts": "Smart Gifts",
  "top-gifts": "Top Gifts",
  "qr-code": "QR Code",
};

export const suppliers: Supplier[] = Object.keys(supplierCounts)
  .map((id) => ({
    id,
    name: supplierNameMap[id] ?? id,
    products: supplierCounts[id],
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
