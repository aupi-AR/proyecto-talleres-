import { categorias, type Categoria } from "@/data/categorias";
import { etiquetas } from "@/data/etiquetas";
import { marcas, type Marca } from "@/data/marcas";
import { categoriaShowRoute } from "@/navigation/routes";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, StatusBar, StyleSheet, Text, View, Pressable } from "react-native";

const CategoryCard = ({ item, onPress }: { item: Categoria; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.categoryCard, pressed && { opacity: 0.75 }]}
  >
    <LinearGradient
      colors={item.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.categoryGradient}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryLabel}>{item.nombre}</Text>
    </LinearGradient>
  </Pressable>
);

const TagChip = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.tagChip, pressed && { opacity: 0.75 }]}
  >
    <Text style={styles.tagText}>{label}</Text>
  </Pressable>
);

const BrandCard = ({ item, onPress }: { item: Marca; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.brandCard, pressed && { opacity: 0.75 }]}
  >
    <View style={[styles.brandAvatar, { backgroundColor: item.color + "22" }]}>
      <Text style={[styles.brandInitials, { color: item.color }]}>
        {item.nombre.slice(0, 2).toUpperCase()}
      </Text>
    </View>
    <Text style={styles.brandName}>{item.nombre}</Text>
  </Pressable>
);

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
        <View style={styles.header}>
          <Text style={styles.appName}>Digital Epicurean</Text>
          <Text style={styles.eyebrow}>CURATED FLAVORS</Text>
          <Text style={styles.title}>
            The art of <Text style={styles.titleAccent}>conscious</Text>
            {"\n"}discovery.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <Text style={styles.sectionLink}>View Library</Text>
          </View>
          <View style={styles.grid}>
            {categorias.map((cat) => (
              <CategoryCard
                key={cat.id}
                item={cat}
                onPress={() => router.push(categoriaShowRoute(cat.id))}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Refine by Taste</Text>
          <View style={styles.tags}>
            {etiquetas.map((tag) => (
              <TagChip
                key={tag.id}
                label={tag.nombre}
                onPress={() => router.push(categoriaShowRoute(tag.id))}
              />
            ))}
          </View>
        </View>

        <View style={[styles.section, { paddingBottom: 32 }]}>
          <Text style={styles.sectionTitle}>Global Brands</Text>
          <Text style={styles.sectionSubtitle}>Explored through the lens of quality.</Text>
          <View style={styles.grid}>
            {marcas.map((marca) => (
              <BrandCard
                key={marca.id}
                item={marca}
                onPress={() => router.push(categoriaShowRoute(marca.id))}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const C = { bg: "#F5EDE0", surface: "#FFFFFF", text: "#1A1A1A", muted: "#6B7280", accent: "#16A34A", border: "#E5E7EB" };

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 32 },
  header: { backgroundColor: C.surface, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 28 },
  appName: { fontSize: 14, fontWeight: "700", color: C.accent, marginBottom: 16 },
  eyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 2, color: C.muted, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: "800", color: C.text, lineHeight: 40 },
  titleAccent: { color: C.accent, fontStyle: "italic" },
  section: { paddingHorizontal: 20, paddingTop: 28 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: C.text },
  sectionSubtitle: { fontSize: 13, color: C.muted, marginTop: 2, marginBottom: 14 },
  sectionLink: { fontSize: 13, fontWeight: "600", color: C.accent },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryCard: { width: "47.5%", borderRadius: 16, overflow: "hidden" },
  categoryGradient: { height: 110, padding: 14, justifyContent: "space-between" },
  categoryIcon: { fontSize: 28 },
  categoryLabel: { fontSize: 13, fontWeight: "700", color: "#fff", lineHeight: 18 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  tagChip: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  tagText: { fontSize: 13, fontWeight: "500", color: C.text },
  brandCard: { width: "47.5%", backgroundColor: C.surface, borderRadius: 14, padding: 16, alignItems: "center", gap: 10, borderWidth: 1, borderColor: C.border },
  brandAvatar: { width: 52, height: 52, borderRadius: 26, justifyContent: "center", alignItems: "center" },
  brandInitials: { fontSize: 18, fontWeight: "800" },
  brandName: { fontSize: 13, fontWeight: "600", color: C.text },
});
