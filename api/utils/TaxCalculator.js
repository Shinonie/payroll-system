import { sssTableEE } from "../constant/SSSTableEE.js";
import { taxTables } from "../constant/TaxIncomeTable.js";
import { SSSTax, PagIbigTax, PhilHealthTax } from "./GetTax.js";

export const SSSEEContribution = async (monthlySalary) => {
  // Find the applicable row in the table based on monthlySalary
  const applicableRowEE = sssTableEE.find(
    (row) => monthlySalary >= row.range[0] && monthlySalary <= row.range[1]
  );

  const tax = await SSSTax();
  // If no applicable row is found, return an error message
  if (!applicableRowEE) {
    return "Error: Monthly salary is not within the specified range.";
  }

  //GET TAX MODEL AND GET THE CONTRIBUTION FIELD
  const eeEcContribution = applicableRowEE.monthlySalaryCredit * tax;
  const totalEEContribution = eeEcContribution + applicableRowEE.eeWisp;

  return totalEEContribution / 2;
};

export const PhilHealthContribution = async (monthlySalary) => {
  let premium;
  const tax = await PhilHealthTax();

  if (monthlySalary <= 10000) {
    premium = 250;
  } else if (monthlySalary > 10000 && monthlySalary <= 99999.99) {
    premium = (monthlySalary * tax) / 2;
    premium = premium / 2;
  } else {
    premium = 2500;
  }

  return premium;
};

export const PagIbigContribution = async () => {
  const tax = await PagIbigTax();
  return tax / 2;
};

export const IncomeTaxContribution = (monthlySalary) => {
  // Determine the frequency based on the monthly salary
  let frequency = "MONTHLY";
  // if (monthlySalary <= 21917) {
  //   frequency = "DAILY";
  // } else if (monthlySalary <= 153845) {
  //   frequency = "WEEKLY";
  // } else if (monthlySalary <= 333332) {
  //   frequency = "SEMI_MONTHLY";
  // } else {
  //   frequency = "MONTHLY";
  // }

  // Find the applicable tax bracket
  const applicableBracket = taxTables[frequency].find(
    (bracket) => monthlySalary <= bracket.range[1]
  );

  //GET TAX MODEL AND GET THE CONTRIBUTION FIELD
  const sssContribution = SSSEEContribution(monthlySalary);
  const philHealthContribution = PhilHealthContribution(monthlySalary);
  const pagIbigContribution = PagIbigContribution;
  const totalContributionDeductions =
    sssContribution + philHealthContribution + pagIbigContribution;

  // Calculate the taxable income
  const taxableIncome = monthlySalary - totalContributionDeductions;

  // Calculate the 15% over Compensation Level
  const compensationLevel = applicableBracket.range[0];
  const percentage =
    (monthlySalary - compensationLevel) * (applicableBracket?.percentage || 0);

  // Calculate the income tax
  const incomeTax = applicableBracket.tax + percentage;

  return {
    totalContributionDeductions,
    taxableIncome,
    incomeTax: incomeTax / 2,
  };
};
