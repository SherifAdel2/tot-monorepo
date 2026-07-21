<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Product, User } from "@tot/shared-types";
import { formatDate } from "@tot/shared-utils";

const API_URL = import.meta.env.VITE_API_URL;

const products = ref<Product[]>([]);
const users = ref<User[]>([]);
const search = ref("");
const loading = ref(true);
const error = ref<string | null>(null);
const newProductName = ref("");
const lastRefreshed = ref<Date | null>(null);

async function fetchData() {
  try {
    const [productsRes, usersRes] = await Promise.all([
      fetch(`${API_URL}/api/products`),
      fetch(`${API_URL}/api/users`),
    ]);
    products.value = await productsRes.json();
    users.value = await usersRes.json();
    lastRefreshed.value = new Date();
  } catch {
    error.value = "Could not reach the API. Is it running?";
  } finally {
    loading.value = false;
  }
}

function handleRefresh() {
  loading.value = true;
  error.value = null;
  fetchData();
}

async function handleAddProduct() {
  const name = newProductName.value.trim();
  if (!name) return;

  try {
    const res = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to add product");
    const newProduct: Product = await res.json();
    products.value.push(newProduct);
    newProductName.value = "";
  } catch {
    error.value = "Could not add product. Try again.";
  }
}

const filteredProducts = computed(() =>
  products.value.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
);

onMounted(fetchData);
</script>

<template>
  <div class="page">
    <div class="container">
      <div class="header">
        <div>
          <h1>tot / vue-demo</h1>
          <p class="subtitle">
            Management dashboard
            <span v-if="lastRefreshed" class="refreshed">
              · Last refreshed
              {{
                formatDate(lastRefreshed, {
                  hour: "numeric",
                  minute: "2-digit",
                })
              }}
            </span>
          </p>
        </div>
        <tot-button label="Refresh" @click="handleRefresh" />
      </div>

      <div v-if="error" class="error-card">{{ error }}</div>

      <div class="stats-grid">
        <div class="tot-card stat-card">
          <p class="stat-number">{{ loading ? "–" : products.length }}</p>
          <p class="stat-label">Products</p>
        </div>
        <div class="tot-card stat-card">
          <p class="stat-number">{{ loading ? "–" : users.length }}</p>
          <p class="stat-label">Users</p>
        </div>
      </div>

      <div class="tot-card">
        <h2>Products</h2>

        <tot-input
          placeholder="Search products..."
          :value="search"
          :onChange="(v: string) => (search = v)"
        />

        <div class="add-row">
          <tot-input
            placeholder="New product name..."
            :value="newProductName"
            :onChange="(v: string) => (newProductName = v)"
          />
          <tot-button label="Add" @click="handleAddProduct" />
        </div>

        <p v-if="loading" class="muted">Loading...</p>
        <p v-else-if="filteredProducts.length === 0" class="muted">
          No products found.
        </p>
        <table v-else>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tot-card">
        <h2>Users</h2>
        <p v-if="loading" class="muted">Loading...</p>
        <table v-else>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, i) in users" :key="i">
              <td>{{ user.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  width: 100%;
  background: #f3f4f6;
  padding: 2.5rem clamp(1rem, 4vw, 4rem);
  box-sizing: border-box;
}
.container {
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
.subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0;
}
.refreshed {
  color: #9ca3af;
  margin-left: 0.5rem;
}
.error-card {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 0.75rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
.stat-card {
  text-align: center;
}
.stat-number {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}
h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.75rem;
}
.add-row {
  display: flex;
  gap: 0.5rem;
  margin: 0.75rem 0 1rem;
}
.muted {
  font-size: 0.875rem;
  color: #6b7280;
}
table {
  width: 100%;
  font-size: 0.875rem;
  border-collapse: collapse;
}
th {
  text-align: left;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
}
td {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
}
</style>
