import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { FavoritesProvider } from "@/context/favorites";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 5 * 60 * 1000 },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Pinta el fondo de la ventana del OS para que no aparezca
    // el espacio blanco entre la app y los botones de Android.
    SystemUI.setBackgroundColorAsync(
      colorScheme === "dark" ? "#000000" : "#F5EDE0"
    );
  }, [colorScheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <AnimatedSplashOverlay />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="categorias/[nombre]" options={{ headerShown: true }} />
            <Stack.Screen name="ficha/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  );
}
