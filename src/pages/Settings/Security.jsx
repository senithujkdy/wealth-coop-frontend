import { useState } from 'react';

const Security = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password change submitted:', passwordData);
    // Here you would typically send the data to your backend
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Two-factor Authentication */}
      <div className="mb-12">
        <h2 className="text-xl font-medium text-gray-800 mb-6">Two-factor Authentication</h2>
        
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleToggle}
            className={`relative inline-flex h-10 w-16 items-center rounded-full transition-colors ${
              twoFactorEnabled ? 'bg-teal-400' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform ${
                twoFactorEnabled ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="ml-3 text-gray-700">Enable or disable two factor authentication</span>
        </div>
      </div>

      {/* Change Password */}
      <div>
        <h2 className="text-xl font-medium text-gray-800 mb-6">Change Password</h2>
  
        <div className="space-y-6 max-w-xl">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
              Enter Password Again
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="px-12 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default Security;