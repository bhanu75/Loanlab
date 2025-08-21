import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, TrendingUp, PieChart, Download, Share2, Sun, Moon, Info, IndianRupee } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

const EMICalculatorApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [tenureType, setTenureType] = useState('years');
  const [showAmortization, setShowAmortization] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [prepaymentAmount, setPrepaymentAmount] = useState(0);
  const [prepaymentYear, setPrepaymentYear] = useState(5);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [darkMode]);

  const tenureInMonths = tenureType === 'years' ? loanTenure * 12 : loanTenure;

  // Core EMI Calculation
  const emiCalculation = useMemo(() => {
    const monthlyRate = interestRate / (12 * 100);
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) / 
                (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
    const totalAmount = emi * tenureInMonths;
    const totalInterest = totalAmount - loanAmount;
    
    return {
      emi: isFinite(emi) ? emi : 0,
      totalAmount,
      totalInterest,
      principalPercentage: (loanAmount / totalAmount) * 100,
      interestPercentage: (totalInterest / totalAmount) * 100
    };
  }, [loanAmount, interestRate, tenureInMonths]);

  // Amortization Schedule
  const amortizationSchedule = useMemo(() => {
    const monthlyRate = interestRate / (12 * 100);
    const { emi } = emiCalculation;
    let balance = loanAmount;
    const schedule = [];
    
    for (let month = 1; month <= tenureInMonths && month <= 360; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;
      
      // Apply prepayment if applicable
      if (month === prepaymentYear * 12 && prepaymentAmount > 0) {
        balance -= prepaymentAmount;
      }
      
      schedule.push({
        month,
        year: Math.ceil(month / 12),
        emi: emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
        cumulativeInterest: schedule.length > 0 ? 
          schedule[schedule.length - 1].cumulativeInterest + interestPayment : interestPayment
      });
      
      if (balance <= 0) break;
    }
    
    return schedule;
  }, [loanAmount, interestRate, tenureInMonths, emiCalculation.emi, prepaymentAmount, prepaymentYear]);

  // Chart data
  const chartData = amortizationSchedule.filter((_, index) => index % 12 === 0).map(item => ({
    year: item.year,
    principal: item.principal,
    interest: item.interest,
    balance: item.balance
  }));

  const pieChartData = [
    { name: 'Principal Amount', value: loanAmount, color: '#10B981' },
    { name: 'Total Interest', value: emiCalculation.totalInterest, color: '#F59E0B' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  // Calculate comparison loans
  const lowerRateLoan = useMemo(() => {
    const rate = interestRate - 0.5;
    const monthlyRate = rate / (12 * 100);
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) / 
                (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
    return {
      rate,
      emi: isFinite(emi) ? emi : 0,
      totalAmount: emi * tenureInMonths
    };
  }, [loanAmount, interestRate, tenureInMonths]);

  const higherRateLoan = useMemo(() => {
    const rate = interestRate + 0.5;
    const monthlyRate = rate / (12 * 100);
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) / 
                (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
    return {
      rate,
      emi: isFinite(emi) ? emi : 0,
      totalAmount: emi * tenureInMonths
    };
  }, [loanAmount, interestRate, tenureInMonths]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Calculator className="text-blue-600 dark:text-blue-400" size={36} />
              EMI Calculator Pro
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Professional loan calculator with advanced analytics</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-lg bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-slate-700"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="text-yellow-500" size={20} /> : <Moon className="text-slate-600" size={20} />}
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="xl:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <IndianRupee className="text-blue-600 dark:text-blue-400" size={20} />
                Loan Details
              </h2>
              
              <div className="space-y-6">
                {/* Loan Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loan Amount
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="50000"
                      max="10000000"
                      step="50000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
                    />
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-lg font-mono"
                      placeholder="Enter loan amount"
                    />
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>₹50K</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(loanAmount)}</span>
                      <span>₹1Cr</span>
                    </div>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interest Rate (% per annum)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
                    />
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-lg font-mono"
                      placeholder="Enter interest rate"
                    />
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>1%</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{interestRate}%</span>
                      <span>20%</span>
                    </div>
                  </div>
                </div>

                {/* Loan Tenure */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loan Tenure
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <button
                      onClick={() => setTenureType('years')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        tenureType === 'years' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Years
                    </button>
                    <button
                      onClick={() => setTenureType('months')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        tenureType === 'months' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Months
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min={tenureType === 'years' ? "1" : "6"}
                      max={tenureType === 'years' ? "30" : "360"}
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
                    />
                    <input
                      type="number"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-lg font-mono"
                      placeholder={`Enter tenure in ${tenureType}`}
                    />
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{tenureType === 'years' ? '1 Year' : '6 Months'}</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {loanTenure} {tenureType === 'years' ? 'Years' : 'Months'}
                      </span>
                      <span>{tenureType === 'years' ? '30 Years' : '360 Months'}</span>
                    </div>
                  </div>
                </div>

                {/* Prepayment Options */}
                <div className="border-t border-gray-200 dark:border-slate-600 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Prepayment Options</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prepayment Amount
                      </label>
                      <input
                        type="number"
                        value={prepaymentAmount}
                        onChange={(e) => setPrepaymentAmount(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="Enter prepayment amount"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prepayment After (Years)
                      </label>
                      <input
                        type="number"
                        value={prepaymentYear}
                        onChange={(e) => setPrepaymentYear(parseInt(e.target.value) || 1)}
                        min="1"
                        max={tenureType === 'years' ? loanTenure : Math.floor(loanTenure / 12)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="xl:col-span-2 space-y-6">
            {/* EMI Results */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                EMI Calculation Results
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Monthly EMI</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                    {formatCurrency(emiCalculation.emi)}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Principal Amount</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                    {formatCurrency(loanAmount)}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Total Interest</p>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1">
                    {formatCurrency(emiCalculation.totalInterest)}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Amount</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                    {formatCurrency(emiCalculation.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <PieChart size={16} />
                  {showAmortization ? 'Hide' : 'Show'} Amortization
                </button>
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <TrendingUp size={16} />
                  Compare Loans
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
                  <Download size={16} />
                  Export PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  <Share2 size={16} />
                  Share Results
                </button>
              </div>
            </div>

            {/* Loan Breakdown Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Loan Breakdown</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <RechartsPieChart data={pieChartData}>
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900 dark:text-white">Principal</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(loanAmount)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {emiCalculation.principalPercentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                      <span className="font-medium text-gray-900 dark:text-white">Interest</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(emiCalculation.totalInterest)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {emiCalculation.interestPercentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Trend Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Trend Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="year" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(value), name]}
                    labelFormatter={(value) => `Year ${value}`}
                    contentStyle={{
                      backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="principal" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Principal Payment"
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="interest" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    name="Interest Payment"
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Outstanding Balance"
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Amortization Schedule */}
            {showAmortization && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Amortization Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-600">
                        <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Month</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">EMI</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Principal</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Interest</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                      {amortizationSchedule.slice(0, 12).map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-3 px-2 text-gray-900 dark:text-white font-medium">{item.month}</td>
                          <td className="py-3 px-2 text-right text-gray-900 dark:text-white font-mono">
                            {formatCurrency(item.emi)}
                          </td>
                          <td className="py-3 px-2 text-right text-green-600 dark:text-green-400 font-mono">
                            {formatCurrency(item.principal)}
                          </td>
                          <td className="py-3 px-2 text-right text-amber-600 dark:text-amber-400 font-mono">
                            {formatCurrency(item.interest)}
                          </td>
                          <td className="py-3 px-2 text-right text-purple-600 dark:text-purple-400 font-mono">
                            {formatCurrency(item.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {amortizationSchedule.length > 12 && (
                    <div className="text-center py-4">
                      <p className="text-gray-600 dark:text-gray-300">
                        Showing first 12 months of {amortizationSchedule.length} total payments
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Loan Comparison */}
            {showComparison && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Loan Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Current Loan</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Rate: {interestRate}%</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      EMI: {formatCurrency(emiCalculation.emi)}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Total: {formatCurrency(emiCalculation.totalAmount)}
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Lower Rate Option</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Rate: {lowerRateLoan.rate.toFixed(1)}%</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      EMI: {formatCurrency(lowerRateLoan.emi)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Saves: {formatCurrency(emiCalculation.totalAmount - lowerRateLoan.totalAmount)}
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Higher Rate Option</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Rate: {higherRateLoan.rate.toFixed(1)}%</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                      EMI: {formatCurrency(higherRateLoan.emi)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Extra: {formatCurrency(higherRateLoan.totalAmount - emiCalculation.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Insights */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Info className="text-blue-600 dark:text-blue-400" size={20} />
                Key Insights & Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Loan Affordability</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Your EMI of {formatCurrency(emiCalculation.emi)} should ideally not exceed 40% of your monthly income.
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                      Recommended minimum income: {formatCurrency(emiCalculation.emi * 2.5)}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Interest Savings Tip</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Even a 0.5% reduction in interest rate can save you approximately {formatCurrency(emiCalculation.totalAmount - lowerRateLoan.totalAmount)} over the loan tenure.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Prepayment Impact</h4>
                    {prepaymentAmount > 0 ? (
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        A prepayment of {formatCurrency(prepaymentAmount)} in year {prepaymentYear} can save significant interest.
                      </p>
                    ) : (
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Consider making prepayments to reduce total interest burden and loan tenure.
                      </p>
                    )}
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Tax Benefits</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      For home loans, you can claim deductions up to ₹1.5L under Section 80C (principal) and ₹2L under Section 24(b) (interest).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tools */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Calculators</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Loan Eligibility</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Check maximum loan amount based on income
                  </p>
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                    Calculate Eligibility
                  </button>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Balance Transfer</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Compare savings from balance transfer
                  </p>
                  <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
                    Compare Options
                  </button>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">SIP vs EMI</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Investment vs loan prepayment analysis
                  </p>
                  <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm">
                    Analyze Returns
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>© 2025 EMI Calculator Pro. Built with precision and care.</p>
              <p className="mt-1">Calculations are for reference only. Consult your lender for actual terms.</p>
            </div>
            <div className="flex space-x-4">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</button>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Terms of Use</button>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Contact Support</button>
            </div>
          </div>
        </footer>
      </div>

      {/* Custom Dark Mode Styles */}
      <style>{`
        .dark {
          color-scheme: dark;
        }
        
        .dark .bg-gray-50 {
          background-color: #0f172a !important;
        }
        
        .dark .bg-white {
          background-color: #1e293b !important;
        }
        
        .dark .bg-slate-800 {
          background-color: #1e293b !important;
        }
        
        .dark .text-gray-900 {
          color: #f8fafc !important;
        }
        
        .dark .text-gray-700 {
          color: #cbd5e1 !important;
        }
        
        .dark .text-gray-600 {
          color: #94a3b8 !important;
        }
        
        .dark .text-gray-500 {
          color: #64748b !important;
        }
        
        .dark .text-gray-300 {
          color: #cbd5e1 !important;
        }
        
        .dark .text-white {
          color: #f8fafc !important;
        }
        
        .dark .border-gray-200 {
          border-color: #475569 !important;
        }
        
        .dark .border-gray-300 {
          border-color: #475569 !important;
        }
        
        .dark .border-slate-600 {
          border-color: #475569 !important;
        }
        
        .dark .border-slate-700 {
          border-color: #334155 !important;
        }
        
        .dark .bg-gray-200 {
          background-color: #475569 !important;
        }
        
        .dark .bg-slate-600 {
          background-color: #475569 !important;
        }
        
        .dark .bg-slate-700 {
          background-color: #334155 !important;
        }
        
        .dark .divide-gray-100 > :not([hidden]) ~ :not([hidden]) {
          border-color: #475569 !important;
        }
        
        .dark .divide-slate-700 > :not([hidden]) ~ :not([hidden]) {
          border-color: #475569 !important;
        }
        
        .dark .hover\\:bg-gray-50:hover {
          background-color: rgba(51, 65, 85, 0.5) !important;
        }
        
        .dark .hover\\:bg-slate-700\\/50:hover {
          background-color: rgba(51, 65, 85, 0.5) !important;
        }
        
        /* Dark mode gradients */
        .dark .from-blue-900 {
          --tw-gradient-from: #1e3a8a !important;
        }
        
        .dark .to-blue-800 {
          --tw-gradient-to: #1e40af !important;
        }
        
        .dark .from-green-900 {
          --tw-gradient-from: #14532d !important;
        }
        
        .dark .to-green-800 {
          --tw-gradient-to: #166534 !important;
        }
        
        .dark .from-amber-900 {
          --tw-gradient-from: #78350f !important;
        }
        
        .dark .to-amber-800 {
          --tw-gradient-to: #92400e !important;
        }
        
        .dark .from-purple-900 {
          --tw-gradient-from: #581c87 !important;
        }
        
        .dark .to-purple-800 {
          --tw-gradient-to: #6b21a8 !important;
        }
        
        /* Dark mode background colors for insights */
        .dark .bg-blue-900\\/20 {
          background-color: rgba(30, 58, 138, 0.2) !important;
        }
        
        .dark .bg-green-900\\/20 {
          background-color: rgba(20, 83, 45, 0.2) !important;
        }
        
        .dark .bg-amber-900\\/20 {
          background-color: rgba(120, 53, 15, 0.2) !important;
        }
        
        .dark .bg-purple-900\\/20 {
          background-color: rgba(88, 28, 135, 0.2) !important;
        }
        
        /* Dark mode text colors */
        .dark .text-blue-100 {
          color: #dbeafe !important;
        }
        
        .dark .text-blue-300 {
          color: #93c5fd !important;
        }
        
        .dark .text-blue-400 {
          color: #60a5fa !important;
        }
        
        .dark .text-green-400 {
          color: #4ade80 !important;
        }
        
        .dark .text-amber-400 {
          color: #fbbf24 !important;
        }
        
        .dark .text-purple-400 {
          color: #c084fc !important;
        }
        
        .dark .text-green-100 {
          color: #dcfce7 !important;
        }
        
        .dark .text-amber-100 {
          color: #fef3c7 !important;
        }
        
        .dark .text-purple-100 {
          color: #f3e8ff !important;
        }
        
        /* Dark mode form inputs */
        .dark input[type="range"] {
          background-color: #475569 !important;
        }
        
        .dark input[type="number"],
        .dark input[type="text"] {
          background-color: #334155 !important;
          border-color: #475569 !important;
          color: #f8fafc !important;
        }
        
        .dark input[type="number"]:focus,
        .dark input[type="text"]:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5) !important;
        }
        
        /* Dark mode range slider */
        .dark input[type="range"]::-webkit-slider-thumb {
          background: #3b82f6 !important;
          border: 2px solid #f8fafc !important;
        }
        
        .dark input[type="range"]::-moz-range-thumb {
          background: #3b82f6 !important;
          border: 2px solid #f8fafc !important;
        }
        
        /* Dark mode buttons */
        .dark .bg-gray-200:not(.bg-blue-600):not(.bg-green-600):not(.bg-amber-600):not(.bg-purple-600) {
          background-color: #475569 !important;
          color: #cbd5e1 !important;
        }
        
        /* Dark mode chart tooltip */
        .dark .recharts-tooltip-wrapper .recharts-default-tooltip {
          background-color: #1e293b !important;
          border: 1px solid #475569 !important;
          color: #f8fafc !important;
        }
      `}</style>
    </div>
  );
};

export default EMICalculatorApp;
