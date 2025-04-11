import { useState } from 'react';
import { Pencil, ChevronDown } from 'lucide-react';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    yourName: '',
    userName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    presentAddress: '',
    permanentAddress: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-12 gap-8">
        {/* Left column for profile picture */}
        <div className="col-span-2">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-yellow-300 overflow-hidden flex items-center justify-center border-4 border-white shadow-md">
              <div className="w-16 h-12 bg-purple-900 absolute top-3"></div>
              <div className="w-16 h-14 bg-orange-300 absolute bottom-2 rounded-full"></div>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Pencil size={16} />
            </button>
          </div>
        </div>

        {/* Right column for form fields */}
        <div className="col-span-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Your Name */}
            <div>
              <label htmlFor="yourName" className="block text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="yourName"
                name="yourName"
                value={formData.yourName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* User Name */}
            <div>
              <label htmlFor="userName" className="block text-gray-700 mb-2">
                User Name
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ChevronDown size={16} className="absolute right-3 top-4 text-gray-400" />
              </div>
            </div>

            {/* Present Address */}
            <div>
              <label htmlFor="presentAddress" className="block text-gray-700 mb-2">
                Present Address
              </label>
              <input
                type="text"
                id="presentAddress"
                name="presentAddress"
                value={formData.presentAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Permanent Address */}
            <div>
              <label htmlFor="permanentAddress" className="block text-gray-700 mb-2">
                Permanent Address
              </label>
              <input
                type="text"
                id="permanentAddress"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postalCode" className="block text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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

export default EditProfile;