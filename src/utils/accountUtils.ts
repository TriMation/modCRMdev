import { mockAccounts } from '../data/mockData';

export function getActiveAccounts() {
  return mockAccounts
    .filter(account => account.status === 'active')
    .map(account => ({
      id: account.id,
      name: account.name
    }));
}