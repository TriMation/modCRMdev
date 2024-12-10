import React from 'react';
import { Building2, Globe, MapPin } from 'lucide-react';
import { Account } from '../../types/account';

interface AccountCardProps {
  account: Account;
  onClick: (account: Account) => void;
}

export function AccountCard({ account, onClick }: AccountCardProps) {
  return (
    <div 
      onClick={() => onClick(account)}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg w-12 h-12 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">{account.name}</h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{account.industry || 'No industry specified'}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {account.website && (
          <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
            <Globe className="w-4 h-4 mr-2" />
            {account.website}
          </div>
        )}
        {account.city && account.state && (
          <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
            <MapPin className="w-4 h-4 mr-2" />
            {account.city}, {account.state}
          </div>
        )}
      </div>
    </div>
  );
}