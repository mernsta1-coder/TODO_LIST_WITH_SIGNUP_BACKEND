import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { getAllUsers, getUserById, deleteUser } from "../controllers/admin.js";

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, adminMiddleware, getUserById);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;
