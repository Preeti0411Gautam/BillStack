import UserModel from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You can only update your own account"));
    }

    // Hash password if being updated
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      {
        new: true,
        runValidators: true, 
      }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(errorHandler(400, Object.values(err.errors)[0].message));
    }
    next(err);
  }
};

// ===================== DELETE USER ===================== //
export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You can only delete your own account"));
    }

    const deleted = await UserModel.findByIdAndDelete(req.params.userId);
    if (!deleted) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    next(err);
  }
};
