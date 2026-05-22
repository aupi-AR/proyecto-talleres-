import { FavoriteProduct, useFavorites } from "@/context/favorites";
import { fichaShowRoute } from "@/navigation/routes";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const NUTRI_COLORS: Record<string, string> = {
  a: "#16A34A", b: "#65A30D", c: "#CA8A04", d: "#EA580C", e: "#DC2626",
};

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const router = useRouter();

  if (favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>♡</Text>
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptySubtitle}>Open a product and tap ♥ to save it here.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.content}
      ListHeaderComponent={<Text style={styles.title}>Favorites</Text>}
      renderItem={({ item }: { item: FavoriteProduct }) => {
        const nutriColor = NUTRI_COLORS[item.nutriscoreGrade ?? ""] ?? "#9CA3AF";
        return (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
            onPress={() => router.push(fichaShowRoute(item.id))}
          >
            <View style={styles.imageBox}>
              {item.imageUrl ? (
                <Image
                  source={item.imageUrl}
                  style={{ width: 64, height: 64 }}
                  contentFit="contain"
                  transition={200}
                />
              ) : (
                <Text style={styles.imagePlaceholder}>🫙</Text>
              )}
            </View>

            <View style={styles.info}>
              {item.brand ? (
                <Text style={styles.brand}>{item.brand.toUpperCase()}</Text>
              ) : null}
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              {item.nutriscoreGrade ? (
                <View style={[styles.badge, { backgroundColor: nutriColor }]}>
                  <Text style={styles.badgeText}>
                    NUTRI-SCORE {item.nutriscoreGrade.toUpperCase()}
                  </Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.chevron}>›</Text>
          </Pressable>
        );
      }}
    />
  );
}

const C = {
  bg: "#F5EDE0",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  muted: "#6B7280",
  border: "#E5E7EB",
  accent: "#16A34A",
};

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    backgroundColor: C.bg,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 32,
  },
  emptyIcon: { fontSize: 52, color: C.accent },
  emptyTitle: { fontSize: 24, fontWeight: "800", color: C.text },
  emptySubtitle: { fontSize: 15, color: C.muted, textAlign: "center", lineHeight: 22 },

  list: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 32, gap: 10 },
  title: { fontSize: 28, fontWeight: "800", color: C.text, marginBottom: 8 },

  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
  },
  imageBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  imagePlaceholder: { fontSize: 28 },
  info: { flex: 1, gap: 4 },
  brand: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, color: C.muted },
  name: { fontSize: 15, fontWeight: "700", color: C.text, lineHeight: 20 },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 10, fontWeight: "800", color: "#fff", letterSpacing: 0.5 },
  chevron: { fontSize: 22, color: C.muted, marginRight: 4 },
});
