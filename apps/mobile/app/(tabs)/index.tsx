import { useEffect, useState } from "react";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import type { Product, User } from "@tot/shared-types";
import { formatDate } from "@tot/shared-utils";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const [newProductName, setNewProductName] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const fetchData = () => {
    return Promise.all([
      fetch(`${API_URL}/api/products`).then((res) => res.json()),
      fetch(`${API_URL}/api/users`).then((res) => res.json()),
    ])
      .then(([productsData, usersData]) => {
        setProducts(productsData);
        setUsers(usersData);
        setLastRefreshed(new Date());
        setError(null);
      })
      .catch(() => setError("Could not reach the API. Is it running?"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  const handleAddProduct = () => {
    const name = newProductName.trim();
    if (!name) return;

    setAdding(true);
    setAddError(null);

    fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add product");
        return res.json();
      })
      .then((newProduct: Product) => {
        setProducts((prev) => [...prev, newProduct]);
        setNewProductName("");
      })
      .catch(() => setAddError("Could not add product. Try again."))
      .finally(() => setAdding(false));
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome Sherif!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Status bar: last updated + refresh button */}
      <ThemedView style={styles.toolbar}>
        <View style={styles.statusPill}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: error ? "#EF4444" : "#22C55E" },
            ]}
          />
          <ThemedText style={styles.statusText}>
            {loading
              ? "Refreshing…"
              : lastRefreshed
                ? `Updated ${formatDate(lastRefreshed, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}`
                : "Not loaded"}
          </ThemedText>
        </View>

        <Pressable
          onPress={handleRefresh}
          disabled={loading}
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.refreshButtonPressed,
            loading && styles.refreshButtonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
          )}
          <ThemedText style={styles.refreshButtonText}>Refresh</ThemedText>
        </Pressable>
      </ThemedView>

      {/* Error state */}
      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color="#B91C1C" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      {/* Products */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="cube-outline" size={18} color="#6366F1" />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Products
          </ThemedText>
          {!loading && (
            <View style={styles.countBadge}>
              <ThemedText style={styles.countBadgeText}>
                {products.length}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Add product form */}
        <View style={styles.addRow}>
          <TextInput
            value={newProductName}
            onChangeText={setNewProductName}
            placeholder="New product name..."
            placeholderTextColor="rgba(128,128,128,0.6)"
            style={styles.input}
            editable={!adding}
            onSubmitEditing={handleAddProduct}
            returnKeyType="done"
          />
          <Pressable
            onPress={handleAddProduct}
            disabled={adding || !newProductName.trim()}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.refreshButtonPressed,
              (adding || !newProductName.trim()) &&
                styles.refreshButtonDisabled,
            ]}
          >
            {adding ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="add" size={18} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
        {addError && (
          <ThemedText style={styles.addErrorText}>{addError}</ThemedText>
        )}

        {loading ? (
          <ActivityIndicator style={styles.loadingSpinner} />
        ) : !error && products.length === 0 ? (
          <ThemedText style={styles.emptyText}>No products yet.</ThemedText>
        ) : (
          !error &&
          products.map((p) => (
            <View key={p.id} style={styles.row}>
              <View style={styles.rowIcon}>
                <Ionicons name="pricetag-outline" size={16} color="#6366F1" />
              </View>
              <ThemedText style={styles.rowText}>{p.name}</ThemedText>
              <ThemedText style={styles.rowMeta}>#{p.id}</ThemedText>
            </View>
          ))
        )}
      </ThemedView>

      {/* Users */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="people-outline" size={18} color="#0EA5E9" />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Users
          </ThemedText>
          {!loading && (
            <View style={[styles.countBadge, styles.countBadgeBlue]}>
              <ThemedText style={styles.countBadgeText}>
                {users.length}
              </ThemedText>
            </View>
          )}
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loadingSpinner} />
        ) : !error && users.length === 0 ? (
          <ThemedText style={styles.emptyText}>No users yet.</ThemedText>
        ) : (
          !error &&
          users.map((u, i) => (
            <View key={i} style={styles.row}>
              <View style={[styles.rowIcon, styles.rowIconBlue]}>
                <Ionicons name="person-outline" size={16} color="#0EA5E9" />
              </View>
              <ThemedText style={styles.rowText}>{u.name}</ThemedText>
            </View>
          ))
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },

  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    opacity: 0.6,
  },

  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#6366F1",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  refreshButtonPressed: {
    opacity: 0.8,
  },
  refreshButtonDisabled: {
    backgroundColor: "#A5A6F6",
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 13,
    flex: 1,
  },

  section: {
    borderRadius: 16,
    padding: 14,
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(128,128,128,0.25)",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    flex: 1,
  },
  countBadge: {
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countBadgeBlue: {
    backgroundColor: "#E0F2FE",
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
  },

  addRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(128,128,128,0.35)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },
  addErrorText: {
    color: "#B91C1C",
    fontSize: 12,
    marginBottom: 6,
  },

  loadingSpinner: {
    marginVertical: 12,
  },
  emptyText: {
    opacity: 0.5,
    fontSize: 13,
    paddingVertical: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(128,128,128,0.15)",
  },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  rowIconBlue: {
    backgroundColor: "#E0F2FE",
  },
  rowText: {
    flex: 1,
    fontSize: 14,
  },
  rowMeta: {
    fontSize: 12,
    opacity: 0.4,
  },
});
