// Servicio de productos (API OpenFoodFacts)
const API_URL = "https://world.openfoodfacts.org/api/v2";
const LEGACY_SEARCH_URL = "https://world.openfoodfacts.org/cgi/search.pl";
const USER_AGENT = "Digital Epicurean / 1.0 (UNTDF TNT 2026)";

// Timeout de fetch
const REQUEST_TIMEOUT_MS = 8000;

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

const PRODUCT_FIELDS = [
  "_id",
  "product_name",
  "brands",
  "nutriscore_grade",
  "ecoscore_grade",
  "nova_group",
  "image_front_small_url",
].join(",");

export type TagField = "categories_tags" | "brands_tags" | "labels_tags";

export async function searchProducts(
  field: TagField,
  value: string,
  page = 1,
  pageSize = 20,
): Promise<ProductSearchResponse> {
  const tagValue = value.includes(":") ? value : `en:${value}`;
  const params = new URLSearchParams({
    [field]: tagValue,
    page: String(page),
    page_size: String(pageSize),
    fields: PRODUCT_FIELDS,
  });

  const res = await fetchWithTimeout(`${API_URL}/search?${params}`);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<ProductSearchResponse>;
}

// Búsqueda de texto libre (buscador legacy)
export async function searchProductsByQuery(
  query: string,
  page = 1,
  pageSize = 20,
): Promise<ProductSearchResponse> {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: "1",
    action: "process",
    json: "1",
    page: String(page),
    page_size: String(pageSize),
    fields: PRODUCT_FIELDS,
  });

  const res = await fetchWithTimeout(`${LEGACY_SEARCH_URL}?${params}`);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<ProductSearchResponse>;
}

export class ProductNotFoundError extends Error {
  constructor(code: string) {
    super(`Product not found: ${code}`);
    this.name = "ProductNotFoundError";
  }
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetchWithTimeout(`${API_URL}/product/${id}.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as ProductDetailResponse;
  if (data.status !== 1 || !data.product) {
    throw new ProductNotFoundError(id);
  }
  return data.product;
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

export interface ProductDetailResponse {
  code: string;
  status: number;
  status_verbose: string;
  product?: Product;
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
