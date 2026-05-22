/**
 * app/categorias/[nombre].tsx
 * Pantalla de búsqueda/lista de productos — Digital Epicurean
 *
 * Buenas prácticas aplicadas:
 *  - useProductos hook con TanStack Query
 *  - transformSearchProductsResponse para shape limpio
 *  - FlashList para rendimiento en listas largas
 *  - Stack.Screen para título dinámico
 *  - Manejo de estados: loading, error, empty, data
 */

import { useProductos } from "@/hooks/useProductos";
import { fichaShowRoute } from "@/navigation/routes";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type CategoriaParams = {
  nombre: string;
};

// ─── Tipos del transformer ────────────────────────────────────────────────────
type MyProduct = {
  id: string;
  name: string;
  brand: string;
  nutriscoreGrade?: string;
  ecoscoreGrade?: string;
  imageUrl?: string;
};

// ─── Item de producto ─────────────────────────────────────────────────────────
type ProductItemProps = {
  product: MyProduct;
  index: number;
  onPress: () => void;
};

const NUTRI_COLORS: Record<string, string> = {
  a: "#16A34A", b: "#65A30D", c: "#CA8A04", d: "#EA580C", e: "#DC2626",
};
const ECO_COLORS: Record<string, string> = {
  "a-plus": "#16A34A", a: "#16A34A", b: "#65A30D",
  c: "#CA8A04", d: "#EA580C", e: "#DC2626",
};

const ProductItem = ({ product, index, onPress }: ProductItemProps) => {
  const nutri = product.nutriscoreGrade ?? "";
  const eco   = product.ecoscoreGrade ?? "";
  const nutriColor = NUTRI_COLORS[nutri] ?? "#9CA3AF";
  const ecoColor   = ECO_COLORS[eco]    ?? "#9CA3AF";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.productCard,
        pressed && styles.pressed,
      ]}
    >
      {/* Imagen del producto */}
      <View style={styles.productImage}>
        {product.imageUrl ? (
          <Image
            source={product.imageUrl}
            style={{ width: 64, height: 64 }}
            contentFit="contain"
            transition={200}
          />
        ) : (
          <Text style={styles.productImagePlaceholder}>🥄</Text>
        )}
      </View>

      {/* Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name || `Product ${index + 1}`}
        </Text>
        {product.brand ? (
          <Text style={styles.productBrand} numberOfLines={1}>
            {product.brand.toUpperCase()}
          </Text>
        ) : null}

        {/* Scores */}
        {(nutri || eco) ? (
          <View style={styles.scoresRow}>
            {nutri ? (
              <View style={[styles.scoreBadge, { backgroundColor: nutriColor }]}>
                <Text style={styles.scoreBadgeLabel}>NUTRI-{"\n"}SCORE</Text>
                <Text style={styles.scoreBadgeValue}>{nutri.toUpperCase()}</Text>
              </View>
            ) : null}
            {eco ? (
              <View style={[styles.scoreBadge, { backgroundColor: ecoColor + "33" }]}>
                <Text style={[styles.scoreBadgeLabel, { color: ecoColor }]}>
                  ECO-SCORE
                </Text>
                <Text style={[styles.scoreBadgeValue, { color: ecoColor }]}>
                  {eco === "a-plus" ? "A+" : eco.toUpperCase()}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Chevron */}
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
};

// ─── Pantalla ─────────────────────────────────────────────────────────────────
export default function CategoriaScreen() {
  const { nombre } = useLocalSearchParams<CategoriaParams>();
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const { data, isLoading, isError, refetch } = useProductos(nombre);

  const filteredProducts = (data?.products ?? []).filter((p) =>
    (p.name ?? "").toLowerCase().includes(searchText.toLowerCase())
  );

  const displayName = nombre.replace(/-/g, " ");
  const displayTitle =
    displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: displayTitle,
          headerStyle: { backgroundColor: COLORS.surface },
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false,
        }}
      />

      {/* Contador */}
      {data && (
        <Text style={styles.itemCount}>
          {data.count.toLocaleString()} ITEMS FOUND
        </Text>
      )}

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${displayName.toLowerCase()}...`}
          placeholderTextColor={COLORS.textMuted}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <Pressable onPress={() => setSearchText("")}>
            <Text style={styles.searchClear}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Estados */}
      {isLoading && (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.stateText}>Loading products...</Text>
        </View>
      )}

      {isError && (
        <View style={styles.centerState}>
          <Text style={styles.errorText}>Could not load products.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      )}

      {/* Lista */}
      {!isLoading && !isError && (
        <FlashList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <ProductItem
              product={item}
              index={index}
              onPress={() => router.push(fichaShowRoute(item.id))}
            />
          )}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Text style={styles.emptyText}>No products found.</Text>
            </View>
          }
        />
      )}

      <BottomTabBar />
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const COLORS = {
  bg:        "#F5EDE0",
  surface:   "#FFFFFF",
  text:      "#1A1A1A",
  textMuted: "#9CA3AF",
  accent:    "#16A34A",
  border:    "#E5E7EB",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  // Contador
  itemCount: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: COLORS.textMuted,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },

  // Buscador
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    padding: 0,
  },
  searchClear: {
    fontSize: 14,
    color: COLORS.textMuted,
    paddingHorizontal: 4,
  },

  // Lista
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // Card de producto
  productCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  productImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  productImagePlaceholder: {
    fontSize: 28,
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    lineHeight: 20,
  },
  productBrand: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: COLORS.textMuted,
  },
  scoresRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 4,
  },
  scoreBadgeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 11,
  },
  scoreBadgeValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  chevron: {
    fontSize: 22,
    color: COLORS.textMuted,
    marginRight: 4,
  },

  // Estados
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingVertical: 60,
  },
  stateText: {
    fontSize: 15,
    color: COLORS.textMuted,
  },
  errorText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#DC2626",
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textMuted,
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  pressed: {
    opacity: 0.75,
  },
});
