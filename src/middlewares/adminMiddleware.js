const adminMiddleware = (req, res, next) => {
    console.log(req.role,"======")
  try {
    // role is already attached from auth middleware (JWT)
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access denied",
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin authorization failed",
    });
  }
};

export default adminMiddleware;
