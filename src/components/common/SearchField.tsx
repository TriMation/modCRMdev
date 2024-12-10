import React from 'react';
import { Search } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchField({ value, onChange, placeholder = 'Search...' }: SearchFieldProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-emerald-500 
                 bg-white dark:bg-gray-700 
                 text-gray-900 dark:text-gray-100
                 placeholder-gray-400 dark:placeholder-gray-500"
      />
    </div>
  );
}