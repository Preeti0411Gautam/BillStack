import Bill from "../models/billModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const uploadBill = async (req, res) => {
  try {
    console.log(req.body);
    const {
      userId,
      billType,
      amount,
      dueDate,
      billGeneratedDate,
      description,
      paymentStatus,
    } = req.body;
    console.log("Received file:", req.file);

    const billImageLocalPath = req.file?.path;

    if (!billImageLocalPath) {
      return res.status(400).json({
        success: false,
        message: "Bill Image/file is missing",
      });
    }

    const billImage = await uploadOnCloudinary(billImageLocalPath);

    if (!billImage?.url) {
      fs.unlinkSync(billImageLocalPath); // Ensure local file cleanup
      return res.status(400).json({
        success: false,
        message: "Error while uploading the bill file.",
      });
    }

    if (
      !billType ||
      !amount ||
      !dueDate ||
      !billGeneratedDate ||
      !userId ||
      !paymentStatus
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all the required details (billType, amount, dueDate,billGeneratedDate, billImage, userId , paymentStatus).",
      });
    }

    if (billType === "Other" && !description) {
      return res.status(400).json({
        success: false,
        message: "Description is required for 'Other' bill type.",
      });
    }

    const newBill = new Bill({
      userId,
      billType,
      amount,
      dueDate,
      billGeneratedDate,
      description,
      billImage: billImage.url,
      paymentStatus,
    });

    await newBill.save();
    fs.unlinkSync(billImageLocalPath); // Remove local file after successful upload

    return res.status(201).json({
      success: true,
      message: "Bill added successfully.",
      bill: newBill,
    });
  } catch (error) {
    console.error("Error saving bill to the database:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getBillByType = async (req, res) => {
  try {
    const { billType } = req.params;
    const { userId } = req.query;

    if (!billType || !userId) {
      return res.status(400).json({
        success: false,
        message: "Bill type and user ID are required.",
      });
    }

    const bills = await Bill.find({ billType, userId });

    if (bills.length === 0) {
      return res.status(200).json({
        success: true,
        bills: [],
        message: "No bills found for this type.",
      });
    }

    return res.status(200).json({
      success: true,
      bills,
    });
  } catch (error) {
    console.error("Error fetching bills by type:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//by userId
export const getBill = async (req, res) => {
  try {
    const { userId } = await req.params;
    if (!userId) {
      return res.json({
        success: false,
        message: "No bills found with this user or this user doesn't exist",
        data: [],
      });
    }

    const bills = await Bill.find({ userId });
    console.log(bills);

    res.status(200).json({
      success: true,
      message: bills.length ? "Successfully fetched bills" : "No bills found",
      data: bills,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server Error...",
      data: [],
    });
  }
};

//delete bill by bill id
export const deleteBill = async (req, res) => {
  try {
    const billId = await req.params.id;
    if (!billId) {
      return res.json({
        success: false,
        message: "Invalid billId , Pleasse provide valid billId ..",
      });
    }

    const data = await Bill.findById(billId);
    console.log(data);
    if (!data) {
      return res.json({
        success: false,
        message: "No bill found with this id or invalid bill id",
      });
    }

    await Bill.findByIdAndDelete(billId);

    res.status(200).json({
      success: true,
      message: "Bill deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server Error...",
    });
  }
};

export const togglePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findById(id);
    if (!bill) {
      return res
        .status(404)
        .json({ success: false, message: "Bill not found" });
    }

    bill.paymentStatus = !bill.paymentStatus;
    await bill.save();

    return res.status(200).json({
      success: true,
      message: `Bill marked as ${bill.paymentStatus ? "Paid" : "Unpaid"}`,
      updatedBill: bill,
    });
  } catch (error) {
    console.error("Error toggling status:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// export const updateBillFile = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const existingBill = await Bill.findById(id);
//     if (!existingBill) {
//       return res.status(404).json({ success: false, message: "Bill not found" });
//     }

//     const localPath = req.file?.path;
//     if (!localPath) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const uploaded = await uploadOnCloudinary(localPath);
//     fs.unlinkSync(localPath);

//     if (!uploaded?.url) {
//       return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
//     }

//     existingBill.billImage = uploaded.url;
//     await existingBill.save();

//     return res.status(200).json({ success: true, message: "Bill updated", updatedBill: existingBill });
//   } catch (error) {
//     console.error("Error updating bill:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      billType,
      amount,
      dueDate,
      billGeneratedDate,
      description,
      paymentStatus,
    } = req.body;

    const existingBill = await Bill.findById(id);
    if (!existingBill) {
      return res
        .status(404)
        .json({ success: false, message: "Bill not found" });
    }

    // Update basic fields if provided
    if (billType) existingBill.billType = billType;
    if (amount) existingBill.amount = amount;
    if (dueDate) existingBill.dueDate = dueDate;
    if (billGeneratedDate) existingBill.billGeneratedDate = billGeneratedDate;
    if (description !== undefined) existingBill.description = description;
    if (paymentStatus !== undefined) existingBill.paymentStatus = paymentStatus;

    // Handle file upload if present
    const localPath = req.file?.path;
    if (localPath) {
      const uploaded = await uploadOnCloudinary(localPath);
      fs.unlinkSync(localPath);
      if (uploaded?.url) {
        existingBill.billImage = uploaded.url;
      } else {
        return res
          .status(500)
          .json({ success: false, message: "Cloudinary upload failed" });
      }
    }

    await existingBill.save();

    return res.status(200).json({
      success: true,
      message: "Bill updated successfully",
      updatedBill: existingBill,
    });
  } catch (error) {
    console.error("Error updating bill:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getBillsByMonth = async (req, res) => {
  try {
    const { userId, month, year, billType } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const filter = {
      userId,
    };

    // Optional filters
    if (billType && billType !== "All") {
      filter.billType = billType;
    }

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59); // End of the month
      filter.dueDate = { $gte: start, $lte: end };
    }

    const bills = await Bill.find(filter);
    return res.status(200).json({
      success: true,
      bills,
      message: bills.length ? "Bills fetched." : "No bills found for this month/type.",
    });
  } catch (error) {
    console.error("Error in getBillsByMonth:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};


export const getBillYearsByUser = async (req, res) => {

    const { userId } = req.params;
  try {
    const bills = await Bill.find({ userId });

    if (!bills.length) {
      return res.json({ years: [] }); // no bills found
    }

    const yearSet = new Set(
      bills.map((bill) => new Date(bill.dueDate).getFullYear())
    );

    const years = Array.from(yearSet).sort(); // convert to array and sort

    res.json({ years });
  } catch (err) {
    console.error("Error fetching bill years:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
