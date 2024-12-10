import React from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { UserDropdown } from './UserDropdown';
import { SearchField } from '../common/SearchField';

export function DashboardHeader() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-emerald-100 dark:border-gray-700 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search anything..."
          />
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg text-emerald-600 dark:text-emerald-400"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}