import React from 'react';
import { User, Building2, Mail, Phone } from 'lucide-react';
import { Contact } from '../../types/contact';

interface ContactListProps {
  contacts: Contact[];
  onContactSelect: (contact: Contact) => void;
}

export function ContactList({ contacts, onContactSelect }: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 text-emerald-600 dark:text-emerald-400">
        No contacts found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          onClick={() => onContactSelect(contact)}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 dark:bg-gray-700 rounded-full">
                <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-medium text-emerald-900 dark:text-emerald-100">
                  {contact.firstName} {contact.lastName}
                </h4>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{contact.role}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {contact.email && (
              <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                <Mail className="w-4 h-4 mr-2" />
                {contact.email}
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                <Phone className="w-4 h-4 mr-2" />
                {contact.phone}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}