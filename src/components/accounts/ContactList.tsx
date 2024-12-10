import React from 'react';
import { Mail, Phone, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Contact } from '../../types/account';

interface ContactListProps {
  contacts: Contact[];
}

export function ContactList({ contacts }: ContactListProps) {
  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <Link 
          key={contact.id}
          to={`/dashboard/contacts/${contact.id}`}
          className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 rounded-full">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-medium text-emerald-900">
                  {contact.firstName} {contact.lastName}
                  {contact.isPrimary && (
                    <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      Primary
                    </span>
                  )}
                </h4>
                <p className="text-sm text-emerald-600">{contact.role}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center text-sm text-emerald-600">
              <Mail className="w-4 h-4 mr-2" />
              {contact.email}
            </div>
            <div className="flex items-center text-sm text-emerald-600">
              <Phone className="w-4 h-4 mr-2" />
              {contact.phone}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}