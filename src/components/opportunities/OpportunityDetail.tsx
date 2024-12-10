import React, { useState } from 'react';
import { X, DollarSign, User, Calendar, Building2, MessageSquare, Pencil, Package } from 'lucide-react';
import { Opportunity } from '../../types/opportunity';
import { EditOpportunityForm } from './EditOpportunityForm';
import { TaskDetail } from '../tasks/TaskDetail';
import { Task } from '../../types/task';
import { NewTaskButton } from '../tasks/NewTaskButton';

interface OpportunityWithRelations extends Opportunity {
  stage: {
    name: string;
  };
  account: {
    name: string;
  };
  contact?: {
    first_name: string;
    last_name: string;
  };
}

interface OpportunityDetailProps {
  opportunity: OpportunityWithRelations;
  onClose: () => void;
}

export function OpportunityDetail({ opportunity, onClose }: OpportunityDetailProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) {
      return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900';
    } else if (probability >= 30) {
      return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900';
    }
    return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900';
  };

  const getStageColor = (stageName: string) => {
    switch (stageName.toLowerCase()) {
      case 'prospecting':
        return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900';
      case 'qualification':
        return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900';
      case 'negotiation':
        return 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900';
      case 'closed_won':
        return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900';
      case 'closed_lost':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900';
    }
  };

  if (showEditForm) {
    return <EditOpportunityForm opportunity={opportunity} onClose={() => setShowEditForm(false)} />;
  }

  if (selectedTask) {
    return <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />;
  }

  return (
    <div className="w-96 border-l border-emerald-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto">
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-emerald-100 dark:border-gray-700 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Opportunity Details</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEditForm(true)}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-emerald-600 dark:text-emerald-400"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-emerald-600 dark:text-emerald-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-2">{opportunity.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(opportunity.stage.name)}`}>
              {opportunity.stage.name}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(opportunity.probability)}`}>
              {opportunity.probability}% probability
            </span>
          </div>
          <p className="text-emerald-600 dark:text-emerald-400">{opportunity.description}</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="h-2 bg-emerald-100 dark:bg-gray-700 rounded-full">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${opportunity.probability}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5 mr-2" />
            <span>Value: ${opportunity.value.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <Building2 className="w-5 h-5 mr-2" />
            <span>Account: {opportunity.account.name}</span>
          </div>
          {opportunity.contact && (
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <User className="w-5 h-5 mr-2" />
              <span>Contact: {opportunity.contact.first_name} {opportunity.contact.last_name}</span>
            </div>
          )}
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-5 h-5 mr-2" />
            <span>Expected Close: {new Date(opportunity.close_date).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="border-t border-emerald-100 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h4 className="font-medium text-emerald-900 dark:text-emerald-100">Related Tasks</h4>
            </div>
            <NewTaskButton 
              opportunityId={opportunity.id} 
              accountId={opportunity.account_id}
            />
          </div>
          
          <div className="text-center py-8 text-emerald-600 dark:text-emerald-400">
            No tasks yet.
          </div>
        </div>
      </div>
    </div>
  );
}