// src/utils/colors.ts
// Normaliza, mapea sinónimos y devuelve un color CSS válido (hex/rgb/hsl).
// Incluye helpers para detectar colores claros y ajustar luminosidad.

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const CSS_FN = /^(rgb|rgba|hsl|hsla)\(/i;

// quita tildes, pasa a minúsculas
const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

// Mapa de colores y sinónimos (ES/EN más comunes)
const COLOR_MAP: Record<string, string> = {
  // básicos
  blanco: "#ffffff",
  negro: "#111827",
  gris: "#9ca3af",
  grisclaro: "#d1d5db",
  grisoscuro: "#374151",
  plateado: "#cbd5e1",
  plata: "#cbd5e1",
  dorado: "#f59e0b",
  gold: "#f59e0b",

  rojo: "#ef4444",
  red: "#ef4444",
  naranja: "#f97316",
  orange: "#f97316",
  amarillo: "#facc15",
  yellow: "#facc15",
  verde: "#10b981",
  green: "#10b981",
  azul: "#3b82f6",
  blue: "#3b82f6",
  morado: "#8b5cf6",
  violeta: "#7c3aed",
  purple: "#8b5cf6",
  pink: "#f472b6",
  rosa: "#f472b6",
  rosado: "#f9a8d4",
  fucsia: "#e11d48",
  magenta: "#db2777",
  cian: "#06b6d4",
  turquesa: "#14b8a6",
  teal: "#0d9488",

  // variantes / sinónimos frecuentes
  "azul marino": "#1e3a8a",
  marino: "#1e3a8a",
  navy: "#1e3a8a",
  "navy blue": "#1e3a8a",
  "azul navy": "#1e3a8a",

  marron: "#8b5e34",
  "marron oscuro": "#6b4423",
  "marron claro": "#b08968",
  marrón: "#8b5e34",
  cafe: "#6b4423",
  café: "#6b4423",
  brown: "#8b5e34",

  beige: "#f5f5dc",
  crema: "#f3e8d5",

  bordo: "#7f1d1d",
  burdeos: "#7f1d1d",
  vino: "#7f1d1d",

  celeste: "#93c5fd",
  "sky blue": "#93c5fd",
  "azul claro": "#93c5fd",
  "azul oscuro": "#1e3a8a",

  oliva: "#6b8e23",
  olive: "#6b8e23",
  khaki: "#c3b091",
  kaki: "#c3b091",
};

// Mezcla dos colores (hex) con un peso dado (0..1)
function mix(hex1: string, hex2: string, w = 0.2) {
  const toRgb = (h: string) => {
    let s = h.replace("#", "");
    if (s.length === 3)
      s = s
        .split("")
        .map((c) => c + c)
        .join("");
    const n = parseInt(s, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  };
  const toHex = (r: number, g: number, b: number) =>
    "#" +
    [r, g, b]
      .map((v) => {
        const h = Math.round(v).toString(16);
        return h.length === 1 ? "0" + h : h;
      })
      .join("");

  const a = toRgb(hex1);
  const b = toRgb(hex2);
  const r = a.r * (1 - w) + b.r * w;
  const g = a.g * (1 - w) + b.g * w;
  const bl = a.b * (1 - w) + b.b * w;
  return toHex(r, g, bl);
}

export function resolveColor(label: string): string {
  if (!label) return "#e5e7eb";
  const raw = label.trim();
  if (HEX.test(raw) || CSS_FN.test(raw)) return raw; // ya es un color CSS válido

  const n = norm(raw)
    .replace(/[\s_-]+/g, "") // junta tokens “azul marino” -> “azulmarino”
    .replace(/[()]/g, "");

  // match exacto en mapa
  if (COLOR_MAP[n]) return COLOR_MAP[n];

  // heurísticas: buscar tokens clave dentro del string original normalizado
  const hay = (word: string) => norm(raw).includes(word);

  // base por token principal
  let base: string | null = null;
  if (hay("navy") || hay("marino")) base = COLOR_MAP["azul marino"];
  else if (
    hay("marron") ||
    hay("marrón") ||
    hay("cafe") ||
    hay("café") ||
    hay("brown")
  )
    base = COLOR_MAP["marron"];
  else if (hay("celeste") || hay("sky")) base = COLOR_MAP["celeste"];
  else if (hay("oliva") || hay("olive")) base = COLOR_MAP["oliva"];
  else if (hay("khaki") || hay("kaki")) base = COLOR_MAP["khaki"];
  else if (hay("bordo") || hay("burdeos") || hay("vino"))
    base = COLOR_MAP["bordo"];
  else if (hay("azul")) base = COLOR_MAP["azul"];
  else if (hay("verde")) base = COLOR_MAP["verde"];
  else if (hay("rojo")) base = COLOR_MAP["rojo"];
  else if (hay("naranja") || hay("orange")) base = COLOR_MAP["naranja"];
  else if (hay("amarillo") || hay("yellow")) base = COLOR_MAP["amarillo"];
  else if (hay("morado") || hay("violeta") || hay("purple"))
    base = COLOR_MAP["morado"];
  else if (hay("pink") || hay("rosa") || hay("rosado") || hay("fucsia"))
    base = COLOR_MAP["rosa"];
  else if (hay("gris")) base = COLOR_MAP["gris"];
  else if (hay("blanco") || hay("white")) base = COLOR_MAP["blanco"];
  else if (hay("negro") || hay("black")) base = COLOR_MAP["negro"];

  if (base) {
    // modifiers: “claro/oscuro/light/dark”
    const isLight = hay("claro") || hay("light");
    const isDark = hay("oscuro") || hay("dark");
    if (isLight) return mix(base, "#ffffff", 0.35);
    if (isDark) return mix(base, "#000000", 0.3);
    return base;
  }

  // fallback seguro
  return "#e5e7eb";
}

export function isLightColor(input: string): boolean {
  const c = resolveColor(input);
  if (CSS_FN.test(c)) return false; // para rgb/hsl asumimos no claro
  if (!HEX.test(c)) return false;
  // YIQ
  let s = c.replace("#", "");
  if (s.length === 3)
    s = s
      .split("")
      .map((x) => x + x)
      .join("");
  const n = parseInt(s, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq > 186;
}
