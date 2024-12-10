import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-emerald-400" />}
          {item.path ? (
            <Link
              to={item.path}
              className="text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-emerald-900">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}