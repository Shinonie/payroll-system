import Leaves from "../models/LeaveModel.js";

const createLeave = async (req, res) => {
  const { employeeID, leaveType, startDate, endDate, totalDays } = req.body;
  try {
    const pendingLeave = await Leaves.findOne({
      employeeID,
      status: "PENDING",
    });
    if (pendingLeave) {
      return res.status(400).json({
        message: "There's already a pending leave request for this employee",
      });
    }

    const newLeave = new Leaves({
      employeeID,
      leaveType,
      startDate,
      endDate,
      totalDays,
    });

    await newLeave.save();

    res
      .status(201)
      .json({ message: "Leave request created successfully", leave: newLeave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLeaveById = async (req, res) => {
  const employeeID = req.params.id;

  try {
    const leave = await Leaves.find({ employeeID });

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json(leave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const allLeaves = await Leaves.find();

    res.status(200).json(allLeaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateLeaveDetails = async (req, res) => {
  const leaveId = req.params.id;
  const { leaveType, startDate, endDate, totalDays } = req.body;

  try {
    const leave = await Leaves.findByIdAndUpdate(
      leaveId,
      { leaveType, startDate, endDate, totalDays },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res
      .status(200)
      .json({ message: "Leave details updated successfully", leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const approveLeave = async (req, res) => {
  const leaveId = req.params.id;

  try {
    const leave = await Leaves.findByIdAndUpdate(
      leaveId,
      { status: true },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res
      .status(200)
      .json({ message: "Leave request approved successfully", leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectLeave = async (req, res) => {
  const leaveId = req.params.id;

  try {
    const leave = await Leaves.findByIdAndUpdate(
      leaveId,
      { status: false },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res
      .status(200)
      .json({ message: "Leave request rejected successfully", leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteLeave = async (req, res) => {
  const leaveId = req.params.id;

  try {
    const leave = await Leaves.findByIdAndDelete(leaveId);

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json({ message: "Leave request deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createLeave,
  getLeaveById,
  getAllLeaves,
  updateLeaveDetails,
  approveLeave,
  rejectLeave,
  deleteLeave,
};
