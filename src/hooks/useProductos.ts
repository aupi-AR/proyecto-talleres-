import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/services/productos.service";
import { transformSearchProductsResponse } from "@/transformers/search-products.transformer";

export function useProductos(categoria: string) {
  return useQuery({
    queryKey: ["products", categoria],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const response = await searchProducts(categoria);
      return transformSearchProductsResponse(response);
    },
  });
}
