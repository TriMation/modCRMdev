import React, { useState } from 'react';
import { Plus, Search, User, Mail, Calendar, Shield } from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';
import { User as UserType } from '../../types/user';
import { SearchField } from '../common/SearchField';

export function UserManagement() {
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = mockUsers.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">User Management</h2>
        <button
          onClick={() => setShowNewUserForm(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      <div className="mb-4">
        <SearchField
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search users..."
        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {showNewUserForm && (
        <NewUserForm onClose={() => setShowNewUserForm(false)} />
      )}
    </div>
  );
}

function UserCard({ user }: { user: UserType }) {
  return (
    <div className="border border-emerald-100 dark:border-gray-700 rounded-lg p-4 hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-emerald-100 dark:bg-gray-700 rounded-full">
            <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-medium text-emerald-900 dark:text-emerald-100">{user.firstName} {user.lastName}</h3>
            <div className="flex items-center space-x-4 text-sm text-emerald-600 dark:text-emerald-400">
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            user.status === 'active' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {user.status}
          </span>
          {user.lastLogin && (
            <div className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NewUserForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'user',
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4">Add New User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-1">
              Email*
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-1">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-1">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-1">
              Role*
            </label>
            <select
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}