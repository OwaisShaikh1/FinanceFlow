import { CESS_RATE, TAX_SLABS, TaxRegime, SectionDef, getSectionsForRegime } from "./config"

export interface TaxBreakupItem {
  slabUpto: number | null
  slabRate: number
  slabIncome: number
  tax: number
}

export interface ComputeTaxParams {
  income: number
  deductions: number
  regime: TaxRegime
}

export interface ComputeTaxResult {
  taxableIncome: number
  baseTax: number
  cess: number
  totalTax: number
  breakup: TaxBreakupItem[]
}

export function computeTax({ income, deductions, regime }: ComputeTaxParams): ComputeTaxResult {
  const taxableIncome = Math.max(0, income - Math.max(0, deductions))
  const slabs = TAX_SLABS[regime]

  let remaining = taxableIncome
  let lower = 0
  const breakup: TaxBreakupItem[] = []
  let baseTax = 0

  for (const slab of slabs) {
    const upper = slab.upto ?? Infinity
    const range = Math.max(0, Math.min(remaining, upper - lower))
    const tax = range * slab.rate
    if (range > 0) {
      breakup.push({ slabUpto: slab.upto, slabRate: slab.rate, slabIncome: range, tax })
      baseTax += tax
      remaining -= range
    }
    lower = upper
    if (remaining <= 0) break
  }

  const cess = baseTax * CESS_RATE
  const totalTax = baseTax + cess
  return { taxableIncome, baseTax, cess, totalTax, breakup }
}

export interface InvestmentInput {
  code: string
  amount: number
}

export interface SavingsResult {
  totalTaxSaved: number
  taxableIncomeBeforeInvestments: number
  taxableIncomeAfterInvestments: number
  taxSaved: number
  taxBeforeInvestments: number
  taxAfterInvestments: number
}

export function computeAfterInvestments(
  annualIncome: number,
  baseDeductions: number,
  regime: TaxRegime,
  investments: InvestmentInput[]
): SavingsResult {
  const taxableIncomeBeforeInvestments = annualIncome - baseDeductions
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const taxableIncomeAfterInvestments = taxableIncomeBeforeInvestments - totalInvestments

  const taxBeforeInvestments = computeTax({ income: taxableIncomeBeforeInvestments, deductions: 0, regime }).totalTax
  const taxAfterInvestments = computeTax({ income: taxableIncomeAfterInvestments, deductions: 0, regime }).totalTax

  return {
    totalTaxSaved: taxBeforeInvestments - taxAfterInvestments,
    taxableIncomeBeforeInvestments,
    taxableIncomeAfterInvestments,
    taxSaved: taxBeforeInvestments - taxAfterInvestments,
    taxBeforeInvestments,
    taxAfterInvestments,
  }
}

export interface PlanSuggestionItem {
  code: string
  suggested: number
  reason: string
}

export interface InvestmentPlanResult {
  suggestions: PlanSuggestionItem[]
  totalSuggested: number
  expectedTaxSaved: number
}

// Very simple greedy planner: allocate the available budget across sections by priority,
// honoring per-section limits where defined.
export function generateInvestmentPlan(
  income: number,
  baseDeductions: number,
  regime: TaxRegime,
  budget: number
): InvestmentPlanResult {
  const sections = getSectionsForRegime(regime)
  const suggestions: PlanSuggestionItem[] = []
  let remaining = Math.max(0, budget)

  for (const s of sections) {
    if (remaining <= 0) break
    const cap = s.limit ?? remaining
    const allocate = Math.min(remaining, cap)
    if (allocate > 0) {
      suggestions.push({ code: s.code, suggested: allocate, reason: `Allocate up to ${s.limit ? `cap ₹${s.limit.toLocaleString()}` : "eligible amount"}` })
      remaining -= allocate
    }
  }

  const savings = computeAfterInvestments(
    income,
    baseDeductions,
    regime,
    suggestions.map((s) => ({ code: s.code, amount: s.suggested }))
  )

  return {
    suggestions,
    totalSuggested: suggestions.reduce((s, i) => s + i.suggested, 0),
    expectedTaxSaved: Math.max(0, savings.taxSaved),
  }
}
