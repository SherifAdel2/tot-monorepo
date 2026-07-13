import { useEffect, useState } from "react";
import { Button, Card, Input } from "@tot/ui";
import type { Product, User } from "@tot/shared-types";
import { formatDate } from "@tot/shared-utils";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProductName, setNewProductName] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchData = () => {
    return Promise.all([
      fetch(`${API_URL}/api/products`).then((res) => res.json()),
      fetch(`${API_URL}/api/users`).then((res) => res.json()),
    ])
      .then(([productsData, usersData]) => {
        setProducts(productsData);
        setUsers(usersData);
        setLastRefreshed(new Date());
      })
      .catch(() => setError("Could not reach the API. Is it running?"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    fetchData();
  };

  const handleAddProduct = () => {
    const name = newProductName.trim();
    if (!name) return;

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
      .catch(() => setError("Could not add product. Try again."));
  };
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">tot / admin</h1>
            <p className="text-sm text-gray-500">
              Management dashboard
              {lastRefreshed && (
                <span className="ml-2 text-gray-400">
                  · Last refreshed{" "}
                  {formatDate(lastRefreshed, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </p>
          </div>
          <Button onClick={handleRefresh}>Refresh</Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50 text-red-700">{error}</Card>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {loading ? "–" : products.length}
            </p>
            <p className="text-sm text-gray-500">Products</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {loading ? "–" : users.length}
            </p>
            <p className="text-sm text-gray-500">Users</p>
          </Card>
        </div>

        <Card>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">Products</h2>

          <div className="mb-3 flex gap-2">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="mb-4 flex gap-2">
            <Input
              placeholder="New product name..."
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddProduct}>Add</Button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No products found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2">ID</th>
                  <th className="py-2">Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 text-gray-700"
                  >
                    <td className="py-2">{product.id}</td>
                    <td className="py-2">{product.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">Users</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2">Name</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 text-gray-700"
                  >
                    <td className="py-2">{user.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}
