import React, { useState } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

const ImportantNotice = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8 rounded-r-lg">
      <div className="flex items-start justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-start">
          <AlertCircle className="w-6 h-6 text-amber-600 mr-3 mt-1" />
          <h3 className="text-lg font-semibold text-amber-800 mb-0">Important Notice</h3>
        </div>
        <ChevronDown
          className={`w-7 h-7 text-amber-700 mt-1 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && (
        <div className="mt-4 text-amber-700 space-y-2">
          <p>• This is a <strong>Personal Loan</strong> application.</p>
          <p>• You can apply for a <strong>maximum loan amount of LKR 500,000</strong>.</p>
          <p>• Calculate your eligible loan amount using <strong>Loan Calculator</strong> provided in this site.</p>
          <p>• In order to receive the loan amount you are applying for, your account balance <strong>must be at least 1/12 of the requested loan amount</strong>.</p>
          <p>• Additionally, you are required to <strong>maintain a minimum balance of LKR 2,000</strong> in your account at all times.</p>

          <h4 className="text-md font-semibold text-amber-800 mt-4 mb-2">Interest Rates</h4>
          <p>Personal loans are available to professionals and employees in:</p>
          <p>• <strong>Government / Semi-Government institutions</strong> – at an <strong>interest rate of 17.00% per annum</strong>.</p>
          <p>• <strong>Private sector employees</strong> – interest rates vary based on the repayment period:</p>
          <p className="ml-4">• <strong>17.50%</strong> or <strong>18.50% per annum</strong>, depending on your loan term.</p>
        </div>
      )}
    </div>
  );
};

export default ImportantNotice;
