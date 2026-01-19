// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import adminRoutes from "./routes/admin.js";
import todoRoutes from "./routes/todo.js";
import userRoutes from "./routes/user.js";

// Middleware
import errorHandler from "./middlewares/errorMiddleware.js";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// Check required ENV
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL is not defined!");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined!");
  process.exit(1);
}

const app = express();

/* ------------------ MIDDLEWARES ------------------ */

// Enable CORS
app.use(cors({
  origin: [
    "http://localhost:5173",                     // Local frontend
    "https://to-do-list-tau-brown.vercel.app"  // Deployed frontend
  ],
  credentials: true
}));

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------ ROUTES ------------------ */
app.use("/api/admin", adminRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/user", userRoutes);

/* ------------------ ERROR HANDLER ------------------ */
app.use(errorHandler);

/* ------------------ DATABASE CONNECTION ------------------ */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* ------------------ START SERVER ------------------ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
