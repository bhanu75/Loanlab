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
        {/* Results Panel */}
        <div className="xl:col-span-2 space-y-6">
          {/* Three Scenarios */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BarChart3 className="text-green-600 dark:text-green-400" size={20} />
              आपका रिजल्ट - तीन केस में
            </h2>
            
            {calculationMode === 'target' && results.requiredInvestment && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 आपको निवेश करना होगा:
                </h3>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(results.requiredInvestment)} 
                  {calculationMode === 'monthly' ? '/महीना' : '/साल'}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {tenure} साल में {formatCurrency(targetAmount)} पाने के लिए
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Conservative Scenario */}
              <div className="p-5 border-2 border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <div className="text-center">
                  <div className="text-amber-700 dark:text-amber-300 font-medium mb-2">कम से कम</div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-1">
                    {formatCurrency(results.scenarios.conservative.maturityAmount)}
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    {formatPercentage(results.scenarios.conservative.annualRate)} सालाना फायदा
                  </div>
                  <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-700">
                    <div className="text-xs text-amber-600 dark:text-amber-400">
                      फायदा: {formatCurrency(results.scenarios.conservative.totalGain)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Realistic Scenario (Highlighted) */}
              <div className="p-5 border-4 border-green-400 dark:border-green-600 rounded-lg bg-green-50 dark:bg-green-900/20 transform scale-105 shadow-lg">
                <div className="text-center">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2 inline-block">
                    सबसे बढिया ✨
                  </div>
                  <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
                    {formatCurrency(results.scenarios.realistic.maturityAmount)}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    {formatPercentage(results.scenarios.realistic.annualRate)} सालाना फायदा
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                    <div className="text-xs text-green-600 dark:text-green-400">
                      फायदा: {formatCurrency(results.scenarios.realistic.totalGain)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Optimistic Scenario */}
              <div className="p-5 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="text-center">
                  <div className="text-blue-700 dark:text-blue-300 font-medium mb-2">बेस्ट केस</div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                    {formatCurrency(results.scenarios.optimistic.maturityAmount)}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    {formatPercentage(results.scenarios.optimistic.annualRate)} सालाना फायदा
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      फायदा: {formatCurrency(results.scenarios.optimistic.totalGain)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">कुल निवेश</div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(results.scenarios.realistic.totalInvested)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">समय</div>
                  <div className="font-bold text-gray-900 dark:text-white">{tenure} साल</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">योजना</div>
                  <div className="font-bold text-gray-900 dark:text-white">{selectedType.hindiName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">प्रकार</div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {calculationMode === 'monthly' ? 'मासिक' : 'सालाना'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Share2 size={16} />
                WhatsApp पर भेजें
              </button>
              <button
                onClick={() => setShowInflation(!showInflation)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Info size={16} />
                {showInflation ? 'मंहगाई छुपाएं' : 'मंहगाई का असर'}
              </button>
            </div>
          </div>

          {/* Inflation Impact */}
          {showInflation && inflationData && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Info className="text-orange-600 dark:text-orange-400" size={20} />
                मंहगाई का असर (6% सालाना)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    आज के हिसाब से वैल्यू
                  </h4>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {formatCurrency(inflationData.realValue)}
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    {tenure} साल बाद की purchasing power
                  </p>
                </div>
                
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                    मंहगाई से नुकसान
                  </h4>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                    {formatCurrency(inflationData.inflationLoss)}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    यह रकम मंहगाई में चली जाएगी
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  💡 <strong>समझें:</strong> {formatCurrency(results.scenarios.realistic.maturityAmount)} मिलेगा, 
                  लेकिन आज के हिसाब से सिर्फ {formatCurrency(inflationData.realValue)} की वैल्यू होगी।
                </p>
              </div>
            </div>
          )}

          {/* Detailed Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PieChart className="text-purple-600 dark:text-purple-400" size={20} />
              पूरा हिसाब-किताब
            </h3>
            
            <div className="space-y-4">
              {/* Investment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-300">आपका पैसा</p>
                      <p className="text-xl font-bold text-green-900 dark:text-green-100">
                        {formatCurrency(results.scenarios.realistic.totalInvested)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
                      <IndianRupee className="text-green-700 dark:text-green-300" size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">बैंक/कंपनी का फायदा</p>
                      <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                        {formatCurrency(results.scenarios.realistic.totalGain)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <TrendingUp className="text-blue-700 dark:text-blue-300" size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-700 dark:text-purple-300">कुल मिलेगा</p>
                      <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                        {formatCurrency(results.scenarios.realistic.maturityAmount)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
                      <Target className="text-purple-700 dark:text-purple-300" size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly breakdown for RD */}
              {(selectedType.id === 'rd' || calculationMode === 'monthly') && results.scenarios.realistic.monthlyGain && (
                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">मासिक हिसाब</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">हर महीने फायदा: </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(results.scenarios.realistic.monthlyGain)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">कुल महीने: </span>
                      <span className="font-semibold text-gray-900 dark:text-white">{tenure * 12}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Simple explanation */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  🤔 सरल भाषा में
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
                  आप {calculationMode === 'monthly' ? 'हर महीने' : 'हर साल'} <strong>{formatCurrency(calculationMode === 'target' ? results.requiredInvestment! : amount)}</strong> डालें। 
                  {tenure} साल बाद आपको <strong>{formatCurrency(results.scenarios.realistic.maturityAmount)}</strong> मिलेगा। 
                  यानी <strong>{formatCurrency(results.scenarios.realistic.totalGain)}</strong> का फायदा। 
                  इसका मतलब है कि आपका पैसा हर साल लगभग <strong>{formatPercentage(results.scenarios.realistic.annualRate)}</strong> की रफ्तार से बढ़ेगा।
                </p>
              </div>
            </div>
          </div>

          {/* Tips and Recommendations */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="text-green-600 dark:text-green-400" size={20} />
              सुझाव और टिप्स
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">✅ अच्छी बात</h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• {selectedType.hindiName} सुरक्षित निवेश है</li>
                  <li>• गारंटीड रिटर्न मिलता है</li>
                  <li>• {tenure} साल में पैसा डबल+ हो सकता है</li>
                  {selectedType.id === 'ppf' && <li>• टैक्स की बचत भी होगी</li>}
                </ul>
              </div>
              
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">⚠️ ध्यान दें</h4>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  <li>• मंहगाई का असर देखते रहें</li>
                  <li>• दूसरे विकल्प भी compare करें</li>
                  <li>• Emergency fund अलग रखें</li>
                  {selectedType.id === 'ppf' && <li>• 15 साल तक पैसा locked रहेगा</li>}
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>💡 Pro Tip:</strong> अगर आप हर महीने ₹{Math.round(amount/12).toLocaleString()} की बजाय ₹{Math.round(amount*1.1/12).toLocaleString()} डाल सकें, 
                तो {tenure} साल में लगभग ₹{((results.scenarios.realistic.maturityAmount * 1.1 - results.scenarios.realistic.maturityAmount)/100000).toFixed(0)} लाख ज्यादा मिलेगा!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;
