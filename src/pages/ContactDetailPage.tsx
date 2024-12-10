import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Building2, Mail, Phone, Calendar, Pencil, Linkedin } from 'lucide-react';
import { mockContacts } from '../data/mockContacts';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { addQuickAccessRecord } from '../services/quickAccessService';

export function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = mockContacts.find(c => c.id === id);

  useEffect(() => {
    if (contact) {
      addQuickAccessRecord({
        id: contact.id,
        name: `${contact.firstName} ${contact.lastName}`,
        type: 'contact',
        path: `/dashboard/contacts/${contact.id}`
      });
    }
  }, [contact]);

  if (!contact) {
    return (
      <div className="flex-1 p-6">
        <p className="text-emerald-600">Contact not found</p>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Contacts', path: '/dashboard/contacts' },
    { label: `${contact.firstName} ${contact.lastName}` }
  ];

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 rounded-full">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-emerald-900">
                    {contact.title && `${contact.title} `}{contact.firstName} {contact.lastName}
                  </h1>
                  <p className="text-emerald-600">{contact.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(`/dashboard/contacts/${id}/edit`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {contact.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Mail className="w-5 h-5" />
                  <a href={`mailto:${contact.email}`} className="hover:text-emerald-700">
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Phone className="w-5 h-5" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Building2 className="w-5 h-5" />
                  <span>{contact.company}</span>
                </div>
                {contact.linkedIn && (
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <Linkedin className="w-5 h-5" />
                    <a 
                      href={contact.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-700"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {contact.dateOfBirth && (
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <Calendar className="w-5 h-5" />
                    <span>Born: {new Date(contact.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Calendar className="w-5 h-5" />
                  <span>Last Contacted: {new Date(contact.lastContacted).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {contact.tags.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-medium text-emerald-900 mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}