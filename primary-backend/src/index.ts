import express from "express";
import cors from "cors";
import { userRouter } from "./routes/userRoutes/user";
import { zapRouter } from "./routes/zapRoutes/zapRoute";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Import cookie parser
dotenv.config();
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);
// app.use("/api/v1/zap",userzap)
// app.use("/api/v1/signup",userSignup)
app.listen(3000);
