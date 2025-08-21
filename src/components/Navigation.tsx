import React from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

interface NavigationProps {
  activeTab: 'emi' | 'investment';
  onTabChange: (tab: 'emi' | 'investment') => void;
  darkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, darkMode }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-8 py-3">
          <button
            onClick={() => onTabChange('emi')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'emi'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <Calculator size={20} />
            <span className="text-xs font-medium">EMI Calculator</span>
          </button>
          
          <button
            onClick={() => onTabChange('investment')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'investment'
                ? 'bg-green-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
            }`}
          >
            <TrendingUp size={20} />
            <span className="text-xs font-medium">निवेश Calculator</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
