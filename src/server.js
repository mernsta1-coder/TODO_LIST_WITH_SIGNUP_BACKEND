import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import adminRoutes from "./routes/admin.js";
import todoRoutes from "./routes/TODO.js";
import userRoutes from "./routes/user.js";

// Middleware
import errorHandler from "./middlewares/errorMiddleware.js";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("PORT:", process.env.PORT);
console.log("MONGO_URL:", process.env.MONGO_URL);

const app = express();

/* ------------------ MIDDLEWARES ------------------ */
app.use(cors({
  origin: ["http://localhost:5173","https://your-vercel-frontend-url.vercel.app"],
  credentials: true,
}));

// ✅ Body parser middleware: must be BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------ ROUTES ------------------ */
app.use("/api/admin", adminRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/user", userRoutes);

/* ------------------ ERROR HANDLER ------------------ */
app.use(errorHandler);

/* ------------------ ENV VARIABLES CHECK ------------------ */
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ MONGO_URL is not defined in .env file!");
  process.exit(1);
}

/* ------------------ DATABASE CONNECTION ------------------ */
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* ------------------ START SERVER ------------------ */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
