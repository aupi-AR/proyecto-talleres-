// Módulo de búsqueda
import { ProductResultsList } from "@/components/product-results-list";
import { categorias } from "@/data/categorias";
import { usePagedProductosByQuery } from "@/hooks/usePagedProductos";
import { categoriaShowRoute, fichaShowRoute } from "@/navigation/routes";
import { fetchProduct } from "@/services/productos.service";
import { looksLikeBarcode } from "@/utils/barcode";
import { Ionicons } from "@expo/vector-icons";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type SearchMode = "idle" | "results";
type ScanState = "idle" | "loading" | "found" | "not_found";

export default function SearchScreen() {
  const router = useRouter();

  // Búsqueda por texto
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("idle");
  const [isCheckingBarcode, setIsCheckingBarcode] = useState(false);
  const [page, setPage] = useState(1);

  // Escaneo por cámara
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const { data, isLoading, isFetching, isError, refetch } = usePagedProductosByQuery(
    activeQuery,
    page,
  );

  const products = data?.products ?? [];

  async function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (looksLikeBarcode(trimmed)) {
      setIsCheckingBarcode(true);
      try {
        await fetchProduct(trimmed);
        setIsCheckingBarcode(false);
        router.push(fichaShowRoute(trimmed));
        return;
      } catch {
        setIsCheckingBarcode(false);
        // Búsqueda de texto libre
      }
    }

    setPage(1);
    setActiveQuery(trimmed);
    setMode("results");
  }

  function handleClearSearch() {
    setQuery("");
    setActiveQuery("");
    setPage(1);
    setMode("idle");
  }

  function handleOpenScanner() {
    setScanState("idle");
    setScannedCode(null);
    setScannerVisible(true);
  }

  function handleCloseScanner() {
    setScannerVisible(false);
  }

  function handleRetryScan() {
    setScanState("idle");
    setScannedCode(null);
  }

  async function handleBarcodeScan(result: BarcodeScanningResult) {
    setScanState("loading");
    setScannedCode(result.data);
    try {
      await fetchProduct(result.data);
      setScanState("found");
    } catch {
      setScanState("not_found");
    }
  }

  function handleGoToScannedProduct() {
    if (!scannedCode) return;
    handleCloseScanner();
    router.push(fichaShowRoute(scannedCode));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.input}
              placeholder="Search by name, brand, label, or barcode..."
              placeholderTextColor={C.muted}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {isCheckingBarcode ? (
              <ActivityIndicator size="small" color={C.accent} />
            ) : (
              query.length > 0 && (
                <Pressable onPress={handleClearSearch}>
                  <Text style={styles.clearBtn}>✕</Text>
                </Pressable>
              )
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.scanButton,
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleOpenScanner}
          >
            <Ionicons name="barcode-outline" size={26} color="#fff" />
          </Pressable>
        </View>
      </View>

      {mode === "idle" ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>Browse Categories</Text>

          <View style={styles.grid}>
            {categorias.map((cat) => (
              <Pressable
                key={cat.id}
                style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
                onPress={() => router.push(categoriaShowRoute(cat.id))}
              >
                <LinearGradient
                  colors={cat.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradient}
                >
                  <Text style={styles.cardIcon}>{cat.icon}</Text>
                  <Text style={styles.cardLabel}>{cat.nombre}</Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
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
          searchPlaceholder="Filter results..."
          emptyText={`No products found for "${activeQuery}".`}
        />
      )}

      {/* Modal de escaneo de código de barras */}
      <Modal
        visible={scannerVisible}
        animationType="slide"
        onRequestClose={handleCloseScanner}
        transparent
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Scan barcode</Text>
            <Pressable onPress={handleCloseScanner} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={C.text} />
            </Pressable>
          </View>

          {!permission ? (
            <View style={styles.permissionContainer}>
              <ActivityIndicator size="large" color={C.accent} />
            </View>
          ) : !permission.granted && permission.canAskAgain ? (
            <View style={styles.permissionContainer}>
              <Ionicons name="camera-outline" size={64} color={C.muted} />
              <Text style={styles.permissionText}>
                We need camera access to scan barcodes.
              </Text>
              <Pressable style={styles.permissionButton} onPress={requestPermission}>
                <Text style={styles.permissionButtonText}>Request permission</Text>
              </Pressable>
            </View>
          ) : !permission.granted && !permission.canAskAgain ? (
            <View style={styles.permissionContainer}>
              <Ionicons name="settings-outline" size={64} color={C.muted} />
              <Text style={styles.permissionText}>
                Camera permission was denied.{"\n"}Enable it from Settings.
              </Text>
              <Pressable style={styles.permissionButton} onPress={Linking.openSettings}>
                <Text style={styles.permissionButtonText}>Go to Settings</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.cameraWrapper}>
              <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanState === "idle" ? handleBarcodeScan : undefined}
                barcodeScannerSettings={{
                  barcodeTypes: [
                    "aztec", "ean13", "ean8", "qr", "pdf417", "upc_e",
                    "datamatrix", "code39", "code93", "itf14", "codabar",
                    "code128", "upc_a",
                  ],
                }}
              />
            </View>
          )}

          {(scanState === "found" || scanState === "not_found") && (
            <View
              style={[styles.resultCard, scanState === "not_found" && styles.resultCardError]}
            >
              {scanState === "found" ? (
                <>
                  <Ionicons name="checkmark-circle" size={36} color={C.accent} />
                  <Text style={styles.resultTitle}>Product found</Text>
                  <Text style={styles.resultCode} numberOfLines={1}>{scannedCode}</Text>
                  <View style={styles.resultActions}>
                    <Pressable style={styles.primaryButton} onPress={handleGoToScannedProduct}>
                      <Text style={styles.primaryButtonText}>View product</Text>
                      <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </Pressable>
                    <Pressable style={styles.retryButton} onPress={handleRetryScan}>
                      <Text style={styles.retryButtonText}>Scan again</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <Ionicons name="warning-outline" size={36} color="#DC2626" />
                  <Text style={[styles.resultTitle, { color: "#DC2626" }]}>
                    Product not found
                  </Text>
                  <Text style={styles.resultCode} numberOfLines={1}>{scannedCode}</Text>
                  <Text style={styles.resultSubtitle}>
                    This product isn&apos;t in the database.
                  </Text>
                  <Pressable style={styles.retryButton} onPress={handleRetryScan}>
                    <Text style={styles.retryButtonText}>Scan again</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const C = { bg: "#F5EDE0", surface: "#FFFFFF", text: "#1A1A1A", muted: "#6B7280", border: "#E5E7EB", accent: "#16A34A" };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, gap: 16 },
  title: { fontSize: 28, fontWeight: "800", color: C.text },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },

  searchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: C.border, gap: 10 },
  searchIcon: { fontSize: 16 },
  input: { flex: 1, fontSize: 15, color: C.text, padding: 0 },
  clearBtn: { fontSize: 14, color: C.muted, paddingHorizontal: 4 },
  scanButton: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.accent, justifyContent: "center", alignItems: "center" },

  sectionLabel: { fontSize: 16, fontWeight: "700", color: C.text, marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: { width: "47.5%", borderRadius: 16, overflow: "hidden" },
  gradient: { height: 100, padding: 14, justifyContent: "space-between" },
  cardIcon: { fontSize: 24 },
  cardLabel: { fontSize: 12, fontWeight: "700", color: "#fff", lineHeight: 16 },

  // Modal
  modalContainer: { flex: 1, backgroundColor: C.bg },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: "700", color: C.text },
  closeButton: { padding: 4 },
  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16, paddingHorizontal: 40 },
  permissionText: { fontSize: 16, color: C.muted, textAlign: "center", lineHeight: 24 },
  permissionButton: { marginTop: 8, backgroundColor: C.accent, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  permissionButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  cameraWrapper: { flex: 1 },
  camera: { flex: 1 },

  resultCard: { margin: 20, padding: 24, backgroundColor: C.surface, borderRadius: 16, alignItems: "center", gap: 8 },
  resultCardError: { borderWidth: 1, borderColor: "#FECACA" },
  resultTitle: { fontSize: 18, fontWeight: "800", color: C.text, marginTop: 4 },
  resultCode: { fontSize: 14, color: C.muted, textAlign: "center" },
  resultSubtitle: { fontSize: 14, color: C.muted, textAlign: "center" },
  resultActions: { width: "100%", gap: 8, marginTop: 8 },
  primaryButton: { backgroundColor: C.accent, borderRadius: 12, paddingVertical: 14, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  retryButton: { borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  retryButtonText: { color: C.accent, fontWeight: "600", fontSize: 14 },
});
