import { CESS_RATE, TAX_SLABS, TaxRegime, SectionDef, getSectionsForRegime } from "./taxapi"

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
  
  // Apply rebate u/s 87A - no tax if taxable income is below threshold
  if (regime === "old" && taxableIncome <= 500000) {
    return { taxableIncome, baseTax: 0, cess: 0, totalTax: 0, breakup: [] }
  }
  if (regime === "new" && taxableIncome <= 700000) {
    return { taxableIncome, baseTax: 0, cess: 0, totalTax: 0, breakup: [] }
  }
  
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
  let totalTax = baseTax + cess
  
  // Round to nearest 10 rupees
  totalTax = Math.round(totalTax / 10) * 10
  
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
  // Get allowed sections for the current regime
  const allowedSections = getSectionsForRegime(regime)
  const allowedCodes = new Set(allowedSections.map(s => s.code))
  
  // Filter investments to only include those allowed in current regime
  const validInvestments = investments.filter(inv => allowedCodes.has(inv.code))
  const totalValidInvestments = validInvestments.reduce((sum, inv) => sum + inv.amount, 0)
  
  // Calculate tax on annual income with only base deductions (before investments)
  const taxBeforeInvestments = computeTax({ 
    income: annualIncome, 
    deductions: baseDeductions, 
    regime 
  }).totalTax
  
  // Calculate tax on annual income with base deductions + valid investments
  // In new regime, most investments won't be valid, so totalValidInvestments will be 0
  const taxAfterInvestments = computeTax({ 
    income: annualIncome, 
    deductions: baseDeductions + totalValidInvestments, 
    regime 
  }).totalTax

  const taxableIncomeBeforeInvestments = Math.max(0, annualIncome - baseDeductions)
  const taxableIncomeAfterInvestments = Math.max(0, annualIncome - baseDeductions - totalValidInvestments)

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
