import React from 'react';
import { Calendar as CalendarIcon, Clock, Star } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export function CalendarPage() {
  const breadcrumbItems = [
    { label: 'Calendar' }
  ];

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
              <CalendarIcon className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
            Calendar Coming Soon
          </h1>
          
          <p className="text-lg text-emerald-600 dark:text-emerald-400 mb-8">
            We're working hard to bring you a powerful calendar integration.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="flex justify-center mb-4">
                <Clock className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                Meeting Scheduling
              </h3>
              <p className="text-emerald-600 dark:text-emerald-400">
                Easily schedule and manage meetings with contacts and accounts
              </p>
            </div>

            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="flex justify-center mb-4">
                <Star className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                Task Integration
              </h3>
              <p className="text-emerald-600 dark:text-emerald-400">
                View and manage tasks alongside your calendar events
              </p>
            </div>

            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="flex justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                Smart Reminders
              </h3>
              <p className="text-emerald-600 dark:text-emerald-400">
                Never miss important meetings or follow-ups with smart notifications
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
              Want to be notified when it's ready?
            </h3>
            <p className="text-emerald-600 dark:text-emerald-400 mb-4">
              We'll let you know as soon as the calendar feature becomes available.
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              />
              <button className="px-6 py-2 bg-emerald-600 text-white rounded-r-lg hover:bg-emerald-700 transition-colors">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}