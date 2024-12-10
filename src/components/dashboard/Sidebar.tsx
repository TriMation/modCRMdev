import React, { useState, useEffect } from 'react';
import { Users, Calendar, Settings, FolderKanban, Building2, ChevronLeft, ChevronRight, CheckSquare, Target, Package, DollarSign } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { getQuickAccessRecords } from '../../services/quickAccessService';
import { QuickAccessRecord } from '../../types/quickAccess';

export function Sidebar() {
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [quickAccessRecords, setQuickAccessRecords] = useState<QuickAccessRecord[]>([]);

  useEffect(() => {
    async function loadQuickAccess() {
      const records = await getQuickAccessRecords();
      setQuickAccessRecords(records);
    }
    loadQuickAccess();
  }, [location.pathname]);

  const navigationLinks = [
    { icon: <FolderKanban />, text: 'Dashboard', to: '/dashboard' },
    { icon: <CheckSquare />, text: 'Tasks', to: '/dashboard/tasks' },
    { icon: <Calendar />, text: 'Calendar', to: '/dashboard/calendar' },
    { icon: <Target />, text: 'Leads', to: '/dashboard/leads' },
    { icon: <DollarSign />, text: 'Opportunities', to: '/dashboard/opportunities' },
    { icon: <Building2 />, text: 'Accounts', to: '/dashboard/accounts' },
    { icon: <Users />, text: 'Contacts', to: '/dashboard/contacts' },
    { icon: <Package />, text: 'Products', to: '/dashboard/products' },
    { icon: <Settings />, text: 'Settings', to: '/dashboard/settings' }
  ];

  return (
    <div className={`bg-emerald-50 dark:bg-gray-800 border-r border-emerald-100 dark:border-gray-700 transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <FolderKanban className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            {!isCollapsed && <span className="ml-2 text-xl font-semibold text-emerald-800 dark:text-emerald-200">modCRM</span>}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-emerald-100 dark:hover:bg-gray-700 rounded-lg text-emerald-600 dark:text-emerald-400"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="space-y-2">
          {navigationLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center ${
                isCollapsed ? 'justify-center' : 'space-x-2'
              } px-4 py-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-gray-700 transition-colors ${
                location.pathname === link.to ? 'bg-emerald-100 dark:bg-gray-700' : ''
              }`}
            >
              <span className="w-5 h-5">{link.icon}</span>
              {!isCollapsed && <span>{link.text}</span>}
            </Link>
          ))}
        </nav>

        <hr className="my-4 border-emerald-100 dark:border-gray-700" />
        <div className={`${isCollapsed ? 'px-2' : 'px-4'} mb-2`}>
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {!isCollapsed && 'Quick Access'}
          </span>
        </div>
        {quickAccessRecords.length > 0 ? (
          <div className="space-y-2">
            <div className="space-y-2">
              {quickAccessRecords.map((record) => (
                <Link
                  key={`${record.type}-${record.id}`}
                  to={record.path}
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center' : 'space-x-2'
                  } px-4 py-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <span className="w-5 h-5">
                    {record.type === 'account' ? <Building2 className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                  </span>
                  {!isCollapsed && (
                    <div className="flex-1 truncate">
                      <span className="block text-sm truncate">{record.name}</span>
                      <span className="block text-xs text-emerald-500 dark:text-emerald-500">
                        {new Date(record.accessed_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className={`px-4 py-3 ${isCollapsed ? 'hidden' : ''}`}>
            <p className="text-sm text-emerald-500 dark:text-emerald-400">
              Visit accounts and contacts to build your quick access list
            </p>
          </div>
        )}
      </div>
    </div>
  );
}