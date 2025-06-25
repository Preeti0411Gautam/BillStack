import UserModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ===================== SIGN UP ===================== //
export const signUp = async (req, res, next) => {
  try {
    const { username, name, email, password } = req.body;
    if (!username || !name || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return next(errorHandler(400, "User already exists"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new UserModel({
      username,
      name,
      email,
      password: hashedPassword,
    });

    try {
      await newUser.save();
    } catch (mongooseErr) {
      if (mongooseErr.name === "ValidationError") {
        return next(
          errorHandler(
            400,
            Object.values(mongooseErr.errors)[0].message || "Validation error"
          )
        );
      }
      return next(mongooseErr);
    }

    const token = generateToken(newUser._id);
    const csrfToken = uuidv4();

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000,
      })
      .cookie("csrf_token", csrfToken, {
        httpOnly: false,
        secure: true,
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000,
      });

    const { password: _, ...userData } = newUser._doc;
    res
      .status(201)
      .json({ success: true, message: "SignUp successful", user: userData });
  } catch (err) {
    next(err);
  }
};

// ===================== LOGIN ===================== //
export const login = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const validUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid credentials"));

    const token = generateToken(validUser._id);
    const csrfToken = uuidv4();

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000,
      })
      .cookie("csrf_token", csrfToken, {
        httpOnly: false,
        secure: true,
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000,
      });

    const { password: _, ...userData } = validUser._doc;
    res
      .status(200)
      .json({ success: true, message: "Login successful", user: userData });
  } catch (err) {
    next(err);
  }
};

// ===================== SIGNOUT ===================== //
export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "Strict",
        secure: true,
      })
      .clearCookie("csrf_token", {
        sameSite: "Strict",
        secure: true,
      })
      .status(200)
      .json({ success: true, message: "Signout successful" });
  } catch (err) {
    next(err);
  }
};
