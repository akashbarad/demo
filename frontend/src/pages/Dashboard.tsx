import React from 'react';
// import { LogOut, User as UserIcon } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  // const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-700">Dashboard Content</h2>
                  <p className="mt-2 text-gray-500">This is a protected route. You can only see this if you're authenticated.</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;