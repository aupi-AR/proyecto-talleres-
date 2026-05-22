import { StyleSheet, Text, View } from "react-native";

export default function FavoritosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>♥</Text>
      <Text style={styles.title}>Favorites</Text>
      <Text style={styles.subtitle}>
        Products you save will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F5",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 32,
  },
  icon: {
    fontSize: 52,
    color: "#16A34A",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
});
