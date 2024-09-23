import { Router } from "express";
import { authMiddleware } from "../middlewares/userAuth";
import { signinSchema, signupSchema } from "../../types/types";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt"; // For password hashing

dotenv.config();
const router = Router();
export const prismaClient = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "provenworks";

router.post("/signin", async (req, res) => {
  try {
    const parsedData = await signinSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: "Invalid inputs" });
    }
    const { email, password } = parsedData.data;
    const existingUser = await prismaClient.user.findFirst({
      where: { email: email },
      select: { password: true, email: true, id: true },
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Bad Login credentials , not user found" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    

    const token = jwt.sign(
      { type: "user", id: existingUser.id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
res.cookie("token", token, {
  httpOnly: true, // Makes sure the cookie is not accessible via JavaScript
  secure: process.env.NODE_ENV === "production", // Ensure secure in production (HTTPS)
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
});

    res.status(200).json({
      message: "User login succesfull",
      user: { token, id: existingUser.id },
    });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const parsedData = await signupSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: "Invalid inputs" });
    }

    const { email, password, name } = parsedData.data;

    const existingUser = await prismaClient.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword, // Store hashed password
        name,
      },
    });

    const token = jwt.sign(
      { type: "user", id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "User created successfully",
      user: { token, id: newUser.id },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Protected user route
router.get("/user", authMiddleware, (req, res) => {
  console.log("hola");
  res.json({ message: "Access granted to protected route" });
});

export const userRouter = router;
