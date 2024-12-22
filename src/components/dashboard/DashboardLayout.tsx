import React from 'react';
import { Sidebar } from './Sidebar';
import { TopMenu } from '../navigation/TopMenu';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopMenu />
        {children}
      </div>
    </div>
  );
}