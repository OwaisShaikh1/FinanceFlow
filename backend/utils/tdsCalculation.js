/**
 * TDS Calculation Engine
 * Based on Indian Income Tax Act - TDS Rules & Rates (FY 2024-25)
 * 
 * This module contains all TDS sections, rates, threshold limits,
 * and calculation logic as per Indian Government rules.
 */

// TDS Rates and Rules for FY 2024-25
const TDS_SECTIONS = {
  '194A': {
    name: 'Interest on Securities',
    description: 'Interest other than interest on securities',
    rates: {
      Individual: 10,
      HUF: 10,
      Company: 10,
      Others: 10
    },
    thresholds: {
      Individual: 50000,        // Updated April 2025: ₹40,000 → ₹50,000
      'Senior Citizen': 100000, // Updated April 2025: ₹50,000 → ₹1,00,000
      Others: 50000
    },
    applicableOn: 'Interest payments',
    exemptions: ['Interest on savings bank account up to ₹10,000', 'Interest on NSC, PPF, etc.']
  },

  '194C': {
    name: 'Payments to Contractors',
    description: 'Payment to contractors and sub-contractors',
    rates: {
      Individual: 1,
      HUF: 1,
      Company: 2,
      Others: 2
    },
    thresholds: {
      singlePayment: 30000,
      aggregatePayment: 100000
    },
    applicableOn: 'Contract payments for work or services',
    exemptions: ['Payments for personal use', 'Payments to transporters (with valid PAN)']
  },

  '194H': {
    name: 'Commission or Brokerage',
    description: 'Commission or brokerage payments',
    rates: {
      Individual: 5,
      HUF: 5,
      Company: 5,
      Others: 5
    },
    thresholds: {
      singlePayment: 15000,
      aggregatePayment: 15000
    },
    applicableOn: 'Commission, brokerage, discount payments',
    exemptions: ['Commission to insurance agents up to ₹20,000']
  },

  '194I': {
    name: 'Rent',
    description: 'Rent payments',
    rates: {
      'Plant & Machinery': 2,
      'Land & Building': 10,
      'Furniture & Fittings': 10
    },
    thresholds: {
      'Plant & Machinery': 240000, // Annual
      'Land & Building': 240000,   // Annual
      monthlyThreshold: 20000      // Monthly
    },
    applicableOn: 'Rent for land, building, furniture, machinery',
    exemptions: ['Agricultural land rent', 'Hotel accommodation < 30 days']
  },

  '194J': {
    name: 'Professional Services',
    description: 'Fees for professional or technical services',
    rates: {
      Individual: 10,
      HUF: 10,
      Company: 10,
      Others: 10
    },
    thresholds: {
      singlePayment: 50000,   // Updated April 2025: ₹30,000 → ₹50,000
      aggregatePayment: 100000
    },
    applicableOn: 'Professional, technical, consultancy fees',
    exemptions: ['Directors fees', 'Call center services']
  },

  '194': {
    name: 'Salary',
    description: 'Salary payments',
    rates: 'As per slab rates',
    thresholds: {
      basicExemptionLimit: 250000,
      seniorCitizenLimit: 300000,
      superSeniorCitizenLimit: 500000
    },
    applicableOn: 'Salary, wages, pension',
    slabRates: [
      { min: 0, max: 250000, rate: 0 },
      { min: 250001, max: 500000, rate: 5 },
      { min: 500001, max: 1000000, rate: 20 },
      { min: 1000001, max: Infinity, rate: 30 }
    ]
  },

  '194B': {
    name: 'Winnings from Lottery/Crossword',
    description: 'Winnings from lottery, crossword puzzle, races',
    rates: {
      Individual: 30,
      Others: 30
    },
    thresholds: {
      singlePayment: 10000
    },
    applicableOn: 'Lottery, gambling, racing winnings',
    exemptions: []
  },

  '194BB': {
    name: 'Winnings from Horse Race',
    description: 'Winnings from horse races',
    rates: {
      Individual: 30,
      Others: 30
    },
    thresholds: {
      singlePayment: 10000
    },
    applicableOn: 'Horse race winnings',
    exemptions: []
  },

  '194D': {
    name: 'Insurance Commission',
    description: 'Insurance commission',
    rates: {
      Individual: 5,
      Others: 5
    },
    thresholds: {
      aggregatePayment: 15000
    },
    applicableOn: 'Life insurance commission',
    exemptions: []
  },

  '194K': {
    name: 'Dividend Payments',
    description: 'Payment of income in respect of units of mutual fund or units from administrator of specified undertaking',
    rates: {
      Individual: 10,
      HUF: 10,
      Company: 10,
      Others: 10
    },
    thresholds: {
      singlePayment: 10000   // Updated April 2025: ₹5,000 → ₹10,000
    },
    applicableOn: 'Dividend income from mutual funds, specified undertakings',
    exemptions: ['Dividend from equity mutual funds (exempted)']
  },

  '194G': {
    name: 'Commission on Sale of Lottery Tickets',
    description: 'Commission on sale of lottery tickets',
    rates: {
      Individual: 5,
      Others: 5
    },
    thresholds: {
      singlePayment: 15000
    },
    applicableOn: 'Lottery ticket sale commission',
    exemptions: []
  },

  '194M': {
    name: 'Contract Payment by Individual/HUF',
    description: 'Contract payments by individuals/HUF',
    rates: {
      Individual: 5,
      HUF: 5
    },
    thresholds: {
      singlePayment: 50000,
      aggregatePayment: 200000
    },
    applicableOn: 'Contract work by individual/HUF having business turnover > ₹1 crore',
    exemptions: []
  }
};

// Surcharge rates based on income
const SURCHARGE_RATES = {
  Individual: [
    { min: 0, max: 5000000, rate: 0 },
    { min: 5000001, max: 10000000, rate: 10 },
    { min: 10000001, max: 20000000, rate: 15 },
    { min: 20000001, max: 50000000, rate: 25 },
    { min: 50000001, max: Infinity, rate: 37 }
  ],
  Company: [
    { min: 0, max: 10000000, rate: 0 },
    { min: 10000001, max: 100000000, rate: 7 },
    { min: 100000001, max: Infinity, rate: 12 }
  ]
};

// Health and Education Cess - 4% on (Tax + Surcharge)
const CESS_RATE = 4;

class TDSCalculator {
  
  /**
   * Calculate TDS for a given payment
   * @param {Object} paymentDetails - Payment details
   * @returns {Object} - Calculated TDS details
   */
  static calculateTDS(paymentDetails) {
    const {
      amount,
      section,
      payeeType = 'Individual',
      rentType = null, // For section 194I
      hasLowerDeductionCertificate = false,
      lowerRate = null,
      annualIncome = null // For surcharge calculation
    } = paymentDetails;

    // Validate section
    if (!TDS_SECTIONS[section]) {
      throw new Error(`Invalid TDS section: ${section}`);
    }

    const sectionData = TDS_SECTIONS[section];
    
    // Check if payment is above threshold
    const thresholdCheck = this.checkThreshold(amount, section, payeeType, rentType);
    if (!thresholdCheck.applicable) {
      return {
        applicable: false,
        reason: thresholdCheck.reason,
        tdsAmount: 0,
        netPayment: amount
      };
    }

    // Get applicable TDS rate
    let tdsRate;
    if (hasLowerDeductionCertificate && lowerRate !== null) {
      tdsRate = lowerRate;
    } else {
      tdsRate = this.getTDSRate(section, payeeType, rentType);
    }

    // Calculate basic TDS
    const basicTDS = Math.round((amount * tdsRate) / 100);

    // Calculate surcharge if applicable
    const surchargeDetails = this.calculateSurcharge(basicTDS, payeeType, annualIncome);

    // Calculate cess (4% on TDS + Surcharge)
    const cessAmount = Math.round(((basicTDS + surchargeDetails.surchargeAmount) * CESS_RATE) / 100);

    // Total TDS amount
    const totalTDS = basicTDS + surchargeDetails.surchargeAmount + cessAmount;

    // Net payment after TDS
    const netPayment = amount - totalTDS;

    return {
      applicable: true,
      section,
      sectionName: sectionData.name,
      paymentAmount: amount,
      tdsRate,
      basicTDS,
      surchargeRate: surchargeDetails.surchargeRate,
      surchargeAmount: surchargeDetails.surchargeAmount,
      cessRate: CESS_RATE,
      cessAmount,
      totalTDS,
      netPayment,
      calculation: {
        step1: `Payment Amount: ₹${amount.toLocaleString()}`,
        step2: `TDS @ ${tdsRate}%: ₹${basicTDS.toLocaleString()}`,
        step3: `Surcharge @ ${surchargeDetails.surchargeRate}%: ₹${surchargeDetails.surchargeAmount.toLocaleString()}`,
        step4: `Cess @ ${CESS_RATE}%: ₹${cessAmount.toLocaleString()}`,
        step5: `Total TDS: ₹${totalTDS.toLocaleString()}`,
        step6: `Net Payment: ₹${netPayment.toLocaleString()}`
      }
    };
  }

  /**
   * Check if TDS is applicable based on threshold limits
   */
  static checkThreshold(amount, section, payeeType, rentType = null) {
    const sectionData = TDS_SECTIONS[section];
    
    if (!sectionData.thresholds) {
      return { applicable: true, reason: 'No threshold limit' };
    }

    let thresholdAmount;
    
    switch (section) {
      case '194A':
        thresholdAmount = payeeType === 'Senior Citizen' ? 
          sectionData.thresholds['Senior Citizen'] : 
          sectionData.thresholds[payeeType] || sectionData.thresholds.Others;
        break;
        
      case '194I':
        thresholdAmount = sectionData.thresholds[rentType] || sectionData.thresholds.monthlyThreshold;
        break;
        
      case '194C':
      case '194J':
        thresholdAmount = sectionData.thresholds.singlePayment;
        break;
        
      default:
        thresholdAmount = sectionData.thresholds.singlePayment || 
                         sectionData.thresholds.aggregatePayment || 0;
    }

    if (amount < thresholdAmount) {
      return { 
        applicable: false, 
        reason: `Payment amount ₹${amount.toLocaleString()} is below threshold limit of ₹${thresholdAmount.toLocaleString()}` 
      };
    }

    return { applicable: true, reason: 'Above threshold limit' };
  }

  /**
   * Get TDS rate for specific section and payee type
   */
  static getTDSRate(section, payeeType, rentType = null) {
    const sectionData = TDS_SECTIONS[section];
    
    if (section === '194I') {
      return sectionData.rates[rentType] || sectionData.rates['Land & Building'];
    }
    
    if (section === '194') {
      // For salary, rate depends on income slabs - return 0 for basic calculation
      return 0; // Salary TDS calculation is complex and needs separate handling
    }
    
    return sectionData.rates[payeeType] || sectionData.rates.Others || sectionData.rates.Individual;
  }

  /**
   * Calculate surcharge based on income and payee type
   */
  static calculateSurcharge(tdsAmount, payeeType, annualIncome) {
    if (!annualIncome || !SURCHARGE_RATES[payeeType]) {
      return { surchargeRate: 0, surchargeAmount: 0 };
    }

    const rates = SURCHARGE_RATES[payeeType];
    const applicableRate = rates.find(rate => 
      annualIncome >= rate.min && annualIncome <= rate.max
    );

    if (!applicableRate || applicableRate.rate === 0) {
      return { surchargeRate: 0, surchargeAmount: 0 };
    }

    const surchargeAmount = Math.round((tdsAmount * applicableRate.rate) / 100);
    
    return {
      surchargeRate: applicableRate.rate,
      surchargeAmount
    };
  }

  /**
   * Calculate salary TDS based on income tax slabs
   */
  static calculateSalaryTDS(annualSalary, payeeType = 'Individual', age = 30) {
    const sectionData = TDS_SECTIONS['194'];
    let exemptionLimit;

    // Determine exemption limit based on age
    if (age >= 80) {
      exemptionLimit = sectionData.thresholds.superSeniorCitizenLimit;
    } else if (age >= 60) {
      exemptionLimit = sectionData.thresholds.seniorCitizenLimit;
    } else {
      exemptionLimit = sectionData.thresholds.basicExemptionLimit;
    }

    if (annualSalary <= exemptionLimit) {
      return {
        applicable: false,
        reason: `Salary ₹${annualSalary.toLocaleString()} is below exemption limit of ₹${exemptionLimit.toLocaleString()}`,
        totalTax: 0,
        monthlyTDS: 0
      };
    }

    const taxableIncome = annualSalary - exemptionLimit;
    let totalTax = 0;

    // Calculate tax as per slab rates
    for (const slab of sectionData.slabRates) {
      if (taxableIncome > slab.min - exemptionLimit) {
        const applicableIncome = Math.min(taxableIncome, slab.max - exemptionLimit);
        const slabTax = (applicableIncome * slab.rate) / 100;
        totalTax += slabTax;
      }
    }

    // Calculate surcharge and cess
    const surchargeDetails = this.calculateSurcharge(totalTax, payeeType, annualSalary);
    const cessAmount = Math.round(((totalTax + surchargeDetails.surchargeAmount) * CESS_RATE) / 100);
    
    const finalTax = totalTax + surchargeDetails.surchargeAmount + cessAmount;
    const monthlyTDS = Math.round(finalTax / 12);

    return {
      applicable: true,
      annualSalary,
      exemptionLimit,
      taxableIncome,
      basicTax: totalTax,
      surchargeAmount: surchargeDetails.surchargeAmount,
      cessAmount,
      totalTax: finalTax,
      monthlyTDS,
      calculation: {
        exemptionLimit: `₹${exemptionLimit.toLocaleString()}`,
        taxableIncome: `₹${taxableIncome.toLocaleString()}`,
        basicTax: `₹${totalTax.toLocaleString()}`,
        surcharge: `₹${surchargeDetails.surchargeAmount.toLocaleString()}`,
        cess: `₹${cessAmount.toLocaleString()}`,
        totalTax: `₹${finalTax.toLocaleString()}`,
        monthlyTDS: `₹${monthlyTDS.toLocaleString()}`
      }
    };
  }

  /**
   * Get all available TDS sections
   */
  static getAllSections() {
    return Object.keys(TDS_SECTIONS).map(section => ({
      section,
      name: TDS_SECTIONS[section].name,
      description: TDS_SECTIONS[section].description,
      rates: TDS_SECTIONS[section].rates
    }));
  }

  /**
   * Get section details
   */
  static getSectionDetails(section) {
    return TDS_SECTIONS[section] || null;
  }

  /**
   * Validate PAN number format
   */
  static validatePAN(pan) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  }

  /**
   * Get quarterly return dates
   */
  static getQuarterlyReturnDates(financialYear) {
    const startYear = parseInt(financialYear.split('-')[0]);
    
    return {
      Q1: {
        period: 'Apr-Jun',
        dueDate: new Date(startYear, 6, 31), // July 31
        lateFilingDate: new Date(startYear, 7, 31) // August 31
      },
      Q2: {
        period: 'Jul-Sep',
        dueDate: new Date(startYear, 9, 31), // October 31
        lateFilingDate: new Date(startYear, 10, 30) // November 30
      },
      Q3: {
        period: 'Oct-Dec',
        dueDate: new Date(startYear + 1, 0, 31), // January 31
        lateFilingDate: new Date(startYear + 1, 1, 28) // February 28/29
      },
      Q4: {
        period: 'Jan-Mar',
        dueDate: new Date(startYear + 1, 4, 31), // May 31
        lateFilingDate: new Date(startYear + 1, 5, 30) // June 30
      }
    };
  }

  /**
   * Get threshold amount for a TDS section
   * @param {string} section - TDS section code
   * @param {string} payeeType - Type of payee
   * @param {string} rentType - Type of rent (for 194I)
   * @returns {number} - Threshold amount
   */
  static getThresholdAmount(section, payeeType = 'Individual', rentType = 'Land & Building') {
    const sectionData = TDS_SECTIONS[section];
    
    if (!sectionData || !sectionData.thresholds) {
      return 0;
    }

    let thresholdAmount;
    
    switch (section) {
      case '194A':
        thresholdAmount = payeeType === 'Senior Citizen' ? 
          sectionData.thresholds['Senior Citizen'] : 
          sectionData.thresholds[payeeType] || sectionData.thresholds.Others;
        break;
        
      case '194I':
        thresholdAmount = sectionData.thresholds[rentType] || sectionData.thresholds.monthlyThreshold;
        break;
        
      case '194C':
      case '194J':
        thresholdAmount = sectionData.thresholds.singlePayment;
        break;
        
      default:
        thresholdAmount = sectionData.thresholds.singlePayment || 
                         sectionData.thresholds.aggregatePayment || 0;
    }

    return thresholdAmount || 0;
  }
}

module.exports = {
  TDSCalculator,
  TDS_SECTIONS,
  SURCHARGE_RATES,
  CESS_RATE
};