import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token ;

  if (!token) {
    return next(errorHandler(401, "Authentication token required"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(errorHandler(403, "Invalid or expired token"));
    }

    req.user = decoded; // You now have access to req.user.id in controllers
    next();
  });
};
