import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useFinance } from '../context/FinanceContext';
import { Loader2 } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoading } = useFinance();

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
