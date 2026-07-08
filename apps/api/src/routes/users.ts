import { Router } from "express";
import type { User } from "@tot/shared-types";

const router = Router();

const users: User[] = [{ name: "Sherif" }];

router.get("/", (_req, res) => {
  res.json(users);
});

export default router;
