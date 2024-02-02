import Deduction from "../models/DeductionModel.js";

const getDeductionById = async (req, res) => {
  const deductionId = req.params.id;

  try {
    const deduction = await Deduction.findById(deductionId);

    if (!deduction) {
      return res.status(404).json({ message: "Deduction record not found" });
    }

    res.status(200).json(deduction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateDeduction = async (req, res) => {
  const deductionId = req.params.id;
  const { SSSLoan, PagibigLoan } = req.body;

  try {
    const deduction = await Deduction.findByIdAndUpdate(
      deductionId,
      { SSSLoan, PagibigLoan },
      { new: true }
    );

    if (!deduction) {
      return res.status(404).json({ message: "Deduction record not found" });
    }

    res
      .status(200)
      .json({ message: "Deduction record updated successfully", deduction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteDeduction = async (req, res) => {
  const deductionId = req.params.id;

  try {
    const deduction = await Deduction.findByIdAndDelete(deductionId);

    if (!deduction) {
      return res.status(404).json({ message: "Deduction record not found" });
    }

    res.status(200).json({ message: "Deduction record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getDeductionById, updateDeduction, deleteDeduction };
