import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { BidProcessing } from './sections/BidProcessing';
import { BidTeam } from './sections/BidTeam';
import { BidOverview } from './sections/BidOverview';
import { BidStrategy } from './sections/BidStrategy';
import { BidResponse } from './sections/BidResponse';

type BidSection = 'processing' | 'team' | 'overview' | 'strategy' | 'response';

export function BidsPage() {
  const [activeSection, setActiveSection] = useState<BidSection>('processing');

  const sections: { id: BidSection; label: string }[] = [
    { id: 'processing', label: 'Processing' },
    { id: 'team', label: 'Team Members' },
    { id: 'overview', label: 'Overview' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'response', label: 'Response' }
  ];

  const breadcrumbItems = [
    { label: 'Bids' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'processing':
        return <BidProcessing />;
      case 'team':
        return <BidTeam />;
      case 'overview':
        return <BidOverview />;
      case 'strategy':
        return <BidStrategy />;
      case 'response':
        return <BidResponse />;
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {/* Chevron Navigation */}
          <div className="border-b border-emerald-100 dark:border-gray-700">
            <div className="flex">
              {sections.map((section, index) => (
                <React.Fragment key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center py-4 px-6 focus:outline-none ${
                      activeSection === section.id
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                  >
                    <span>{section.label}</span>
                  </button>
                  {index < sections.length - 1 && (
                    <div className="flex items-center text-gray-300 dark:text-gray-600">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {renderSection()}
          </div>
        </div>
      </div>
    </main>
  );
}