const API_URL = "https://world.openfoodfacts.org/api/v2";
const USER_AGENT = "Digital Epicurean / 1.0 (UNTDF TNT 2026)";

export async function searchProducts(
  categoria: string,
  page = 1,
  pageSize = 20,
): Promise<ProductSearchResponse> {
  const params = new URLSearchParams({
    categories_tags: categoria.includes(":") ? categoria : `en:${categoria}`,
    page: String(page),
    page_size: String(pageSize),
    fields: [
      "_id",
      "product_name",
      "brands",
      "nutriscore_grade",
      "ecoscore_grade",
      "nova_group",
      "image_front_small_url",
    ].join(","),
  });

  const res = await fetch(`${API_URL}/search?${params}`, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<ProductSearchResponse>;
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_URL}/product/${id}.json`, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.product as Product;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductSearchResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: Product[];
  skip: number;
}

export interface Product {
  _id: string;
  product_name: string;
  product_name_en?: string;
  brands: string;
  nutriscore_grade?: string;
  ecoscore_grade?: string;
  nova_group?: number;
  image_front_small_url?: string;
  image_front_url?: string;
  image_url?: string;
  ingredients_text?: string;
  ingredients_text_en?: string;
  allergens_from_ingredients?: string;
  allergens?: string;
  quantity?: string;
  nutrition_data_per?: string;
  nutriments?: Nutriments;
}

export interface Nutriments {
  energy?: number;
  "energy-kj"?: number;
  "energy-kj_100g"?: number;
  "energy-kcal"?: number;
  "energy-kcal_100g"?: number;
  fat?: number;
  fat_100g?: number;
  "saturated-fat"?: number;
  "saturated-fat_100g"?: number;
  carbohydrates?: number;
  carbohydrates_100g?: number;
  sugars?: number;
  sugars_100g?: number;
  fiber?: number;
  fiber_100g?: number;
  proteins?: number;
  proteins_100g?: number;
  salt?: number;
  salt_100g?: number;
}
