// Datos de categorías
export type Categoria = {
  id: string;
  nombre: string;
  icon: string;
  colors: [string, string];
};

export const categorias: Categoria[] = [
  { id: "beverages", nombre: "beverages", icon: "🍹", colors: ["#3B82F6", "#6366F1"] },
  { id: "dairies", nombre: "dairies", icon: "🥛", colors: ["#FBBF24", "#F59E0B"] },
  { id: "snacks", nombre: "snacks", icon: "🍿", colors: ["#EC4899", "#F43F5E"] },
  { id: "breakfasts", nombre: "breakfasts", icon: "🥞", colors: ["#FB923C", "#F97316"] },
  { id: "desserts", nombre: "desserts", icon: "🍰", colors: ["#A78BFA", "#7C3AED"] },
  { id: "chocolates", nombre: "chocolates", icon: "🍫", colors: ["#374151", "#111827"] },
  { id: "biscuits-and-cakes", nombre: "biscuits-and-cakes", icon: "🍪", colors: ["#D97706", "#B45309"] },
  { id: "cereals-and-potatoes", nombre: "cereals-and-potatoes", icon: "🌾", colors: ["#10B981", "#059669"] },
  { id: "meals", nombre: "meals", icon: "🍽️", colors: ["#EF4444", "#DC2626"] },
  { id: "plant-based-foods", nombre: "plant-based-foods", icon: "🌿", colors: ["#22C55E", "#16A34A"] },
];
