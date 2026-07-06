// Pantalla de etiqueta
import { ProductListScreen } from "@/components/product-list-screen";
import { Stack, useLocalSearchParams } from "expo-router";

type EtiquetaParams = { nombre: string };

export default function EtiquetaScreen() {
  const { nombre } = useLocalSearchParams<EtiquetaParams>();
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
      <ProductListScreen title={title} field="labels_tags" value={nombre} />
    </>
  );
}
