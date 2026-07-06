// Hooks de paginación de productos
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  searchProducts,
  searchProductsByQuery,
  TagField,
} from "@/services/productos.service";
import { transformSearchProductsResponse } from "@/transformers/search-products.transformer";

// Reintentos con backoff
const RETRY_COUNT = 2;
const retryDelay = (attempt: number) => Math.min(400 * 2 ** attempt, 1500);

export function usePagedProductosByTag(field: TagField, value: string, page: number) {
  return useQuery({
    queryKey: ["products-page", field, value, page],
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
    retry: RETRY_COUNT,
    retryDelay,
    queryFn: async () => {
      const response = await searchProducts(field, value, page);
      return transformSearchProductsResponse(response);
    },
    enabled: !!value,
  });
}

export function usePagedProductosByQuery(query: string, page: number) {
  return useQuery({
    queryKey: ["products-page-search", query, page],
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
    retry: RETRY_COUNT,
    retryDelay,
    queryFn: async () => {
      const response = await searchProductsByQuery(query, page, 10);
      return transformSearchProductsResponse(response);
    },
    enabled: query.trim().length > 0,
  });
}
