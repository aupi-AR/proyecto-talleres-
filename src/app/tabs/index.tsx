/**
 * src/app/tabs/index.tsx
 */

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ─── Datos estáticos ──────────────────────────────────────────────────────────
const CATEGORIAS = [
  {
    id: "beverages",
    nombre: "beverages",
    icon: "🍹",
    colors: ["#3B82F6", "#6366F1"] as [string, string],
  },
  {
    id: "dairies",
    nombre: "dairies",
    icon: "🥛",
    colors: ["#FBBF24", "#F59E0B"] as [string, string],
  },
  {
    id: "snacks",
    nombre: "snacks",
    icon: "🍿",
    colors: ["#EC4899", "#F43F5E"] as [string, string],
  },
  {
    id: "breakfasts",
    nombre: "breakfasts",
    icon: "🥞",
    colors: ["#FB923C", "#F97316"] as [string, string],
  },
  {
    id: "desserts",
    nombre: "desserts",
    icon: "🍰",
    colors: ["#A78BFA", "#7C3AED"] as [string, string],
  },
  {
    id: "chocolates",
    nombre: "chocolates",
    icon: "🍫",
    colors: ["#374151", "#111827"] as [string, string],
  },
  {
    id: "biscuits-and-cakes",
    nombre: "biscuits-and-cakes",
    icon: "🍪",
    colors: ["#D97706", "#B45309"] as [string, string],
  },
  {
    id: "cereals-and-potatoes",
    nombre: "cereals-and-potatoes",
    icon: "🌾",
    colors: ["#10B981", "#059669"] as [string, string],
  },
  {
    id: "meals",
    nombre: "meals",
    icon: "🍽️",
    colors: ["#EF4444", "#DC2626"] as [string, string],
  },
  {
    id: "plant-based-foods",
    nombre: "plant-based-foods",
    icon: "🌿",
    colors: ["#22C55E", "#16A34A"] as [string, string],
  },
];

const ETIQUETAS = [
  "organic",
  "vegan",
  "vegetarian",
  "gluten-free",
  "no-added-sugar",
  "fair-trade",
  "lactose-free",
  "palm-oil-free",
  "high-fiber",
  "low-fat",
];

const MARCAS = [
  { id: "nestle", color: "#C8102E" },
  { id: "coca-cola", color: "#FF0000" },
  { id: "pepsi", color: "#004B93" },
  { id: "danone", color: "#0057A8" },
  { id: "kelloggs", color: "#E31837" },
  { id: "unilever", color: "#1F36C7" },
  { id: "mondelez", color: "#6B246E" },
  { id: "mars", color: "#C8102E" },
  { id: "ferrero", color: "#B8860B" },
  { id: "lactalis", color: "#005FA3" },
];

// ─── Componentes ──────────────────────────────────────────────────────────────
const CategoryCard = ({
  id,
  nombre,
  icon,
  colors,
  onPress,
}: {
  id: string;
  nombre: string;
  icon: string;
  colors: [string, string];
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.categoryCard, pressed && { opacity: 0.75 }]}
  >
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.categoryGradient}
    >
      <Text style={styles.categoryIcon}>{icon}</Text>
      <Text style={styles.categoryLabel}>{nombre}</Text>
    </LinearGradient>
  </Pressable>
);

const TagChip = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.tagChip, pressed && { opacity: 0.75 }]}
  >
    <Text style={styles.tagText}>{label}</Text>
  </Pressable>
);

const BrandCard = ({
  id,
  color,
  onPress,
}: {
  id: string;
  color: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.brandCard, pressed && { opacity: 0.75 }]}
  >
    <View style={[styles.brandAvatar, { backgroundColor: color + "22" }]}>
      <Text style={[styles.brandInitials, { color }]}>
        {id.slice(0, 2).toUpperCase()}
      </Text>
    </View>
    <Text style={styles.brandName}>{id}</Text>
  </Pressable>
);

// ─── Pantalla ─────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>CURATED FLAVORS</Text>
          <Text style={styles.title}>
            The art of <Text style={styles.titleAccent}>conscious</Text>
            {"\n"}discovery.
          </Text>
        </View>

        {/* Categorías */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <Text style={styles.sectionLink}>View Library</Text>
          </View>
          <View style={styles.grid}>
            {CATEGORIAS.map((cat) => (
              <CategoryCard
                key={cat.id}
                {...cat}
                onPress={() => router.push(`/categorias/${cat.id}` as any)}
              />
            ))}
          </View>
        </View>

        {/* Etiquetas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Refine by Taste</Text>
          <View style={styles.tags}>
            {ETIQUETAS.map((tag) => (
              <TagChip key={tag} label={tag} onPress={() => {}} />
            ))}
          </View>
        </View>

        {/* Marcas */}
        <View style={[styles.section, { paddingBottom: 20 }]}>
          <Text style={styles.sectionTitle}>Global Brands</Text>
          <Text style={styles.sectionSubtitle}>
            Explored through the lens of quality.
          </Text>
          <View style={styles.grid}>
            {MARCAS.map((marca) => (
              <BrandCard key={marca.id} {...marca} onPress={() => {}} />
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#F7F7F5",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  muted: "#6B7280",
  accent: "#16A34A",
  border: "#E5E7EB",
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 40 },

  header: {
    backgroundColor: C.surface,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: C.muted,
    marginBottom: 8,
  },
  title: { fontSize: 32, fontWeight: "800", color: C.text, lineHeight: 40 },
  titleAccent: { color: C.accent, fontStyle: "italic" },

  section: { paddingHorizontal: 20, paddingTop: 28 },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: C.text },
  sectionSubtitle: {
    fontSize: 13,
    color: C.muted,
    marginTop: 2,
    marginBottom: 14,
  },
  sectionLink: { fontSize: 13, fontWeight: "600", color: C.accent },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  categoryCard: { width: "47.5%", borderRadius: 16, overflow: "hidden" },
  categoryGradient: {
    height: 110,
    padding: 14,
    justifyContent: "space-between",
  },
  categoryIcon: { fontSize: 28 },
  categoryLabel: { fontSize: 14, fontWeight: "700", color: "#fff" },

  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  tagChip: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  tagText: { fontSize: 13, fontWeight: "500", color: C.text },

  brandCard: {
    width: "47.5%",
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  brandAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  brandInitials: { fontSize: 18, fontWeight: "800" },
  brandName: { fontSize: 13, fontWeight: "600", color: C.text },
});
