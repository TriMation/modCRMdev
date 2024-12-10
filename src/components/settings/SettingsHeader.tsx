import React from 'react';
import { Users, CreditCard, Activity, Database } from 'lucide-react';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SettingsHeaderProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function SettingsHeader({ activeTab, onTabChange }: SettingsHeaderProps) {
  const tabs: SettingsTab[] = [
    { id: 'overview', label: 'Account Overview', icon: <Users className="w-5 h-5" /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'activity', label: 'Recent Activity', icon: <Activity className="w-5 h-5" /> },
    { id: 'data', label: 'Data', icon: <Database className="w-5 h-5" /> }
  ];

  return (
    <div className="border-b border-emerald-100">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-emerald-600 hover:border-emerald-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}