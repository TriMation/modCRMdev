import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { MenuItem } from '../../types/menu';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface SidebarMenuProps {
  items: MenuItem[];
  currentPath: string;
  isCollapsed: boolean;
}

export function SidebarMenu({ items, currentPath, isCollapsed }: SidebarMenuProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Set default selection to dashboard on mount
    if (currentPath === '/dashboard') {
      const dashboardItem = items.find(item => item.path === '/dashboard');
      if (dashboardItem) {
        navigate(dashboardItem.path);
      }
    }
  }, [items]);

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon ? Icons[item.icon as keyof typeof Icons] || Icons.Circle : Icons.Circle;
    const isActive = currentPath === item.path;
    
    // Don't render Settings menu item as it's now handled separately
    if (item.path === '/dashboard/settings') {
      return null;
    }

    return (
      <Link
        key={item.id}
        to={item.path}
        className={`flex items-center ${
          isCollapsed ? 'justify-center' : 'space-x-2'
        } px-4 py-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-gray-700 transition-colors ${
          isActive ? 'bg-emerald-100 dark:bg-gray-700' : ''
        }`}
      >
        <Icon className="w-5 h-5" />
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    );
  };

  const renderSubMenu = (item: MenuItem) => {
    if (!item.children?.length) {
      return renderMenuItem(item);
    }

    return (
      <div key={item.id} className="space-y-1">
        {renderMenuItem(item)}
        <div className={`${isCollapsed ? 'pl-0' : 'pl-4'} space-y-1`}>
          {item.children.map(child => renderMenuItem(child))}
        </div>
      </div>
    );
  };

  return (
    <nav className="space-y-2">
      {items.map(item => renderSubMenu(item))}
    </nav>
  );
}