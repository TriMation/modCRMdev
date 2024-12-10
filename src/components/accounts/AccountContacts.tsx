import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ContactList } from '../contacts/ContactList';
import { getContactsByAccount } from '../../services/contactService';
import { Contact } from '../../types/contact';

interface AccountContactsProps {
  accountId: string;
}

export function AccountContacts({ accountId }: AccountContactsProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadContacts() {
      try {
        const data = await getContactsByAccount(accountId);
        setContacts(data);
      } catch (err) {
        setError('Failed to load contacts');
        console.error('Error loading contacts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContacts();
  }, [accountId]);

  if (loading) {
    return <div className="animate-pulse">Loading contacts...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Contacts</h2>
        <button 
          onClick={() => window.location.href = `/dashboard/contacts/new?account=${accountId}`}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          <span>New Contact</span>
        </button>
      </div>

      <ContactList 
        contacts={contacts}
        onContactSelect={(contact) => window.location.href = `/dashboard/contacts/${contact.id}`}
      />
    </div>
  );
}