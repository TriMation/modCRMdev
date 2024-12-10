import React, { useState } from 'react';
import { DollarSign, User, Calendar, Building2 } from 'lucide-react';
import { Opportunity } from '../../types/opportunity';
import { updateOpportunityStage } from '../../services/opportunityService';

interface OpportunityKanbanProps {
  opportunities: Opportunity[];
  stages: { id: string; name: string; color: string }[];
  onOpportunitySelect: (opportunity: Opportunity) => void;
  selectedOpportunityId?: string;
  onOpportunityUpdate?: () => void;
}

export function OpportunityKanban({
  opportunities,
  stages,
  onOpportunitySelect,
  selectedOpportunityId,
  onOpportunityUpdate
}: OpportunityKanbanProps) {
  const [draggedOpportunity, setDraggedOpportunity] = useState<Opportunity | null>(null);

  const handleDragStart = (opportunity: Opportunity, e: React.DragEvent) => {
    setDraggedOpportunity(opportunity);
    e.dataTransfer.effectAllowed = 'move';
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedOpportunity(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (stageId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedOpportunity && draggedOpportunity.stage_id !== stageId) {
      try {
        await updateOpportunityStage(draggedOpportunity.id, stageId);
        onOpportunityUpdate?.();
      } catch (err) {
        console.error('Error updating opportunity stage:', err);
      }
    }
    setDraggedOpportunity(null);
  };

  const getStageColor = (color: string) => {
    return `bg-${color}-50 dark:bg-${color}-900/20`;
  };

  return (
    <div className="h-full overflow-x-auto max-w-full">
      <div className="inline-flex h-full space-x-4 p-4">
        {stages.map(stage => {
          const stageOpportunities = opportunities.filter(opp => opp.stage_id === stage.id);
          const totalValue = stageOpportunities.reduce((sum, opp) => sum + opp.value, 0);

          return (
            <div 
              key={stage.id} 
              className="w-72 flex-shrink-0 flex flex-col bg-white dark:bg-gray-800 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(stage.id, e)}
            >
              <div className={`mb-4 p-4 rounded-lg ${getStageColor(stage.color)}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-emerald-900 dark:text-emerald-100">
                    {stage.name}
                  </span>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400">
                    {stageOpportunities.length}
                  </span>
                </div>
                <div className="text-sm mt-1 text-emerald-600 dark:text-emerald-400">
                  ${totalValue.toLocaleString()}
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-16rem)]">
                {stageOpportunities.map(opportunity => (
                  <div
                    key={opportunity.id}
                    draggable
                    onDragStart={(e) => handleDragStart(opportunity, e)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onOpportunitySelect(opportunity)}
                    className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm cursor-move transform transition-all duration-200 ${
                      selectedOpportunityId === opportunity.id 
                        ? 'ring-2 ring-emerald-500 shadow-md'
                        : 'hover:shadow-lg hover:-translate-y-0.5'
                    } ${draggedOpportunity?.id === opportunity.id ? 'opacity-50' : ''}`}
                  >
                    <h3 className="font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      {opportunity.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-gray-700/50 p-1.5 rounded">
                        <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                        <span className="font-medium">${opportunity.value.toLocaleString()}</span>
                      </div>
                      {opportunity.account && (
                        <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                          <Building2 className="w-3.5 h-3.5 mr-1.5" />
                          <span className="truncate">{opportunity.account.name}</span>
                        </div>
                      )}
                      {opportunity.contact && (
                        <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                          <User className="w-3.5 h-3.5 mr-1.5" />
                          <span className="truncate">
                            {opportunity.contact.first_name} {opportunity.contact.last_name}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        <span>{new Date(opportunity.close_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}