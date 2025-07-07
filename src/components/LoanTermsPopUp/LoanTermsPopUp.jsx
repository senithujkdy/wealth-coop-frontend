import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, FileText, CreditCard, User, Phone } from 'lucide-react';

const LoanTermsPopUp = ({ isOpen, onClose, onSubmit, loanForm }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const handleAgreeAndContinue = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2 && agreed) {
      onSubmit();
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-lg relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-center mb-2">
            Wealth Coop Bank Personal Loan Application
          </h2>
          <p className="text-center text-blue-100">
            It takes only few minutes to complete your request. When you're finished we'll give you a response immediately.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Requirements</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Submit</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  What you'll need??
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Calculate your eligible loan amount using "Loan Calculator" provided in this site.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Pay slip certified by employer, letter from employer confirming the Service and position.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Copy of the NIC/Passport.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Your Wealth Coop Bank account number (if you have one).
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                  What happens after you apply?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      SMS will be sent to your mobile number, with a reference, acknowledging your request.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      You will be notified (via email) to submit documents, if eligible to proceed.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Once your Loan is approved, SMS/email confirmation will be sent informing the next step.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="w-5 h-5 text-orange-600 mr-2" />
                  Eligibility requirements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Age between 18 to 60 years.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Be a Sri Lankan citizen.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Minimum monthly income of LKR 25,000.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Good credit history and score.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-800">
                    <p className="font-medium">Important notice</p>
                    <p className="text-sm mt-1">
                      Only individual applications are facilitated online. For joint applications, please visit nearest Wealth Coop Bank branch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Review Your Application
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Personal Details
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {loanForm?.full_name || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">NIC:</span> {loanForm?.nic || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Date of Birth:</span>{" "}
                        {loanForm?.date_of_birth || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {loanForm?.address || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Loan Details
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Amount:</span> LKR{" "}
                        {loanForm?.loan_amount ? Number(loanForm.loan_amount).toLocaleString() : "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Interest Rate:</span>{" "}
                        {loanForm?.interest_rate || "N/A"}%
                      </p>
                      <p>
                        <span className="font-medium">Credit Score:</span>{" "}
                        {loanForm?.credit_score || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Monthly Income:</span> LKR{" "}
                        {loanForm?.income ? Number(loanForm.income).toLocaleString() : "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Loan Type:</span>{" "}
                        {loanForm?.loan_type || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Financial Details
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Sector:</span>{" "}
                        {loanForm?.sector || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Employment:</span>{" "}
                        {loanForm?.employment_type || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Account Balance:</span> LKR{" "}
                        {loanForm?.account_balance ? Number(loanForm.account_balance).toLocaleString() : "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Gross Salary:</span> LKR{" "}
                        {loanForm?.gross_salary ? Number(loanForm.gross_salary).toLocaleString() : "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Net Salary:</span> LKR{" "}
                        {loanForm?.net_salary ? Number(loanForm.net_salary).toLocaleString() : "N/A"}
                      </p>
                      {loanForm?.other_income && (
                        <p>
                          <span className="font-medium">Other Income:</span> LKR{" "}
                          {Number(loanForm.other_income).toLocaleString()}
                        </p>
                      )}
                      {loanForm?.deductions && (
                        <p>
                          <span className="font-medium">Deductions:</span> LKR{" "}
                          {Number(loanForm.deductions).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-blue-800">
                    <p className="font-medium">Before submitting:</p>
                    <p className="text-sm mt-1">
                      Please review all information carefully. Once submitted,
                      your application will be processed by our team.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="agreement" className="text-sm text-gray-700">
                  I agree to the terms and conditions and confirm that the information provided is accurate.
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
          <div className="flex space-x-3">
            {currentStep === 2 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleAgreeAndContinue}
              disabled={currentStep === 2 && !agreed}
              className={`px-6 py-2 rounded text-white font-medium ${
                currentStep === 2 && !agreed
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {currentStep === 1 ? 'Agree and Continue >>' : 'Submit Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component to show how to use it
const LoanApplicationDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sampleLoanForm = {
    full_name: "John Doe",
    nic: "123456789V",
    date_of_birth: "1990-01-01",
    address: "123 Main Street, Colombo",
    loan_amount: 500000,
    interest_rate: 12.5,
    credit_score: 720,
    income: 75000,
    loan_type: "Personal Loan",
    sector: "Private",
    employment_type: "Permanent",
    account_balance: 150000,
    gross_salary: 85000,
    net_salary: 75000,
    other_income: 10000,
    deductions: 10000
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Here you would typically send the data to your backend
    console.log("Application submitted!");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Loan Application Form</h1>
        
        {submitted ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-600 mb-2">Application Submitted!</h2>
            <p className="text-gray-600">Your loan application has been successfully submitted.</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Click the button below to submit your loan application to Wealth Coop Bank.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Submit Application
            </button>
          </div>
        )}
      </div>

      <LoanTermsPopUp
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        loanForm={sampleLoanForm}
      />
    </div>
  );
};

export default LoanTermsPopUp;