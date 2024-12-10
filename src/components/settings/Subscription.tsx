import React from 'react';
import { CreditCard, Check, ArrowRight } from 'lucide-react';

export function Subscription() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      features: [
        '5 User licenses',
        'Basic CRM features',
        'Email support',
        '5GB storage'
      ],
      current: false
    },
    {
      name: 'Business',
      price: '$99',
      features: [
        '10 User licenses',
        'Advanced CRM features',
        'Priority support',
        '20GB storage',
        'API access'
      ],
      current: true
    },
    {
      name: 'Enterprise',
      price: '$299',
      features: [
        'Unlimited users',
        'Custom features',
        '24/7 support',
        'Unlimited storage',
        'API access',
        'Custom integrations'
      ],
      current: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Current Plan</h2>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">Manage your subscription and billing</p>
          </div>
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <CreditCard className="w-5 h-5" />
            <span>Next billing date: April 1, 2024</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border-2 p-6 ${
                plan.current
                  ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900/20'
                  : 'border-emerald-100 dark:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">{plan.name}</h3>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{plan.price}<span className="text-sm font-normal">/month</span></p>
                </div>
                {plan.current && (
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
                    Current
                  </span>
                )}
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                  plan.current
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
                    : 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-900/50'
                }`}
              >
                <span>{plan.current ? 'Current Plan' : 'Upgrade'}</span>
                {!plan.current && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}