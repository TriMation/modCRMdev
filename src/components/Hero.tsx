import React from 'react';
import { Users, BarChart3, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-emerald-900 mb-6">
            Streamline Your Customer Relationships
          </h1>
          <p className="text-xl text-emerald-700 mb-12 max-w-3xl mx-auto">
            Transform your business with our intuitive CRM solution. Manage leads, track interactions, and boost sales efficiency all in one place.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Start Free Trial
            </button>
            <button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-emerald-600" />}
            title="Contact Management"
            description="Organize and manage your contacts efficiently with smart categorization and tagging."
          />
          <FeatureCard 
            icon={<BarChart3 className="h-8 w-8 text-emerald-600" />}
            title="Analytics Dashboard"
            description="Get real-time insights into your sales pipeline and team performance."
          />
          <FeatureCard 
            icon={<Calendar className="h-8 w-8 text-emerald-600" />}
            title="Task Scheduling"
            description="Never miss a follow-up with integrated calendar and task management."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-emerald-100">
      <div className="bg-emerald-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-emerald-900 mb-2">{title}</h3>
      <p className="text-emerald-600">{description}</p>
    </div>
  );
}