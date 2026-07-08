import { useEffect, useState } from "react";
import { Button, Card, Input } from "@tot/ui";
import type { Product, User } from "@tot/shared-types";

const API_URL = "http://localhost:4000";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    return Promise.all([
      fetch(`${API_URL}/api/products`).then((res) => res.json()),
      fetch(`${API_URL}/api/users`).then((res) => res.json()),
    ])
      .then(([productsData, usersData]) => {
        setProducts(productsData);
        setUsers(usersData);
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">tot / website</h1>
          <Button onClick={handleRefresh}>Refresh</Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50 text-red-700">{error}</Card>
        )}

        <Card>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">Products</h2>
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full"
          />

          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No products found.</p>
          ) : (
            <ul className="space-y-2">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2 text-sm"
                >
                  <span className="text-gray-700">{product.name}</span>
                  <span className="text-xs text-gray-400">#{product.id}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">Users</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <ul className="space-y-2">
              {users.map((user, i) => (
                <li
                  key={i}
                  className="rounded-md border border-gray-100 px-3 py-2 text-sm text-gray-700"
                >
                  {user.name}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
