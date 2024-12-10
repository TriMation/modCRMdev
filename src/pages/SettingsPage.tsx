import React, { useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SettingsHeader } from '../components/settings/SettingsHeader';
import { AccountOverview } from '../components/settings/AccountOverview';
import { Subscription } from '../components/settings/Subscription';
import { RecentActivity } from '../components/settings/RecentActivity';
import { DarkModeSettings } from '../components/settings/DarkModeSettings';
import { DataSettings } from '../components/settings/DataSettings';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const breadcrumbItems = [
    { label: 'Settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <AccountOverview />
            <DarkModeSettings />
          </div>
        );
      case 'subscription':
        return <Subscription />;
      case 'activity':
        return <RecentActivity />;
      case 'data':
        return <DataSettings />;
      default:
        return <AccountOverview />;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100 mb-6">Settings</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <SettingsHeader activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}