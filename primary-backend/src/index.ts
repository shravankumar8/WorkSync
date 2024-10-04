import express from "express";
import cors from "cors";
import { userRouter } from "./routes/userRoutes/user";
import { zapRouter } from "./routes/zapRoutes/zapRoute";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Import cookie parser
import { triggerRouter } from "./routes/triggerRoutes/triggerRouter";
import { actionRouter } from "./routes/actionRoutes/actionRouter";
dotenv.config();
const PORT=process.env.PORT || 3001
const app = express();
const corsOptions = {
  origin: "http://localhost:3000", // or the specific frontend URL
  credentials: true, // if you are dealing with cookies or sessions
  optionsSuccessStatus: 200, // legacy browser support
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);
// app.use("/api/v1/zap",userzap)
// app.use("/api/v1/signup",userSignup)
app.listen(PORT, () => {
  console.log("\x1b[32m%s\x1b[0m", "Server is running on port 3001");
});
