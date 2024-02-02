import express from "express";
const router = express.Router();
import {
  createTaxEntry,
  getAllTaxEntries,
  getTaxEntryById,
  updateTaxEntryById,
  deleteTaxEntryById,
} from "../controllers/TaxesController.js";
import { isAdmin } from "../middlewares/permission.js";

router.post("/taxes", createTaxEntry);
router.get("/taxes", getAllTaxEntries);
router.get("/taxes/:id", getTaxEntryById);
router.put("/taxes/:id", updateTaxEntryById);
router.delete("/taxes/:id", deleteTaxEntryById);

export default router;
