// Utilidad de detección de código de barras
export function looksLikeBarcode(input: string): boolean {
  return /^\d{6,}$/.test(input.trim());
}
