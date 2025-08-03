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




export const updateBillPreferences = async (req, res) => {
  try {
    const { preferences } = req.body; // Incoming data from frontend
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { billPreferences: preferences }, // Update the correct field in the database
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: "Preferences updated", user });
  } catch (err) {
    res.status(500).json({ error: "Unable to update preferences" });
  }
};


export const getBillPreferences = async (req, res) => {
  try {
    const { userId } = req.params;

    // Correctly select the 'billPreferences' field from the user document
    const user = await UserModel.findById(userId).select('billPreferences');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the 'billPreferences' field, using an empty array as a fallback
    res.status(200).json({ preferences: user.billPreferences || [] });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
