import { useState } from 'react';
import EditProfile from './EditProfile';
import Security from './Security';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Edit Profile');
  const tabs = ['Edit Profile', 'Preferences', 'Security'];

  return (
    <div className="bg-gray-50 min-h-screen ">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex space-x-12">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`pb-3 px-4 ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Render appropriate content based on active tab */}
          {activeTab === 'Edit Profile' && <EditProfile />}
          {activeTab === 'Security' && (<Security/>)}

          {/* Placeholder for other tabs */}
          {activeTab === 'Preferences' && (
            <div className="text-center py-8 text-gray-500">
              Preferences 
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;