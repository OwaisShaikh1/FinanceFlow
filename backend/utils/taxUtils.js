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

function computeTax({ income, deductions, regime }) {
  const taxableIncome = Math.max(0, income - deductions);
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

  const cess = baseTax * CESS_RATE;
  const totalTax = baseTax + cess;

  return {
    taxableIncome,
    baseTax,
    cess,
    totalTax,
    breakup,
  };
}

module.exports = { computeTax };