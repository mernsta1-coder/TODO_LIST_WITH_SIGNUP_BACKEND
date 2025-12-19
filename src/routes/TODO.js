import express from "express";
import {saveTodo,deleteTodo,deleteAllTodo,updateTodo,getTodos} from'../controllers/TODO.js'
import authMiddleware from "../middlewares/authMiddleware.js"
 const router = express.Router();

router.post("/save",authMiddleware,saveTodo);
router.delete("/delete/:id",authMiddleware,deleteTodo);
router.delete("/delete-all",authMiddleware,deleteAllTodo);
router.put("/update/:id",authMiddleware,updateTodo);
router.get("/get",authMiddleware,getTodos);
 export default router

