import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

dotenv.config();

/* ========================= REGISTER ========================= */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1️⃣ Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // 2️⃣ Check existing user
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Role protection (important 🔒)
    const userRole =
      role && role === "admin" ? "admin" : "user";

    // 5️⃣ Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // 6️⃣ Response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/* ========================= LOGIN ========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4️⃣ JWT token
  const token = jwt.sign(
      { id: user._id, role: user.role }, // include role here
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    // 5️⃣ Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};
