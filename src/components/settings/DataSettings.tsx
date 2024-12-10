import React, { useState, useEffect } from 'react';
import { Plus, X, Pencil, AlertCircle, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../../config/supabase';

interface Stage {
  id: string;
  name: string;
  description?: string;
  order_position: number;
  color?: string;
}

export function DataSettings() {
  const [leadStages, setLeadStages] = useState<Stage[]>([]);
  const [opportunityStages, setOpportunityStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStage, setEditingStage] = useState<{ type: 'lead' | 'opportunity'; stage: Stage | null }>({
    type: 'lead',
    stage: null
  });

  useEffect(() => {
    loadStages();
  }, []);

  async function loadStages() {
    try {
      const [{ data: leadData }, { data: oppData }] = await Promise.all([
        supabase.from('lead_stages').select('*').order('order_position'),
        supabase.from('opportunity_stages').select('*').order('order_position')
      ]);

      setLeadStages(leadData || []);
      setOpportunityStages(oppData || []);
    } catch (err) {
      console.error('Error loading stages:', err);
      setError('Failed to load stages');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveStage(type: 'lead' | 'opportunity', stage: Stage) {
    try {
      const table = type === 'lead' ? 'lead_stages' : 'opportunity_stages';
      const { error } = await supabase
        .from(table)
        .upsert([stage]);

      if (error) throw error;
      await loadStages();
      setEditingStage({ type: 'lead', stage: null });
    } catch (err) {
      console.error('Error saving stage:', err);
      setError('Failed to save stage');
    }
  }

  async function handleDeleteStage(type: 'lead' | 'opportunity', id: string) {
    try {
      const table = type === 'lead' ? 'lead_stages' : 'opportunity_stages';
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadStages();
    } catch (err) {
      console.error('Error deleting stage:', err);
      setError('Failed to delete stage');
    }
  }

  const handleDragEnd = async (result: any, type: 'lead' | 'opportunity') => {
    if (!result.destination) return;

    setLoading(true);
    const items = type === 'lead' ? [...leadStages] : [...opportunityStages];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      // Update order_position for all items
      const updatedItems = items.map((item, index) => ({
        id: item.id,
        order_position: index + 1
      }));

      const table = type === 'lead' ? 'lead_stages' : 'opportunity_stages';
      const { error } = await supabase
        .from(table)
        .upsert(updatedItems);

      if (error) throw error;

      if (type === 'lead') {
        setLeadStages(updatedItems);
      } else {
        setOpportunityStages(updatedItems);
      }
    } catch (err) {
      console.error('Error updating stage order:', err);
      setError('Failed to update stage order');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="animate-pulse">Loading data settings...</div>;
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Lead Stages */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Lead Stages</h2>
          <button
            onClick={() => setEditingStage({
              type: 'lead',
              stage: {
                id: '',
                name: '',
                order_position: leadStages.length + 1,
                color: 'gray'
              }
            })}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stage</span>
          </button>
        </div>

        <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'lead')}>
          <Droppable droppableId="lead-stages">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {leadStages.map((stage, index) => (
                  <Draggable
                    key={stage.id}
                    draggableId={stage.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move text-emerald-400 hover:text-emerald-600 dark:text-emerald-500 dark:hover:text-emerald-300"
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-emerald-900 dark:text-emerald-100">{stage.name}</h3>
                            {stage.description && (
                              <p className="text-sm text-emerald-600 dark:text-emerald-400">{stage.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingStage({ type: 'lead', stage })}
                            className="p-2 hover:bg-emerald-100 dark:hover:bg-gray-600 rounded-lg"
                          >
                            <Pencil className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteStage('lead', stage.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                          >
                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Opportunity Stages */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Opportunity Stages</h2>
          <button
            onClick={() => setEditingStage({
              type: 'opportunity',
              stage: {
                id: '',
                name: '',
                order_position: opportunityStages.length + 1
              }
            })}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stage</span>
          </button>
        </div>

        <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'opportunity')}>
          <Droppable droppableId="opportunity-stages">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {opportunityStages.map((stage, index) => (
                  <Draggable
                    key={stage.id}
                    draggableId={stage.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move text-emerald-400 hover:text-emerald-600 dark:text-emerald-500 dark:hover:text-emerald-300"
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-emerald-900 dark:text-emerald-100">{stage.name}</h3>
                            {stage.description && (
                              <p className="text-sm text-emerald-600 dark:text-emerald-400">{stage.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingStage({ type: 'opportunity', stage })}
                            className="p-2 hover:bg-emerald-100 dark:hover:bg-gray-600 rounded-lg"
                          >
                            <Pencil className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteStage('opportunity', stage.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                          >
                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Edit Stage Modal */}
      {editingStage.stage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                {editingStage.stage.id ? 'Edit' : 'Add'} {editingStage.type === 'lead' ? 'Lead' : 'Opportunity'} Stage
              </h3>
              <button
                onClick={() => setEditingStage({ type: 'lead', stage: null })}
                className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveStage(editingStage.type, editingStage.stage!);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editingStage.stage.name}
                  onChange={(e) => setEditingStage(prev => ({
                    ...prev,
                    stage: { ...prev.stage!, name: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                  Description
                </label>
                <textarea
                  value={editingStage.stage.description || ''}
                  onChange={(e) => setEditingStage(prev => ({
                    ...prev,
                    stage: { ...prev.stage!, description: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                  Order Position
                </label>
                <input
                  type="number"
                  value={editingStage.stage.order_position}
                  onChange={(e) => setEditingStage(prev => ({
                    ...prev,
                    stage: { ...prev.stage!, order_position: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                  min="1"
                />
              </div>

              {editingStage.type === 'lead' && (
                <div>
                  <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                    Color
                  </label>
                  <select
                    value={editingStage.stage.color}
                    onChange={(e) => setEditingStage(prev => ({
                      ...prev,
                      stage: { ...prev.stage!, color: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="blue">Blue</option>
                    <option value="yellow">Yellow</option>
                    <option value="orange">Orange</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                    <option value="gray">Gray</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingStage({ type: 'lead', stage: null })}
                  className="px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}