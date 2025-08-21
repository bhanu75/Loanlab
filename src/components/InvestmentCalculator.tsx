// Copy the entire content from the investment_calculator artifact above
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  IndianRupee, 
  Clock, 
  Target, 
  Share2, 
  Info,
  Calculator,
  PieChart,
  BarChart3
} from 'lucide-react';
import { 
  investmentTypes, 
  calculateScenarios, 
  calculateRequiredInvestment,
  calculateInflationImpact,
  formatCurrency, 
  formatPercentage, 
  generateShareText,
  InvestmentType 
} from '../utils/investmentCalculations';

interface InvestmentCalculatorProps {
  darkMode: boolean;
}

const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({ darkMode }) => {
  const [selectedType, setSelectedType] = useState<InvestmentType>(investmentTypes[0]);
  const [calculationMode, setCalculationMode] = useState<'amount' | 'target' | 'monthly'>('amount');
  const [amount, setAmount] = useState(100000);
  const [tenure, setTenure] = useState(5);
  const [customRate, setCustomRate] = useState(selectedType.defaultRate);
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [targetAmount, setTargetAmount] = useState(200000);
  const [showInflation, setShowInflation] = useState(false);

  // Calculate results based on mode
  const results = useMemo(() => {
    const effectiveRate = useCustomRate ? customRate : selectedType.defaultRate;
    
    if (calculationMode === 'target') {
      const requiredInvestment = calculateRequiredInvestment(selectedType, targetAmount, tenure, effectiveRate);
      const scenarios = calculateScenarios(selectedType, requiredInvestment, tenure, false);
      return { scenarios, requiredInvestment };
    } else if (calculationMode === 'monthly') {
      const scenarios = calculateScenarios(selectedType, amount, tenure, true);
      return { scenarios, requiredInvestment: null };
    } else {
      const scenarios = calculateScenarios(selectedType, amount, tenure, false);
      return { scenarios, requiredInvestment: null };
    }
  }, [selectedType, calculationMode, amount, tenure, customRate, useCustomRate, targetAmount]);

  const inflationData = useMemo(() => {
    if (!showInflation) return null;
    const realisticResult = results.scenarios.realistic;
    return calculateInflationImpact(realisticResult.maturityAmount, tenure);
  }, [results.scenarios.realistic, tenure, showInflation]);

  const handleShare = () => {
    const shareText = generateShareText(
      selectedType,
      results.scenarios.realistic,
      calculationMode === 'target' ? results.requiredInvestment! : amount,
      tenure,
      calculationMode === 'monthly'
    );
    
    if (navigator.share) {
      navigator.share({
        title: 'निवेश कैलकुलेटर रिजल्ट',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('WhatsApp के लिए टेक्स्ट कॉपी हो गया!');
    }
  };

  return (
    <div className="space-y-6 pb-20"> {/* Added bottom padding for navigation */}
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
          <TrendingUp className="text-green-600 dark:text-green-400" size={32} />
          निवेश कैलकुलेटर
        </h1>
        <p className="text-gray-600 dark:text-gray-300">सरल भाषा में आपके पैसे का हिसाब</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="xl:col-span-1 space-y-6">
          {/* Investment Type Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PieChart className="text-blue-600 dark:text-blue-400" size={20} />
              निवेश का प्रकार
            </h2>
            
            <div className="grid grid-cols-1 gap-3">
              {investmentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type);
                    setCustomRate(type.defaultRate);
                    setTenure(Math.max(tenure, type.minTenure));
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedType.id === type.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-slate-600 hover:border-green-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {type.hindiName}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {type.description}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                    {formatPercentage(type.minRate)} - {formatPercentage(type.maxRate)} रिटर्न
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Mode */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calculator className="text-purple-600 dark:text-purple-400" size={20} />
              कैसे calculate करें?
            </h2>
            
            <div className="space-y-3">
              <button
                onClick={() => setCalculationMode('amount')}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  calculationMode === 'amount'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-slate-600'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  💰 कितना पैसा लगाना है
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  राशि डालें → रिटर्न देखें
                </div>
              </button>
              
              <button
                onClick={() => setCalculationMode('target')}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  calculationMode === 'target'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-slate-600'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  🎯 कितना पैसा चाहिए
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  लक्ष्य डालें → निवेश देखें
                </div>
              </button>
              
              <button
                onClick={() => setCalculationMode('monthly')}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  calculationMode === 'monthly'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-slate-600'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  📅 महीने में कितना दे सकते हैं
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  मासिक राशि → रिटर्न देखें
                </div>
              </button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <IndianRupee className="text-green-600 dark:text-green-400" size={20} />
              विवरण भरें
            </h2>
            
            <div className="space-y-6">
              {/* Amount Input */}
              {calculationMode !== 'target' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {calculationMode === 'monthly' ? 'महीने की राशि' : 'निवेश राशि'}
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="1000"
                      max="1000000"
                      step="1000"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
                    />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-lg font-mono"
                      placeholder="राशि डालें"
                    />
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>₹1K</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(amount)}
                      </span>
                      <span>₹10L</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Target Amount Input */}
              {calculationMode === 'target' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    कितना पैसा चाहिए (लक्ष्य)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="50000"
                      max="5000000"
                      step="10000"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
                    />
                    <input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-lg font-mono"
                      placeholder="लक्ष्य राशि डालें"
                    />
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>₹50K</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(targetAmount)}
                      </span>
                      <span>₹50L</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tenure Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  कितने साल के लिए
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={selectedType.minTenure}
                    max={selectedType.maxTenure}
                    value={tenure}
                    onChange={(e) => setTenure(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
                  />
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(parseInt(e.target.value) || 1)}
                    min={selectedType.minTenure}
                    max={selectedType.maxTenure}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-lg font-mono"
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{selectedType.minTenure} साल</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {tenure} साल
                    </span>
                    <span>{selectedType.maxTenure} साल</span>
                  </div>
                </div>
              </div>

              {/* Custom Rate */}
              <div className="border-t border-gray-200 dark:border-slate-600 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    अपना रेट डालें (वैकल्पिक)
                  </label>
                  <button
                    onClick={() => setUseCustomRate(!useCustomRate)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      useCustomRate 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {useCustomRate ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                {useCustomRate && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={selectedType.minRate}
                      max={selectedType.maxRate}
                      step="0.1"
                      value={customRate}
                      onChange={(e) => setCustomRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
                    />
                    <input
                      type="number"
                      value={customRate}
                      onChange={(e) => setCustomRate(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      min={selectedType.minRate}
                      max={selectedType.maxRate}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white font-mono"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatPercentage(selectedType.minRate)}</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatPercentage(customRate)}
                      </span>
                      <span>{formatPercentage(selectedType.maxRate)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Copy the rest from the investment_calculator artifact above */}
        {/* Results Panel with Three Scenarios, Inflation Impact, etc. */}
