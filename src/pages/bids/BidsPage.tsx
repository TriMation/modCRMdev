import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getBids, createBid } from '../../services/bidService';
import { BidRecordsList } from '../../components/bids/BidRecordsList';
import { Bid } from '../../types/bid';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { BidFilters } from '../../components/bids/BidFilters';
import { SearchField } from '../../components/common/SearchField';
import { BidProcessing } from './sections/BidProcessing';
import { BidTeam } from './sections/BidTeam';
import { BidOverview } from './sections/BidOverview';
import { BidStrategy } from './sections/BidStrategy';
import { BidResponse } from './sections/BidResponse';

type BidSection = 'processing' | 'team' | 'overview' | 'strategy' | 'response';

export function BidsPage() {
  const [activeSection, setActiveSection] = useState<BidSection>('processing');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<{
    status?: string;
    submissionDate?: string;
  }>({});
  const [sortBy, setSortBy] = useState<{
    field: 'title' | 'submission_date' | 'award_date';
    direction: 'asc' | 'desc';
  }>({
    field: 'submission_date',
    direction: 'desc'
  });

  const { user } = useAuth();

  const loadBids = async () => {
    try {
      if (!user) return;
      const data = await getBids();
      setBids(data);
      
      // If no bid is selected and bids exist, select the first one
      if (!selectedBid && data.length > 0) {
        setSelectedBid(data[0]);
      }
    } catch (err) {
      setError('Failed to load bids');
      console.error('Error loading bids:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBids();
  }, [user]);

  const handleCreateNewBid = async () => {
    try {
      if (!user) return;
      
      const newBid = {
        title: 'New Bid',
        status: 'draft' as const,
        submission_date: new Date().toISOString(),
        owner_id: user.id
      };

      const createdBid = await createBid(newBid);
      await loadBids();
      setSelectedBid(createdBid);
    } catch (err) {
      setError('Failed to create new bid');
      console.error('Error creating bid:', err);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (prev[filterType as keyof typeof prev] === value) {
        delete newFilters[filterType as keyof typeof prev];
      } else {
        newFilters[filterType as keyof typeof prev] = value;
      }
      return newFilters;
    });
  };

  const filteredBids = bids
    .filter((bid) => {
      const matchesSearch = bid.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedFilters.status || bid.status === selectedFilters.status;

      let matchesSubmissionDate = true;
      if (selectedFilters.submissionDate) {
        const submissionDate = new Date(bid.submission_date);
        const today = new Date();

        switch (selectedFilters.submissionDate) {
          case 'this_week':
            const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
            const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
            matchesSubmissionDate = submissionDate >= weekStart && submissionDate <= weekEnd;
            break;
          case 'next_week':
            const nextWeekStart = new Date(today.setDate(today.getDate() - today.getDay() + 7));
            const nextWeekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 13));
            matchesSubmissionDate = submissionDate >= nextWeekStart && submissionDate <= nextWeekEnd;
            break;
          case 'this_month':
            matchesSubmissionDate =
              submissionDate.getMonth() === today.getMonth() &&
              submissionDate.getFullYear() === today.getFullYear();
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesSubmissionDate;
    })
    .sort((a, b) => {
      const direction = sortBy.direction === 'asc' ? 1 : -1;

      switch (sortBy.field) {
        case 'title':
          return direction * a.title.localeCompare(b.title);
        case 'submission_date':
          return direction * (new Date(a.submission_date).getTime() - new Date(b.submission_date).getTime());
        case 'award_date':
          if (!a.award_date) return 1;
          if (!b.award_date) return -1;
          return direction * (new Date(a.award_date).getTime() - new Date(b.award_date).getTime());
        default:
          return 0;
      }
    });

  const sections: { id: BidSection; label: string }[] = [
    { id: 'processing', label: 'Processing' },
    { id: 'team', label: 'Team Members' },
    { id: 'overview', label: 'Overview' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'response', label: 'Response' }
  ];

  const breadcrumbItems = [{ label: 'Bids' }];

  const renderSection = () => {
    // If no bids exist, show empty form
    if (bids.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-emerald-600 dark:text-emerald-400 mb-4">
            No bids found. Create your first bid to get started.
          </p>
          <button
            onClick={handleCreateNewBid}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Create New Bid
          </button>
        </div>
      );
    }

    // If no bid is selected, show message
    if (!selectedBid) {
      return (
        <div className="text-center py-8">
          <p className="text-emerald-600 dark:text-emerald-400">
            Select a bid from the list above or create a new one.
          </p>
        </div>
      );
    }

    switch (activeSection) {
      case 'processing':
        return <BidProcessing bid={selectedBid} onUpdate={loadBids} />;
      case 'team':
        return <BidTeam bid={selectedBid} onUpdate={loadBids} />;
      case 'overview':
        return <BidOverview bid={selectedBid} onUpdate={loadBids} />;
      case 'strategy':
        return <BidStrategy bid={selectedBid} onUpdate={loadBids} />;
      case 'response':
        return <BidResponse bid={selectedBid} onUpdate={loadBids} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center space-x-4">
            <select
              value={`${sortBy.field}-${sortBy.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortBy({
                  field: field as typeof sortBy.field,
                  direction: direction as 'asc' | 'desc'
                });
              }}
              className="px-3 py-1 bg-emerald-50 dark:bg-gray-700 border border-emerald-100 dark:border-gray-600 rounded-lg text-emerald-600 dark:text-emerald-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="submission_date-desc">Submission Date (Newest)</option>
              <option value="submission_date-asc">Submission Date (Oldest)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="award_date-desc">Award Date (Newest)</option>
              <option value="award_date-asc">Award Date (Oldest)</option>
            </select>
            <SearchField value={searchTerm} onChange={setSearchTerm} placeholder="Search bids..." />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <BidFilters
            bids={bids}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        )}

        <div className="flex-1">
          <div className="mb-6">
            <BidRecordsList
              bids={filteredBids}
              onBidSelect={setSelectedBid}
              selectedBidId={selectedBid?.id}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
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

            <div className="p-6">{renderSection()}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
