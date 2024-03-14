import TaxesModel from "../models/TaxesModel.js";

const createTaxEntry = async (req, res) => {
  try {
    const { SSS, PhilHealth, PagIbig } = req.body;

    const newTaxEntry = new TaxesModel({
      SSS,
      PhilHealth,
      PagIbig,
    });

    const savedTaxEntry = await newTaxEntry.save();

    return res.status(201).json(savedTaxEntry);
  } catch (error) {
    console.error("Error creating tax entry:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllTaxEntries = async (req, res) => {
  try {
    const taxEntries = await TaxesModel.find();
    return res.json(taxEntries);
  } catch (error) {
    console.error("Error fetching tax entries:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTaxEntryById = async (req, res) => {
  try {
    const taxEntry = await TaxesModel.findById(req.params.id);

    if (!taxEntry) {
      return res.status(404).json({ error: "Tax entry not found" });
    }

    return res.json(taxEntry);
  } catch (error) {
    console.error("Error fetching tax entry by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTaxEntryById = async (req, res) => {
  try {
    const { SSS, PhilHealth, PagIbig } = req.body;

    const updatedTaxEntry = await TaxesModel.findByIdAndUpdate(
      req.params.id,
      { SSS, PhilHealth, PagIbig },
      { new: true }
    );

    if (!updatedTaxEntry) {
      return res.status(404).json({ error: "Tax entry not found" });
    }

    return res.json(updatedTaxEntry);
  } catch (error) {
    console.error("Error updating tax entry by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTaxEntryById = async (req, res) => {
  try {
    const deletedTaxEntry = await TaxesModel.findByIdAndDelete(req.params.id);

    if (!deletedTaxEntry) {
      return res.status(404).json({ error: "Tax entry not found" });
    }

    return res.json({ message: "Tax entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting tax entry by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  createTaxEntry,
  getAllTaxEntries,
  getTaxEntryById,
  updateTaxEntryById,
  deleteTaxEntryById,
};
