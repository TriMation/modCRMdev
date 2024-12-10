import React from 'react';
import { Users, Building2, DollarSign, Calendar } from 'lucide-react';

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'contact',
      icon: <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'New contact added',
      description: 'John Doe added to Acme Corporation',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'account',
      icon: <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Account updated',
      description: 'TechStart Inc details modified',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'lead',
      icon: <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'New lead created',
      description: 'Enterprise Software Solution - $50,000',
      time: '1 day ago'
    },
    {
      id: 4,
      type: 'meeting',
      icon: <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Meeting scheduled',
      description: 'Quarterly review with TechStart Inc',
      time: '2 days ago'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-center space-x-4 p-3 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-emerald-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{activity.title}</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">{activity.description}</p>
            </div>
            <span className="text-sm text-emerald-500 dark:text-emerald-500">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}