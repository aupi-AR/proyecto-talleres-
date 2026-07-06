// Barra de navegación inferior
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";

const TABS = [
  {
    label: "Home",
    route: "/home",
    icon: require("@/assets/images/tabIcons/home.png"),
  },
  {
    label: "Search",
    route: "/search",
    icon: require("@/assets/images/tabIcons/explore.png"),
  },
  {
    label: "Favorites",
    route: "/favs",
    icon: require("@/assets/images/tabIcons/home.png"),
  },
] as const;

export function BottomTabBar() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: scheme === "dark" ? colors.background : "#F5EDE0",
          paddingBottom: Math.max(insets.bottom, 8),
          borderTopColor: scheme === "dark" ? "#2C2C2E" : "#E5E7EB",
        },
      ]}
    >
      {TABS.map((tab) => (
        <Pressable
          key={tab.route}
          style={({ pressed }) => [styles.tab, pressed && { opacity: 0.5 }]}
          onPress={() => router.navigate(tab.route as any)}
        >
          <Image
            source={tab.icon}
            style={[styles.icon, { tintColor: colors.text }]}
          />
          <Text style={[styles.label, { color: colors.text }]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 4,
    gap: 3,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
  },
});
