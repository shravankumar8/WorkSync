










import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt"; // For password hashing

dotenv.config();

const prisma = new PrismaClient(); // Keep variable names consistent with casing conventions
const router = Router();

// API route: /api/v1/trigger/available
router.get("/available", async (req, res) => {
  try {
    const availableAction = await prisma.availableAction.findMany({});
    if (availableAction.length === 0) {
      return res.status(404).json({ message: "No triggers available" });
    }
    res.status(200).json({ availableAction });
  } catch (error) {
    console.error("Error fetching available triggers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export the router
export const actionRouter = router;
