// Pantalla de listado por categoría, marca o etiqueta
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { ProductResultsList } from "@/components/product-results-list";
import { usePagedProductosByTag } from "@/hooks/usePagedProductos";
import { fichaShowRoute } from "@/navigation/routes";
import { TagField } from "@/services/productos.service";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export type ProductListScreenProps = {
  title: string;
  field: TagField;
  value: string;
};

export function ProductListScreen({ title, field, value }: ProductListScreenProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [field, value]);

  const { data, isLoading, isFetching, isError, refetch } = usePagedProductosByTag(
    field,
    value,
    page,
  );

  const products = data?.products ?? [];

  return (
    <View style={styles.container}>
      <ProductResultsList
        products={products}
        count={data?.count}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        page={page}
        pageCount={data?.pageCount ?? 1}
        isFetching={isFetching}
        onGoToPage={(p) => setPage(Math.max(1, p))}
        onItemPress={(id) => router.push(fichaShowRoute(id))}
        searchPlaceholder={`Search ${title.toLowerCase()}...`}
      />
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EDE0",
  },
});
