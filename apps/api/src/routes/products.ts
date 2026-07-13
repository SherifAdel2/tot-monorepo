import { Router } from "express";
import type { Product } from "@tot/shared-types";
import { formatDate } from "@tot/shared-utils";

const router = Router();

const products: Product[] = [
  { id: 1, name: "Keyboard" },
  { id: 2, name: "Monitor" },
];

router.get("/", (_req, res) => {
  res.json(products);
});

router.post("/", (req, res) => {
  const { name } = req.body;

  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Product name is required." });
  }

  const newProduct: Product = {
    id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    name: name.trim(),
  };

  products.push(newProduct);

  console.log(
    `[products] Created "${newProduct.name}" (id: ${newProduct.id}) at ${formatDate(
      new Date(),
      {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      },
    )}`,
  );

  res.status(201).json(newProduct);
});

export default router;
