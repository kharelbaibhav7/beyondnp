import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      // Check if email is verified
      if (!req.user.isEmailVerified) {
        res.status(403);
        throw new Error(
          "Please verify your email before accessing this resource"
        );
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `User role ${req.user.role} is not authorized to access this route`
      );
    }

    next();
  };
};
