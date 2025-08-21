// Copy the entire content from the investment_calculations artifact above
export interface InvestmentType {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  minRate: number;
  maxRate: number;
  defaultRate: number;
  isCompound: boolean;
  minTenure: number;
  maxTenure: number;
}

export const investmentTypes: InvestmentType[] = [
  {
    id: 'fd',
    name: 'Fixed Deposit',
    hindiName: 'फिक्स्ड डिपॉजिट',
    description: 'Bank में सुरक्षित निवेश',
    minRate: 3.0,
    maxRate: 9.0,
    defaultRate: 6.5,
    isCompound: true,
    minTenure: 1,
    maxTenure: 40
  },
  {
    id: 'rd',
    name: 'Recurring Deposit',
    hindiName: 'रेकरिंग डिपॉजिट',
    description: 'हर महीने एक सा पैसा जमा करें',
    minRate: 3.0,
    maxRate: 8.5,
    defaultRate: 6.0,
    isCompound: true,
    minTenure: 1,
    maxTenure: 40
  },
  {
    id: 'ppf',
    name: 'PPF',
    hindiName: 'पीपीएफ',
    description: 'सरकारी योजना - 15 साल लॉक',
    minRate: 7.1,
    maxRate: 8.5,
    defaultRate: 7.6,
    isCompound: true,
    minTenure: 15,
    maxTenure: 40
  },
  {
    id: 'insurance',
    name: 'Insurance Policy',
    hindiName: 'बीमा पॉलिसी',
    description: 'LIC जैसी return वाली पॉलिसी',
    minRate: 4.0,
    maxRate: 7.0,
    defaultRate: 5.5,
    isCompound: true,
    minTenure: 5,
    maxTenure: 40
  }
];

export interface CalculationResult {
  maturityAmount: number;
  totalInvested: number;
  totalGain: number;
  annualRate: number;
  monthlyGain?: number;
}

export interface ScenarioResults {
  conservative: CalculationResult;
  realistic: CalculationResult;
  optimistic: CalculationResult;
}

// Fixed Deposit Calculation (Compound Interest)
export const calculateFD = (
  principal: number,
  rate: number,
  tenure: number,
  compoundingFrequency: number = 4 // Quarterly compounding
): CalculationResult => {
  const maturityAmount = principal * Math.pow(1 + rate / (100 * compoundingFrequency), compoundingFrequency * tenure);
  const totalGain = maturityAmount - principal;
  
  return {
    maturityAmount,
    totalInvested: principal,
    totalGain,
    annualRate: rate
  };
};

// Recurring Deposit Calculation
export const calculateRD = (
  monthlyAmount: number,
  rate: number,
  tenure: number
): CalculationResult => {
  const months = tenure * 12;
  const monthlyRate = rate / (12 * 100);
  
  // RD formula: A = P * [(1 + r)^n - 1] / r * (1 + r)
  const maturityAmount = monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate);
  const totalInvested = monthlyAmount * months;
  const totalGain = maturityAmount - totalInvested;
  
  return {
    maturityAmount,
    totalInvested,
    totalGain,
    annualRate: rate,
    monthlyGain: totalGain / months
  };
};

// PPF Calculation (Annual contribution with compound interest)
export const calculatePPF = (
  annualAmount: number,
  rate: number,
  tenure: number
): CalculationResult => {
  let maturityAmount = 0;
  
  for (let year = 1; year <= tenure; year++) {
    maturityAmount += annualAmount * Math.pow(1 + rate / 100, tenure - year + 1);
  }
  
  const totalInvested = annualAmount * tenure;
  const totalGain = maturityAmount - totalInvested;
  
  return {
    maturityAmount,
    totalInvested,
    totalGain,
    annualRate: rate
  };
};

// Generic Investment Calculation
export const calculateInvestment = (
  type: InvestmentType,
  amount: number,
  rate: number,
  tenure: number,
  isMonthly: boolean = false
): CalculationResult => {
  switch (type.id) {
    case 'fd':
      return calculateFD(amount, rate, tenure);
    
    case 'rd':
      return calculateRD(amount, rate, tenure);
    
    case 'ppf':
      const yearlyAmount = isMonthly ? amount * 12 : amount;
      return calculatePPF(yearlyAmount, rate, tenure);
    
    case 'insurance':
      // Simplified insurance calculation (compound interest with lower returns)
      const yearlyPremium = isMonthly ? amount * 12 : amount;
      return calculatePPF(yearlyPremium, rate, tenure);
    
    default:
      return calculateFD(amount, rate, tenure);
  }
};

// Calculate three scenarios
export const calculateScenarios = (
  type: InvestmentType,
  amount: number,
  tenure: number,
  isMonthly: boolean = false
): ScenarioResults => {
  const conservativeRate = type.minRate + (type.defaultRate - type.minRate) * 0.3;
  const optimisticRate = type.defaultRate + (type.maxRate - type.defaultRate) * 0.7;
  
  return {
    conservative: calculateInvestment(type, amount, conservativeRate, tenure, isMonthly),
    realistic: calculateInvestment(type, amount, type.defaultRate, tenure, isMonthly),
    optimistic: calculateInvestment(type, amount, optimisticRate, tenure, isMonthly)
  };
};

// Reverse calculation: Find required investment for target amount
export const calculateRequiredInvestment = (
  type: InvestmentType,
  targetAmount: number,
  tenure: number,
  rate?: number
): number => {
  const useRate = rate || type.defaultRate;
  
  switch (type.id) {
    case 'fd':
      return targetAmount / Math.pow(1 + useRate / 400, 4 * tenure); // Quarterly compounding
    
    case 'rd':
      const months = tenure * 12;
      const monthlyRate = useRate / (12 * 100);
      return targetAmount * monthlyRate / ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate));
    
    case 'ppf':
    case 'insurance':
      // Simplified calculation for annual contributions
      let presentValue = 0;
      for (let year = 1; year <= tenure; year++) {
        presentValue += 1 / Math.pow(1 + useRate / 100, tenure - year + 1);
      }
      return targetAmount / presentValue;
    
    default:
      return targetAmount / Math.pow(1 + useRate / 400, 4 * tenure);
  }
};

// Format currency for Indian locale
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format percentage
export const formatPercentage = (rate: number): string => {
  return `${rate.toFixed(1)}%`;
};

// Generate WhatsApp share text
export const generateShareText = (
  type: InvestmentType,
  result: CalculationResult,
  amount: number,
  tenure: number,
  isMonthly: boolean
): string => {
  const investmentType = isMonthly ? 'मासिक' : 'सालाना';
  const timeUnit = tenure === 1 ? 'साल' : 'साल';
  
  return `🌾 निवेश कैलकुलेटर
📊 योजना: ${type.hindiName}
💰 राशि: ${formatCurrency(amount)} (${investmentType})
📅 समय: ${tenure} ${timeUnit}
📈 मिलेगा: ${formatCurrency(result.maturityAmount)}
💡 कुल फायदा: ${formatCurrency(result.totalGain)}
🎯 सालाना फायदा: ~${formatPercentage(result.annualRate)}

कुल निवेश: ${formatCurrency(result.totalInvested)}
कुल रिटर्न: ${formatCurrency(result.maturityAmount)}

💡 EMI Calculator Pro से बनाया गया`;
};

// Calculate inflation impact
export const calculateInflationImpact = (
  futureAmount: number,
  years: number,
  inflationRate: number = 6
): { realValue: number; inflationLoss: number } => {
  const realValue = futureAmount / Math.pow(1 + inflationRate / 100, years);
  const inflationLoss = futureAmount - realValue;
  
  return { realValue, inflationLoss };
};
