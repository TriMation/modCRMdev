import React, { useState } from 'react';
import { DollarSign, User, Calendar } from 'lucide-react';
import { Lead } from '../../types/lead';
import { updateLeadStage } from '../../services/leadService';

interface LeadKanbanProps {
  leads: Lead[];
  stages: { id: string; name: string; color: string }[];
  onLeadSelect: (lead: Lead) => void;
  selectedLeadId?: string;
  onLeadUpdate?: () => void;
}

export function LeadKanban({ leads, stages, onLeadSelect, selectedLeadId, onLeadUpdate }: LeadKanbanProps) {
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  const handleDragStart = (lead: Lead, e: React.DragEvent) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedLead(null);
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
    if (draggedLead && draggedLead.stage_id !== stageId) {
      try {
        await updateLeadStage(draggedLead.id, stageId);
        onLeadUpdate?.();
      } catch (err) {
        console.error('Error updating lead stage:', err);
      }
    }
    setDraggedLead(null);
  };

  const getStageColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'yellow': return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'orange': return 'bg-orange-50 dark:bg-orange-900/20';
      case 'green': return 'bg-emerald-50 dark:bg-emerald-900/20';
      case 'red': return 'bg-red-50 dark:bg-red-900/20';
      default: return 'bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStageTextColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'yellow': return 'text-yellow-600 dark:text-yellow-400';
      case 'orange': return 'text-orange-600 dark:text-orange-400';
      case 'green': return 'text-emerald-600 dark:text-emerald-400';
      case 'red': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="h-full overflow-x-auto max-w-full">
      <div className="inline-flex h-full space-x-4 p-4">
        {stages.map(stage => {
          const stageLeads = leads.filter(lead => lead.stage_id === stage.id);
          const totalValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);

          return (
            <div 
              key={stage.id} 
              className="w-72 flex-shrink-0 flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(stage.id, e)}
            >
              <div className={`mb-4 p-4 rounded-lg ${getStageColor(stage.color)}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${getStageTextColor(stage.color)}`}>
                    {stage.name}
                  </span>
                  <span className={`text-sm ${getStageTextColor(stage.color)}`}>
                    {stageLeads.length}
                  </span>
                </div>
                <div className={`text-sm mt-1 ${getStageTextColor(stage.color)}`}>
                  ${totalValue.toLocaleString()}
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-16rem)]">
                {stageLeads.map(lead => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(lead, e)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onLeadSelect(lead)}
                    className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm cursor-move transform transition-all duration-200 ${
                      selectedLeadId === lead.id
                        ? 'ring-2 ring-emerald-500 shadow-md'
                        : 'hover:shadow-lg hover:-translate-y-0.5'
                    } ${draggedLead?.id === lead.id ? 'opacity-50' : ''}`}
                  >
                    <h3 className="font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      {lead.title}
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <DollarSign className="w-4 h-4 mr-1.5" />
                        <span className="font-medium">${lead.value.toLocaleString()}</span>
                      </div>
                      {lead.contacts && (
                        <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                          <User className="w-4 h-4 mr-1.5" />
                          <span className="truncate">
                            {lead.contacts.first_name} {lead.contacts.last_name}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        <span>{new Date(lead.created_at).toLocaleDateString()}</span>
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