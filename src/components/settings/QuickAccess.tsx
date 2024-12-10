import React, { useEffect, useState } from 'react';
import { Clock, Building2, User, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuickAccessStore from '../../store/quickAccessStore';
import { QuickAccessRecord } from '../../types/quickAccess';

export function QuickAccess() {
  const [records, setRecords] = useState<QuickAccessRecord[]>([]);

  useEffect(() => {
    setRecords(QuickAccessStore.getRecords());
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-emerald-900">Quick Access</h2>
      </div>

      {records.length === 0 ? (
        <p className="text-emerald-600 text-sm">No recently viewed records</p>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <Link
              key={`${record.type}-${record.id}`}
              to={record.path}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-emerald-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-white transition-colors">
                  {record.type === 'account' ? (
                    <Building2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <User className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-900">{record.name}</p>
                  <p className="text-xs text-emerald-600">
                    {new Date(record.timestamp).toLocaleDateString()} • {record.type}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}