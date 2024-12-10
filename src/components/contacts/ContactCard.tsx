import React from 'react';
import { User, Building2, Mail, Phone } from 'lucide-react';
import { Contact } from '../../types/contact';

interface ContactCardProps {
  contact: Contact;
  onClick: (contact: Contact) => void;
}

export function ContactCard({ contact, onClick }: ContactCardProps) {
  return (
    <div 
      onClick={() => onClick(contact)}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg w-12 h-12 flex items-center justify-center">
            <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
              {contact.first_name} {contact.last_name}
            </h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {contact.position || 'No position specified'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
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
  );
}