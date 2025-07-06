import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, AlertCircle, Info, DollarSign, Calendar, Percent } from 'lucide-react';

const LoanCalculator = () => {
  const [calculatorData, setCalculatorData] = useState({
    loanAmount: '',
    interestRate: '',
    loanTerm: '12', // months
    sector: 'government' // government, private
  });

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    isValid: false
  });

  const [errors, setErrors] = useState({});

  // Interest rates based on sector
  const interestRates = {
    government: 17.00,
    private: 17.50 // Base rate, can be 18.50 for longer terms
  };

  // Loan term options (in months)
  const loanTermOptions = [
    { value: '6', label: '6 months' },
    { value: '12', label: '1 year' },
    { value: '18', label: '1.5 years' },
    { value: '24', label: '2 years' },
    { value: '36', label: '3 years' },
    { value: '48', label: '4 years' },
    { value: '60', label: '5 years' }
  ];

  // Auto-set interest rate based on sector
  useEffect(() => {
    const rate = calculatorData.sector === 'government' 
      ? interestRates.government 
      : (parseInt(calculatorData.loanTerm) > 24 ? 18.50 : interestRates.private);
    
    setCalculatorData(prev => ({
      ...prev,
      interestRate: rate.toString()
    }));
  }, [calculatorData.sector, calculatorData.loanTerm]);

  // Calculate loan payments
  useEffect(() => {
    calculateLoan();
  }, [calculatorData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCalculatorData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    
    if (!calculatorData.loanAmount || calculatorData.loanAmount <= 0) {
      newErrors.loanAmount = 'Please enter a valid loan amount';
    } else if (calculatorData.loanAmount > 500000) {
      newErrors.loanAmount = 'Maximum loan amount is LKR 500,000';
    }
    
    if (!calculatorData.interestRate || calculatorData.interestRate <= 0) {
      newErrors.interestRate = 'Please enter a valid interest rate';
    }
    
    if (!calculatorData.loanTerm || calculatorData.loanTerm <= 0) {
      newErrors.loanTerm = 'Please select a loan term';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateLoan = () => {
    if (!validateInputs()) {
      setResults({
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        isValid: false
      });
      return;
    }

    const principal = parseFloat(calculatorData.loanAmount);
    const monthlyRate = parseFloat(calculatorData.interestRate) / 100 / 12;
    const numberOfPayments = parseInt(calculatorData.loanTerm);

    // Calculate monthly payment using the formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    setResults({
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      isValid: true
    });
  };

  const calculateRequiredBalance = () => {
    const loanAmount = parseFloat(calculatorData.loanAmount);
    return loanAmount > 0 ? loanAmount / 12 : 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center">
          <Calculator className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Loan Calculator</h2>
            <p className="text-gray-500 mt-1">Calculate your monthly payments and total cost</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount (LKR)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="loanAmount"
                  value={calculatorData.loanAmount}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.loanAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter loan amount"
                  max="500000"
                />
              </div>
              {errors.loanAmount && (
                <p className="text-red-500 text-sm mt-1">{errors.loanAmount}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">Maximum: LKR 500,000</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Sector
              </label>
              <select
                name="sector"
                value={calculatorData.sector}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="government">Government / Semi-Government</option>
                <option value="private">Private Sector</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (% per annum)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="interestRate"
                  value={calculatorData.interestRate}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.interestRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Interest rate"
                  step="0.1"
                />
              </div>
              {errors.interestRate && (
                <p className="text-red-500 text-sm mt-1">{errors.interestRate}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Auto-filled based on sector selection
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Term
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  name="loanTerm"
                  value={calculatorData.loanTerm}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {loanTermOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Calculation Results
              </h3>
              
              {results.isValid ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Monthly Payment</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(results.monthlyPayment)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Payment</span>
                      <span className="text-lg font-semibold text-gray-800">
                        {formatCurrency(results.totalPayment)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Interest</span>
                      <span className="text-lg font-semibold text-orange-600">
                        {formatCurrency(results.totalInterest)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Enter valid loan details to see calculations
                  </p>
                </div>
              )}
            </div>

            {/* Account Balance Requirement */}
            {calculatorData.loanAmount && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-800">Account Balance Requirement</h4>
                    <p className="text-amber-700 text-sm mt-1">
                      You need at least <strong>{formatCurrency(calculateRequiredBalance())}</strong> in your account 
                      (1/12 of loan amount) plus a minimum balance of <strong>LKR 2,000</strong>.
                    </p>
                    <p className="text-amber-700 text-sm mt-1">
                      <strong>Total required balance: {formatCurrency(Math.max(calculateRequiredBalance(), 2000))}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Interest Rate Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">Interest Rate Information</h4>
                  <div className="text-blue-700 text-sm mt-1 space-y-1">
                    <p>• Government/Semi-Government: <strong>17.00% per annum</strong></p>
                    <p>• Private Sector (≤24 months): <strong>17.50% per annum</strong></p>
                    <p>• Private Sector (>24 months): <strong>18.50% per annum</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Breakdown Chart */}
        {results.isValid && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Breakdown</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Principal Amount</span>
                <span className="text-sm font-medium">
                  {formatCurrency(parseFloat(calculatorData.loanAmount))}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${(parseFloat(calculatorData.loanAmount) / results.totalPayment) * 100}%`
                  }}
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Interest Amount</span>
                <span className="text-sm font-medium">
                  {formatCurrency(results.totalInterest)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full"
                  style={{
                    width: `${(results.totalInterest / results.totalPayment) * 100}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Principal: {((parseFloat(calculatorData.loanAmount) / results.totalPayment) * 100).toFixed(1)}%</span>
                <span>Interest: {((results.totalInterest / results.totalPayment) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;