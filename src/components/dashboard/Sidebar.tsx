import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { useMenu } from '../../contexts/MenuContext';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { SidebarLogo } from './SidebarLogo';
import { SidebarDropdown } from './SidebarDropdown';
import { SidebarMenu } from './SidebarMenu';
import { Link } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { sections, selectedSection, setSelectedSection, loading, error } = useMenu();

  if (loading) {
    return (
      <div className="bg-emerald-50 dark:bg-gray-800 p-4">
        <div className="animate-pulse">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-emerald-50 dark:bg-gray-800 p-4">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col bg-emerald-50 dark:bg-gray-800 border-r border-emerald-100 dark:border-gray-700 transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="flex-1 p-4 relative">
        <div className="flex items-center justify-between mb-6">
          <SidebarLogo />
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-gray-700 text-emerald-600 dark:text-emerald-400 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {!isCollapsed && selectedSection && (
          <div className="mb-4">
            <SidebarDropdown 
              sections={sections}
              selectedSection={selectedSection}
              onSectionChange={setSelectedSection}
            />
          </div>
        )}

        {selectedSection && selectedSection.items && (
          <SidebarMenu
            items={selectedSection.items}
            currentPath={location.pathname}
            isCollapsed={isCollapsed}
          />
        )}
      </div>
      <div className="p-4 border-t border-emerald-100 dark:border-gray-700">
        <Link
          to="/dashboard/settings"
          className={`flex items-center ${
            isCollapsed ? 'justify-center' : 'space-x-2'
          } px-4 py-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-gray-700 transition-colors ${
            location.pathname === '/dashboard/settings' ? 'bg-emerald-100 dark:bg-gray-700' : ''
          }`}
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </div>
  );
}