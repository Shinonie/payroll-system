import TaxesModel from "../models/TaxesModel.js";

export const SSSTax = async () => {
  try {
    const taxes = await TaxesModel.findOne();

    const { SSS } = taxes;

    return SSS;
  } catch (error) {
    console.error("Error retrieving taxes:", error);
  }
};
export const PhilHealthTax = async () => {
  try {
    const taxes = await TaxesModel.findOne();

    const { PhilHealth } = taxes;

    return PhilHealth;
  } catch (error) {
    console.error("Error retrieving taxes:", error);
  }
};
export const PagIbigTax = async () => {
  try {
    const taxes = await TaxesModel.findOne();

    const { PagIbig } = taxes;

    return PagIbig;
  } catch (error) {
    console.error("Error retrieving taxes:", error);
  }
};
