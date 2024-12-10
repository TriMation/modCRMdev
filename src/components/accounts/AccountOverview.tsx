import React from 'react';
import { Account } from '../../types/account';
import { SalesFunnel } from '../dashboard/SalesFunnel';
import { MonthlyMetrics } from '../dashboard/MonthlyMetrics';

interface AccountOverviewProps {
  account: Account;
}

export function AccountOverview({ account }: AccountOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesFunnel />
        <MonthlyMetrics />
      </div>
    </div>
  );
}