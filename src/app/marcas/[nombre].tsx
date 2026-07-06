// Pantalla de marca
import { ProductListScreen } from "@/components/product-list-screen";
import { Stack, useLocalSearchParams } from "expo-router";

type MarcaParams = { nombre: string };

export default function MarcaScreen() {
  const { nombre } = useLocalSearchParams<MarcaParams>();
  const displayName = nombre.replace(/-/g, " ");
  const title = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return (
    <>
      <Stack.Screen
        options={{
          title,
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTitleStyle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
          headerShadowVisible: false,
        }}
      />
      <ProductListScreen title={title} field="brands_tags" value={nombre} />
    </>
  );
}
