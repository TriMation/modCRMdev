import React from 'react';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-emerald-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-emerald-600" />
            <span className="ml-2 text-xl font-semibold text-emerald-800">modCRM</span>
          </div>
          <div className="flex space-x-4">
            <button className="text-emerald-600 hover:text-emerald-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Features
            </button>
            <button className="text-emerald-600 hover:text-emerald-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Pricing
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}