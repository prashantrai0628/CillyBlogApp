import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; // Ensure this is imported to fetch user details

// Authentication Middleware
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find user by ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // Attach user details to the request object for further use
    next();
  } catch (error) {
    console.error("Error in Authentication Middleware:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Authorization Middleware
export const isAdmin = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          error: `User with role '${req.user.role}' is not authorized`,
        });
      }
      next();
    } catch (error) {
      console.error("Error in Authorization Middleware:", error.message);
      return res.status(403).json({ error: "Authorization failed" });
    }
  };
};

