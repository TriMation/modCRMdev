import React, { useEffect, useState } from 'react';
import { CreditCard, Check, ArrowRight } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface BillingInfo {
  next_billing_date: string;
  plan_name: string;
}

interface Plan {
  name: string;
  link: string;
  price: string;
  features: string[];
  current?: boolean; // Optional property to indicate the current plan
}

export function Subscription() {
  const { user } = useAuth();
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Define the plans with an optional 'current' property
  const plans: Plan[] = [
    {
      name: 'Starter',
      link: 'https://buy.stripe.com/bIY28i5bsbBt3dufYY',
      price: '$29',
      features: [
        '5 User licenses',
        'Basic CRM features',
        'Email support',
        '5GB storage'
      ],
      current: billingInfo?.plan_name === 'Starter' // Dynamically set based on billingInfo
    },
    {
      name: 'Business',
      link: 'https://buy.stripe.com/9AQ28i9rIbBt15m6op',
      price: '$99',
      features: [
        '10 User licenses',
        'Advanced CRM features',
        'Priority support',
        '20GB storage',
        'API access'
      ],
      current: billingInfo?.plan_name === 'Business'
    },
    {
      name: 'Enterprise',
      link: 'https://buy.stripe.com/14k4gqdHYcFxg0g3ce',
      price: '$299',
      features: [
        'Unlimited users',
        'Custom features',
        '24/7 support',
        'Unlimited storage',
        'API access',
        'Custom integrations'
      ],
      current: billingInfo?.plan_name === 'Enterprise'
    }
  ];

  useEffect(() => {
    async function loadBillingInfo() {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('billing_info')
          .select('next_billing_date, plan_name')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setBillingInfo(data);
      } catch (err) {
        console.error('Error loading billing info:', err);
        setError('Failed to load billing information');
      } finally {
        setLoading(false);
      }
    }
    loadBillingInfo();
  }, [user]);

  if (loading) {
    return <div className="animate-pulse">Loading billing information...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

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
            <span>
              Next billing date: {billingInfo?.next_billing_date ? new Date(billingInfo.next_billing_date).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            Current Plan: {billingInfo?.plan_name || 'Free'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-emerald-100 dark:border-emerald-800 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">{plan.name}</h3>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {plan.price}
                    <span className="text-sm font-normal">/month</span>
                  </p>
                </div>
                {plan.current && (
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
                    Current
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300"
                  >
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                  plan.current
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
                    : 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-900/50'
                }`}
              >
                <span>{plan.current ? 'Current Plan' : 'Subscribe'}</span>
                {!plan.current && <ArrowRight className="w-4 h-4" />}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}