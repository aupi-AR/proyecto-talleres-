import { categorias } from "@/data/categorias";
import { categoriaShowRoute } from "@/navigation/routes";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";

export default function BuscarScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Search</Text>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search categories..."
          placeholderTextColor={C.muted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")}>
            <Text style={styles.clearBtn}>✕</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.sectionLabel}>Browse Categories</Text>

      <View style={styles.grid}>
        {filtered.map((cat) => (
          <Pressable
            key={cat.id}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
            onPress={() => router.push(categoriaShowRoute(cat.id))}
          >
            <LinearGradient
              colors={cat.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.cardIcon}>{cat.icon}</Text>
              <Text style={styles.cardLabel}>{cat.nombre}</Text>
            </LinearGradient>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const C = {
  bg: "#F7F7F5",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  muted: "#6B7280",
  border: "#E5E7EB",
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40, gap: 20 },

  title: { fontSize: 28, fontWeight: "800", color: C.text },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: C.border,
    gap: 10,
  },
  searchIcon: { fontSize: 16 },
  input: { flex: 1, fontSize: 15, color: C.text, padding: 0 },
  clearBtn: { fontSize: 14, color: C.muted, paddingHorizontal: 4 },

  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: C.text,
    marginTop: 4,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: { width: "47.5%", borderRadius: 16, overflow: "hidden" },
  gradient: { height: 100, padding: 14, justifyContent: "space-between" },
  cardIcon: { fontSize: 24 },
  cardLabel: { fontSize: 12, fontWeight: "700", color: "#fff", lineHeight: 16 },
});
