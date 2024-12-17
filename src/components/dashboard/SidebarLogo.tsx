import React from 'react';
import { Building2 } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';

export function SidebarLogo() {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
      <div className="p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
        <Building2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
      </div>
      {!isCollapsed && (
        <span className="ml-2 text-xl font-semibold text-emerald-800 dark:text-emerald-200">
          modCRM
        </span>
      )}
    </div>
  );
}