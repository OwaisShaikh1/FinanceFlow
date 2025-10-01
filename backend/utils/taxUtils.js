const TAX_SLABS = {
  old: [
    { upto: 250000, rate: 0 },
    { upto: 500000, rate: 0.05 },
    { upto: 1000000, rate: 0.2 },
    { upto: null, rate: 0.3 },
  ],
  new: [
    { upto: 300000, rate: 0 },
    { upto: 600000, rate: 0.05 },
    { upto: 900000, rate: 0.1 },
    { upto: 1200000, rate: 0.15 },
    { upto: 1500000, rate: 0.2 },
    { upto: null, rate: 0.3 },
  ],
};

const CESS_RATE = 0.04;
const STANDARD_DEDUCTION = 50000; // for salaried/pensioner

function calculateTotalDeductions(deductions = {}, regime, isSalaried = false) {
  if (regime === "new") {
    // New regime allows only standard deduction (and some rare cases like NPS employer)
    return isSalaried ? STANDARD_DEDUCTION : 0;
  }

  // Old regime caps
  const capped80C = Math.min(deductions.section80C || 0, 150000);
  const capped80D = Math.min(deductions.section80D || 0, 25000); // keep 50k if you want senior citizen handling
  const capped80G = Math.min(deductions.section80G || 0, 50000);
  const other = deductions.other || 0;

  let total = capped80C + capped80D + capped80G + other;
  if (isSalaried) total += STANDARD_DEDUCTION;

  return total;
}

function computeTax({ income, deductions, regime, isSalaried = false }) {
  // Step 1: Compute deductions
  const totalDeductions = calculateTotalDeductions(deductions, regime, isSalaried);

  // Step 2: Taxable income
  const taxableIncome = Math.max(0, income - totalDeductions);

  // Step 3: Rebate u/s 87A
  if (regime === "old" && taxableIncome <= 500000) {
    return { taxableIncome, baseTax: 0, cess: 0, totalTax: 0, breakup: [] };
  }
  if (regime === "new" && taxableIncome <= 700000) {
    return { taxableIncome, baseTax: 0, cess: 0, totalTax: 0, breakup: [] };
  }

  // Step 4: Apply slabs
  const slabs = TAX_SLABS[regime];
  let remaining = taxableIncome;
  let lower = 0;
  const breakup = [];
  let baseTax = 0;

  for (const slab of slabs) {
    const upper = slab.upto ?? Infinity;
    const range = Math.max(0, Math.min(remaining, upper - lower));
    const tax = range * slab.rate;
    if (range > 0) {
      breakup.push({ slabUpto: slab.upto, slabRate: slab.rate, slabIncome: range, tax });
      baseTax += tax;
      remaining -= range;
    }
    lower = upper;
    if (remaining <= 0) break;
  }

  // Step 5: Add cess
  const cess = baseTax * CESS_RATE;
  let totalTax = baseTax + cess;

  // Step 6: Round to nearest 10
  totalTax = Math.round(totalTax / 10) * 10;

  return {
    taxableIncome,
    baseTax,
    cess,
    totalTax,
    breakup,
  };
}

module.exports = { computeTax };
