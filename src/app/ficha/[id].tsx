import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { useFavorites } from "@/context/favorites";
import { BottomTabBar } from "@/components/bottom-tab-bar";

type FichaParams = { id: string };

async function fetchProduct(id: string) {
  const url = `https://world.openfoodfacts.org/api/v2/product/${id}.json`;
  const res = await fetch(url, {
    headers: { "User-Agent": "UNTDF TNT 2026" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.product;
}

function useProductDetail(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

const NUTRI_COLORS: Record<string, string> = {
  a: "#16A34A", b: "#65A30D", c: "#CA8A04", d: "#EA580C", e: "#DC2626",
};
const ECO_COLORS: Record<string, string> = {
  "a-plus": "#16A34A", a: "#16A34A", b: "#65A30D",
  c: "#CA8A04", d: "#EA580C", e: "#DC2626",
};

const nutriLabel = (g: string) =>
  ({ a: "A", b: "B", c: "C", d: "D", e: "E" }[g] ?? g.toUpperCase());
const ecoLabel = (g: string) =>
  ({ "a-plus": "A+", a: "A", b: "B", c: "C", d: "D", e: "E" }[g] ?? g.toUpperCase());

type ScoreBadgeProps = {
  label: string;
  value: string;
  color: string;
  dark?: boolean;
};

const ScoreBadge = ({ label, value, color, dark = false }: ScoreBadgeProps) => (
  <View
    style={[
      styles.scoreBadge,
      dark
        ? { backgroundColor: color }
        : { backgroundColor: color + "22", borderWidth: 1, borderColor: color + "55" },
    ]}
  >
    <Text style={[styles.scoreBadgeLabel, { color: dark ? "#fff" : color }]}>
      {label}
    </Text>
    <Text style={[styles.scoreBadgeValue, { color: dark ? "#fff" : color }]}>
      {value}
    </Text>
  </View>
);

type NutrientRowProps = { label: string; value: string; sub?: boolean };

const NutrientRow = ({ label, value, sub = false }: NutrientRowProps) => (
  <View style={[styles.nutrientRow, sub && styles.nutrientRowSub]}>
    <Text style={[styles.nutrientLabel, sub && styles.nutrientLabelSub]}>
      {sub ? `— ${label}` : label}
    </Text>
    <Text style={styles.nutrientValue}>{value}</Text>
  </View>
);

export default function FichaScreen() {
  const { id } = useLocalSearchParams<FichaParams>();
  const router = useRouter();
  const { data: product, isLoading, isError } = useProductDetail(id);
  const { isFavorited: checkFavorited, toggleFavorite } = useFavorites();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handleFavorite = () => {
    if (!product) return;
    scale.value = withSpring(1.3, { damping: 4, stiffness: 300 }, () => {
      scale.value = withSpring(1);
    });
    toggleFavorite({
      id,
      name: product.product_name || product.product_name_en || "Unknown Product",
      brand: product.brands || "",
      imageUrl: product.image_front_url || product.image_url || "",
      nutriscoreGrade: product.nutriscore_grade,
      ecoscoreGrade: product.ecoscore_grade,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.outerContainer}>
        <Stack.Screen options={{ title: "" }} />
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.stateText}>Loading product...</Text>
        </View>
        <BottomTabBar />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.outerContainer}>
        <Stack.Screen options={{ title: "Error" }} />
        <View style={styles.centerState}>
          <Text style={styles.errorText}>Product not found.</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go back</Text>
          </Pressable>
        </View>
        <BottomTabBar />
      </View>
    );
  }

  const name: string        = product.product_name || product.product_name_en || "Unknown Product";
  const brand: string       = product.brands || "";
  const imageUrl: string    = product.image_front_url || product.image_url || "";
  const nutriGrade: string  = product.nutriscore_grade || "";
  const ecoGrade: string    = product.ecoscore_grade || "";
  const novaGroup: number   = product.nova_group;
  const nutriments          = product.nutriments || {};
  const ingredients: string = product.ingredients_text_en
    || product.ingredients_text
    || product.ingredients_text_fr
    || "";
  const allergens: string   = product.allergens_from_ingredients || product.allergens || "";

  const nutriColor = NUTRI_COLORS[nutriGrade] ?? "#6B7280";
  const ecoColor   = ECO_COLORS[ecoGrade]    ?? "#6B7280";

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen
        options={{
          title: "",
          headerStyle: { backgroundColor: "transparent" },
          headerTransparent: true,
          headerTintColor: COLORS.text,
          headerShadowVisible: false,
        }}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={[nutriColor + "33", "#F5EDE0"]}
            style={StyleSheet.absoluteFill}
          />
          {imageUrl ? (
            <Image
              source={imageUrl}
              style={styles.heroImage}
              contentFit="contain"
              transition={300}
            />
          ) : (
            <View style={styles.heroImagePlaceholder}>
              <Text style={styles.heroImageEmoji}>🫙</Text>
            </View>
          )}

          <Pressable
            onPress={handleFavorite}
            style={({ pressed }) => [
              styles.favoriteButton,
              checkFavorited(id) && styles.favoriteButtonActive,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Animated.Text style={[styles.favoriteIcon, animatedStyle]}>
              {checkFavorited(id) ? "♥" : "♡"}
            </Animated.Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          {brand ? (
            <Text style={styles.brand}>{brand.toUpperCase()}</Text>
          ) : null}

          <Text style={styles.productName}>{name}</Text>

          <View style={styles.scoresRow}>
            {nutriGrade ? (
              <ScoreBadge
                label="NUTRI-SCORE"
                value={nutriLabel(nutriGrade)}
                color={nutriColor}
                dark
              />
            ) : null}

            {novaGroup ? (
              <ScoreBadge
                label="NOVA GROUP"
                value={String(novaGroup)}
                color="#6366F1"
                dark
              />
            ) : null}

            {ecoGrade ? (
              <ScoreBadge
                label="ECO-SCORE"
                value={ecoLabel(ecoGrade)}
                color={ecoColor}
                dark
              />
            ) : null}
          </View>

          {(nutriments.energy || nutriments.fat || nutriments.proteins) ? (
            <View style={styles.macrosRow}>
              {nutriments["energy-kj"] ? (
                <View style={styles.macroChip}>
                  <Text style={styles.macroLabel}>ENERGY</Text>
                  <Text style={styles.macroValue}>
                    {Math.round(nutriments["energy-kj"])} kJ
                  </Text>
                </View>
              ) : null}
              {nutriments.fat !== undefined ? (
                <View style={styles.macroChip}>
                  <Text style={styles.macroLabel}>FAT</Text>
                  <Text style={styles.macroValue}>{nutriments.fat}g</Text>
                </View>
              ) : null}
              {nutriments.proteins !== undefined ? (
                <View style={styles.macroChip}>
                  <Text style={styles.macroLabel}>PROTEIN</Text>
                  <Text style={styles.macroValue}>{nutriments.proteins}g</Text>
                </View>
              ) : null}
              {nutriments.sugars !== undefined ? (
                <View style={styles.macroChip}>
                  <Text style={styles.macroLabel}>SUGARS</Text>
                  <Text style={styles.macroValue}>{nutriments.sugars}g</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>

        {ingredients ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🌿</Text>
              <Text style={styles.sectionTitle}>Ingredients</Text>
            </View>
            <Text style={styles.ingredientsText}>{ingredients}</Text>

            {allergens ? (
              <View style={styles.allergenBox}>
                <Text style={styles.allergenTitle}>⚠️  ALLERGEN INFORMATION</Text>
                <Text style={styles.allergenText}>{allergens}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {Object.keys(nutriments).length > 0 ? (
          <View style={[styles.section, styles.sectionLast]}>
            <Text style={styles.sectionTitle}>
              Nutritional Values (per 100
              {product.nutrition_data_per === "100ml" ? "ml" : "g"})
            </Text>

            <View style={styles.nutrientTable}>
              {nutriments["energy-kcal_100g"] !== undefined && (
                <NutrientRow
                  label="Energy"
                  value={`${Math.round(nutriments["energy-kcal_100g"])} kcal / ${Math.round(nutriments["energy-kj_100g"] || 0)} kJ`}
                />
              )}
              {nutriments.fat_100g !== undefined && (
                <NutrientRow label="Fat" value={`${nutriments.fat_100g}g`} />
              )}
              {nutriments["saturated-fat_100g"] !== undefined && (
                <NutrientRow
                  label="of which saturates"
                  value={`${nutriments["saturated-fat_100g"]}g`}
                  sub
                />
              )}
              {nutriments.carbohydrates_100g !== undefined && (
                <NutrientRow
                  label="Carbohydrate"
                  value={`${nutriments.carbohydrates_100g}g`}
                />
              )}
              {nutriments.sugars_100g !== undefined && (
                <NutrientRow
                  label="of which sugars"
                  value={`${nutriments.sugars_100g}g`}
                  sub
                />
              )}
              {nutriments.fiber_100g !== undefined && (
                <NutrientRow label="Fibre" value={`${nutriments.fiber_100g}g`} />
              )}
              {nutriments.proteins_100g !== undefined && (
                <NutrientRow
                  label="Protein"
                  value={`${nutriments.proteins_100g}g`}
                />
              )}
              {nutriments.salt_100g !== undefined && (
                <NutrientRow label="Salt" value={`${nutriments.salt_100g}g`} />
              )}
            </View>
          </View>
        ) : null}
      </ScrollView>
      <BottomTabBar />
    </View>
  );
}

const COLORS = {
  bg:        "#F5EDE0",
  surface:   "#FFFFFF",
  text:      "#1A1A1A",
  textMuted: "#6B7280",
  accent:    "#16A34A",
  border:    "#E5E7EB",
  danger:    "#FEF2F2",
  dangerText:"#B91C1C",
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  heroContainer: {
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  heroImage: {
    width: "65%",
    height: "80%",
  },
  heroImagePlaceholder: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  heroImageEmoji: {
    fontSize: 80,
  },
  favoriteButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  favoriteButtonActive: {
    backgroundColor: "#EF4444",
  },
  favoriteIcon: {
    fontSize: 22,
    color: "#EF4444",
  },
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 20,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  brand: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: COLORS.textMuted,
  },
  productName: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    lineHeight: 30,
  },
  scoresRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  scoreBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 68,
  },
  scoreBadgeLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  scoreBadgeValue: {
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 26,
  },
  macrosRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  macroChip: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 64,
  },
  macroLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    color: COLORS.textMuted,
  },
  macroValue: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 2,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  sectionLast: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },
  ingredientsText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },
  allergenBox: {
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  allergenTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: COLORS.dangerText,
  },
  allergenText: {
    fontSize: 13,
    color: COLORS.dangerText,
    lineHeight: 18,
  },
  nutrientTable: {
    gap: 0,
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  nutrientRowSub: {
    paddingLeft: 12,
  },
  nutrientLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  nutrientLabelSub: {
    color: COLORS.textMuted,
    fontStyle: "italic",
    fontSize: 13,
  },
  nutrientValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 24,
  },
  stateText: {
    fontSize: 15,
    color: COLORS.textMuted,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },
  backButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
