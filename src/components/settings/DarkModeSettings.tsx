import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export function DarkModeSettings() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-6">Appearance</h2>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-emerald-900 dark:text-emerald-100 font-medium mb-1">Dark Mode</h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            Toggle between light and dark themes
          </p>
        </div>
        
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-gray-700 dark:text-emerald-400 dark:hover:bg-gray-600'
          }`}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}