import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { Bid } from '../../types/bid';

interface BidRecordsListProps {
  bids: Bid[];
  onBidSelect: (bid: Bid) => void;
  selectedBidId?: string;
  onDeleteBid?: (bid: Bid) => void;
}

export function BidRecordsList({ bids, onBidSelect, selectedBidId, onDeleteBid }: BidRecordsListProps) {
  const [expandedBids, setExpandedBids] = useState<Record<string, boolean>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Only show first 4 bids
  const visibleBids = bids.slice(0, 4);

  const toggleExpand = (bidId: string) => {
    setExpandedBids(prev => ({
      ...prev,
      [bidId]: !prev[bidId]
    }));
  };

  if (bids.length === 0) {
    return (
      <div className="text-center py-8 text-emerald-600 dark:text-emerald-400">
        No bids found.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
      {visibleBids.map((bid) => (
        <div
          key={bid.id}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all ${
            selectedBidId === bid.id ? 'ring-2 ring-emerald-500' : ''
          }`}
        >
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg"
            onClick={() => onBidSelect(bid)}
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(bid.id);
                    }}
                    className="p-1 hover:bg-emerald-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                  >
                    {expandedBids[bid.id] ? (
                      <ChevronDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                  <div>
                    <h3 className="font-medium text-emerald-900 dark:text-emerald-100">
                      {bid.title}
                    </h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      Bid #{bid.bid_number || 'N/A'}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  bid.bid_no_bid_decision === true
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                    : bid.bid_no_bid_decision === false
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {bid.bid_no_bid_decision === true ? 'Bid' : bid.bid_no_bid_decision === false ? 'No-Bid' : 'Pending'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteBid) {
                      setShowDeleteConfirm(bid.id);
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {expandedBids[bid.id] && (
            <div className="px-4 pb-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400">Release Date:</span>
                  <span className="ml-2 text-emerald-900 dark:text-emerald-100">
                    {bid.release_date ? new Date(bid.release_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400">Submission Date:</span>
                  <span className="ml-2 text-emerald-900 dark:text-emerald-100">
                    {new Date(bid.submission_date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400">Award Date:</span>
                  <span className="ml-2 text-emerald-900 dark:text-emerald-100">
                    {bid.award_date ? new Date(bid.award_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400">Status:</span>
                  <span className="ml-2 text-emerald-900 dark:text-emerald-100">
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
              Delete Bid
            </h3>
            <p className="text-emerald-600 dark:text-emerald-400 mb-6">
              Are you sure you want to delete this bid? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const bid = bids.find(b => b.id === showDeleteConfirm);
                  if (bid) {
                    onDeleteBid?.(bid);
                  }
                  setShowDeleteConfirm(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}