import React, { useState } from 'react';
import { Plus, User, Trash2 } from 'lucide-react';
import { BidTeamMember } from '../../../types/bid';

export function BidTeam() {
  const [teamMembers, setTeamMembers] = useState<BidTeamMember[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    user_id: '',
    role: '',
    responsibilities: ''
  });

  const roles = [
    'Bid Manager',
    'Technical Lead',
    'Subject Matter Expert',
    'Pricing Specialist',
    'Quality Reviewer',
    'Legal Reviewer'
  ];

  const handleAddMember = () => {
    // TODO: Implement adding team member to Supabase
    setShowAddMember(false);
  };

  const handleRemoveMember = (memberId: string) => {
    // TODO: Implement removing team member from Supabase
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Team Members</h2>
        <button
          onClick={() => setShowAddMember(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {showAddMember && (
        <div className="bg-emerald-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Team Member
              </label>
              <select
                value={newMember.user_id}
                onChange={(e) => setNewMember(prev => ({ ...prev, user_id: e.target.value }))}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select team member</option>
                {/* TODO: Add team members from Supabase */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                Role
              </label>
              <select
                value={newMember.role}
                onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select role</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              Responsibilities
            </label>
            <textarea
              value={newMember.responsibilities}
              onChange={(e) => setNewMember(prev => ({ ...prev, responsibilities: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter team member responsibilities"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowAddMember(false)}
              className="px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMember}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-emerald-50 dark:bg-gray-700 rounded-full">
                <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium text-emerald-900 dark:text-emerald-100">
                  {member.user?.first_name} {member.user?.last_name}
                </h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{member.role}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemoveMember(member.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {teamMembers.length === 0 && (
          <div className="text-center py-8 text-emerald-600 dark:text-emerald-400">
            No team members added yet.
          </div>
        )}
      </div>
    </div>
  );
}