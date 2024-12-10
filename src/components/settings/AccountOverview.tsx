import React from 'react';
import { Users, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import { UserManagement } from './UserManagement';

export function AccountOverview() {
  const totalLicenses = 10;
  const usedLicenses = mockUsers.length;
  const availableLicenses = totalLicenses - usedLicenses;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
              <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Users</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">{usedLicenses}/{totalLicenses}</h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">Active licenses</p>
          </div>
          <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              {availableLicenses} licenses available
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
              <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Plan</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">Business</h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">Current plan</p>
          </div>
          <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm text-emerald-700 dark:text-emerald-300">Active subscription</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
              <AlertCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Status</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">Healthy</h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">System status</p>
          </div>
          <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm text-emerald-700 dark:text-emerald-300">All systems operational</p>
            </div>
          </div>
        </div>
      </div>

      <UserManagement />
    </div>
  );
}