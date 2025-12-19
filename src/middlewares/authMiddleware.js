import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;      // attach user ID
    req.role = decoded.role;      // attach role!
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token is invalid or expired" });
  }
};

export default authMiddleware;
