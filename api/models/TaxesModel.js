import mongoose from "mongoose";

const taxesModelSchema = new mongoose.Schema(
  {
    SSS: { type: Number, required: true },
    PhilHealth: { type: Number, required: true },
    PagIbig: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const TaxesModel = mongoose.model("Taxes", taxesModelSchema);

export default TaxesModel;
