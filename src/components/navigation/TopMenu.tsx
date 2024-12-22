import React from 'react';
import { Building2, Wrench, FileText, Box, Bell, Moon, Sun, Search } from 'lucide-react'; 
import { useMenu } from '../../contexts/MenuContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { UserDropdown } from '../dashboard/UserDropdown';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  defaultPath?: string;
  sectionName: string;
}

const menuItems: MenuItem[] = [
  { 
    id: 'sales', 
    label: 'Sales', 
    icon: <Building2 className="w-5 h-5" />, 
    path: '/dashboard',
    defaultPath: '/dashboard',
    sectionName: 'sales'
  },
  { 
    id: 'service', 
    label: 'Service', 
    icon: <Wrench className="w-5 h-5" />, 
    path: '/dashboard/service',
    sectionName: 'service'
  },
  { 
    id: 'bids', 
    label: 'Bids', 
    icon: <FileText className="w-5 h-5" />, 
    path: '/dashboard/bids',
    sectionName: 'bids'
  },
  { 
    id: 'assets', 
    label: 'Assets', 
    icon: <Box className="w-5 h-5" />, 
    path: '/dashboard/assets',
    sectionName: 'assets'
  }
];

export function TopMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSection, setSelectedSection, selectedSectionName, setSelectedSectionName } = useMenu();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Set initial section based on current path
  React.useEffect(() => {
    const currentPath = location.pathname;
    let isMounted = true;

    async function setInitialSection() {
      try {
        const { data: sections } = await supabase
          .from('menu_sections')
          .select('*')
          .eq('active', true)
          .order('order_position');

        if (sections && sections.length > 0) {
          const matchingItem = menuItems.find(item => 
            currentPath.startsWith(item.path) || 
            (item.defaultPath && currentPath === item.defaultPath)
          );

          if (matchingItem) {
            const section = sections.find(s => s.name === matchingItem.sectionName);
            if (section && isMounted && (!selectedSection || selectedSection.id !== section.id)) {
              setSelectedSection(section);
            }
          }
        }
      } catch (err) {
        console.error('Error setting initial section:', err);
      }
    }
    setInitialSection();
    return () => {
      isMounted = false;
    };
  }, [location.pathname, selectedSection]);
  const handleMenuClick = async (item: MenuItem) => {
    try {
      setSelectedSectionName(item.sectionName);
      const { data: sections } = await supabase
        .from('menu_sections')
        .select('*')
        .eq('name', item.sectionName)
        .eq('active', true)
        .order('order_position')
        .single();

      if (sections) {
        setSelectedSection(sections);
        navigate(item.defaultPath || item.path);
      } else {
        console.error('Section not found:', item.sectionName);
      }
    } catch (err) {
      console.error('Error setting section:', err);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-emerald-100 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu Items */}
          <div className="flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out
                  ${selectedSectionName === item.sectionName
                    ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700'
                  }
                  group relative`}
              >
                <span className="flex items-center space-x-2">
                  <span className="transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </span>
                
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 transform origin-left transition-transform duration-300 ease-out
                  ${selectedSection?.id === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                />
              </button>
            ))}
          </div>

          {/* Right side - Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 
                         bg-white dark:bg-gray-700 
                         text-gray-900 dark:text-gray-100
                         placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg text-emerald-600 dark:text-emerald-400"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            
            <button 
              className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}