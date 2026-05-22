import { ProductSearchResponse } from "@/services/productos.service";

export type ProductItem = {
  id: string;
  name: string;
  brand: string;
  nutriscoreGrade?: string;
  ecoscoreGrade?: string;
  imageUrl?: string;
};

export type ProductSearchResult = {
  count: number;
  page: number;
  pageCount: number;
  products: ProductItem[];
};

export function transformSearchProductsResponse(
  response: ProductSearchResponse,
): ProductSearchResult {
  return {
    count: response.count,
    page: response.page,
    pageCount: response.page_count,
    products: response.products.map((p) => ({
      id: p._id,
      name: p.product_name || p.product_name_en || "",
      brand: p.brands || "",
      nutriscoreGrade: p.nutriscore_grade,
      ecoscoreGrade: p.ecoscore_grade,
      imageUrl: p.image_front_small_url,
    })),
  };
}
