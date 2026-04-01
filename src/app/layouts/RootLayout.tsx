import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useFinance } from '../context/FinanceContext';
import { Loader2 } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoading, user, isSessionLoading } = useFinance();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSessionLoading && !user) {
      navigate('/login');
    }
  }, [user, isSessionLoading, navigate]);

  if (isSessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 animate-pulse font-medium">Authenticating...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="p-4 lg:p-6 relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-500 animate-pulse font-medium">Loading your financial data...</p>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};
