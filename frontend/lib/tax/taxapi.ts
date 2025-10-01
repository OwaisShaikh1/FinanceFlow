export type TaxRegime = "old" | "new"

export interface TaxSlab {
  // upper bound for the slab; null means no upper bound (last slab)
  upto: number | null
  rate: number // e.g. 0.05 for 5%
}

export interface SectionDef {
  code: string
  description: string
  // null => no explicit monetary cap handled here (domain rules may still cap)
  limit: number | null
  // Which regimes allow this deduction
  allowedIn: TaxRegime[]
  // Lower number means higher priority when suggesting a plan
  priority: number
}

// 4% Health & Education Cess
export const CESS_RATE = 0.04

// Slabs as per commonly used Old vs New regime (FY 2024-25/AY 2025-26).
// Keep these editable — you can tweak when laws change without touching code.
export const TAX_SLABS: Record<TaxRegime, TaxSlab[]> = {
  new: [
    { upto: 300_000, rate: 0 },
    { upto: 600_000, rate: 0.05 },
    { upto: 900_000, rate: 0.1 },
    { upto: 1_200_000, rate: 0.15 },
    { upto: 1_500_000, rate: 0.2 },
    { upto: null, rate: 0.3 },
  ],
  old: [
    { upto: 250_000, rate: 0 },
    { upto: 500_000, rate: 0.05 },
    { upto: 1_000_000, rate: 0.2 },
    { upto: null, rate: 0.3 },
  ],
}

// Dynamic list of tax-saving sections. Add/Edit here and the UI updates automatically.
export const SECTION_DEFS: SectionDef[] = [
  {
    code: "80C",
    description: "PPF, ELSS, Life Insurance, etc.",
    limit: 150_000,
    allowedIn: ["old"],
    priority: 1,
  },
  {
    code: "80D",
    description: "Health Insurance Premium",
    limit: 25_000,
    allowedIn: ["old"],
    priority: 2,
  },
  {
    code: "80G",
    description: "Donations to Charity",
    limit: 50_000, // simplified cap for illustration
    allowedIn: ["old"],
    priority: 3,
  },
  {
    code: "80E",
    description: "Education Loan Interest",
    limit: null, // no explicit monetary cap period-wise (simplified)
    allowedIn: ["old"],
    priority: 4,
  },
  {
    code: "80EE",
    description: "Home Loan Interest (first-time buyers)",
    limit: 50_000, // simplified
    allowedIn: ["old"],
    priority: 5,
  },
  {
    code: "80CCD2",
    description: "Employer NPS Contribution",
    limit: null, // 10% of salary, no fixed limit
    allowedIn: ["new", "old"],
    priority: 6,
  },
  {
    code: "STANDARD",
    description: "Standard Deduction (Auto-applied)",
    limit: 50_000,
    allowedIn: ["new", "old"],
    priority: 0, // highest priority, auto-applied
  },
]

export function getSectionsForRegime(regime: TaxRegime) {
  return SECTION_DEFS.filter((s) => s.allowedIn.includes(regime)).sort((a, b) => a.priority - b.priority)
}
