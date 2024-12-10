import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Contact } from '../types/contact';
import { getContacts } from '../services/contactService';
import { ContactCard } from '../components/contacts/ContactCard';
import { ContactFilters } from '../components/contacts/ContactFilters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SearchField } from '../components/common/SearchField';

export function ContactsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{
    role?: string;
    account?: string;
  }>({});

  useEffect(() => {
    async function loadContacts() {
      try {
        if (!user) return;
        const data = await getContacts();
        setContacts(data);
      } catch (err) {
        setError('Failed to load contacts');
        console.error('Error loading contacts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContacts();
  }, [user]);

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (prev[filterType as keyof typeof prev] === value) {
        delete newFilters[filterType as keyof typeof prev];
      } else {
        newFilters[filterType as keyof typeof prev] = value;
      }
      return newFilters;
    });
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.position || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !selectedFilters.role || contact.position === selectedFilters.role;
    const matchesAccount = !selectedFilters.account || contact.account_id === selectedFilters.account;

    return matchesSearch && matchesRole && matchesAccount;
  });

  const handleContactClick = (contact: Contact) => {
    navigate(`/dashboard/contacts/${contact.id}`);
  };

  const breadcrumbItems = [
    { label: 'Contacts' }
  ];

  if (loading) {
    return <div className="flex-1 p-6">
      <div className="animate-pulse">Loading contacts...</div>
    </div>;
  }

  if (error) {
    return <div className="flex-1 p-6">
      <div className="text-red-600">{error}</div>
    </div>;
  }

  const activeFilterCount = Object.keys(selectedFilters).length;

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">Contacts</h1>
        <button 
          onClick={() => navigate('/dashboard/contacts/new')}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Contact</span>
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            showFilters 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' 
              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-gray-700 dark:text-emerald-400 dark:hover:bg-gray-600'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-emerald-600 text-white dark:bg-emerald-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <SearchField
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search contacts..."
        />
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <ContactFilters
            contacts={contacts}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        )}

        <div className={`flex-1 grid grid-cols-1 md:grid-cols-2 ${showFilters ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-4`}>
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onClick={handleContactClick}
            />
          ))}
          {filteredContacts.length === 0 && (
            <div className="col-span-full text-center py-8 text-emerald-600 dark:text-emerald-400">
              No contacts found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}