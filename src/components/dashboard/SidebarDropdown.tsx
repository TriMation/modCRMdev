import React from 'react';
import { ChevronDown } from 'lucide-react';
import { MenuSection } from '../../types/menu';
import { useCallback } from 'react';

interface SidebarDropdownProps {
  sections: MenuSection[];
  selectedSection: MenuSection | null;
  onSectionChange: (section: MenuSection) => void;
}

export function SidebarDropdown({ sections, selectedSection, onSectionChange }: SidebarDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSectionChange = useCallback((section: MenuSection) => {
    // Only trigger change if selecting a different section
    if (section.id !== selectedSection?.id) {
      onSectionChange(section);
    }
    setIsOpen(false);
  }, [selectedSection?.id, onSectionChange]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          isOpen
            ? 'bg-emerald-100 dark:bg-gray-700 text-emerald-900 dark:text-emerald-100'
            : 'bg-emerald-100/50 dark:bg-gray-700/50 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-100 dark:hover:bg-gray-700'
        }`}
      >
        <span>{selectedSection?.name || 'CRM'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-emerald-100 dark:border-gray-700">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section)}
              className={`w-full px-4 py-2 text-sm text-left hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors ${
                selectedSection?.id === section.id
                  ? 'bg-emerald-50 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400'
                  : 'text-emerald-900 dark:text-emerald-100'
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}