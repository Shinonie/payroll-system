import Adjustment from "../models/AdjustmentModel.js";

export const getAllAdjustments = async (req, res) => {
  try {
    // Fetch all adjustments from the database
    const adjustments = await Adjustment.find().populate({
      path: "employeeID",
      select: "fullname",
    });

    // Send the adjustments as a response
    res.status(200).json(adjustments);
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ message: error.message });
  }
};
