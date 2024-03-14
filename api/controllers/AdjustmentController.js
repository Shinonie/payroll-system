import Adjustment from "../models/AdjustmentModel.js";

export const getAllAdjustments = async (req, res) => {
  try {
    // Fetch all adjustments from the database
    const adjustments = await Adjustment.find().populate({
      path: "employeeID",
      select: "_id firstName middleName lastName", // Include _id field
    });

    // Map adjustments to include the virtual fullname field
    const adjustedResults = adjustments.map((adj) => {
      // Calculate fullname from populated fields
      const fullName =
        adj.employeeID.firstName +
        " " +
        adj.employeeID.middleName +
        " " +
        adj.employeeID.lastName;
      return {
        ...adj.toObject(), // Convert mongoose document to plain JavaScript object
        employeeID: {
          ...adj.employeeID.toObject(),
          fullname: fullName,
        }, // Add fullname field
      };
    });

    // Send the adjusted results as a response
    res.status(200).json(adjustedResults);
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ message: error.message });
  }
};
