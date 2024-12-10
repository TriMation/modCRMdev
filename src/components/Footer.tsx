import React from 'react';
import { Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center mb-8">
          <Building2 className="h-8 w-8 text-emerald-600" />
          <span className="ml-2 text-xl font-semibold text-emerald-800">modCRM</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-emerald-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-emerald-600 hover:text-emerald-800">Features</a></li>
              <li><a href="#" className="text-emerald-600 hover:text-emerald-800">Pricing</a></li>
              <li><a href="#" className="text-emerald-600 hover:text-emerald-800">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-emerald-600 hover:text-emerald-800">About</a></li>
              <li><a href="#" className="text-emerald-600 hover:text-emerald-800">Careers</a></li>
              <li><a href="#" className="text-emerald-600 hover:text-emerald-800">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-900 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-emerald-600 hover:text-emerald-800">Blog</a></li>
              <li><a href="#" className="text-emerald-600 hover:text-emerald-800">Documentation</a></li>
              <li><a href="#" className="text-emerald-600 hover:text-emerald-800">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-emerald-600 hover:text-emerald-800">Privacy</a></li>
              <li><a href="#" className="text-emerald-600 hover:text-emerald-800">Terms</a></li>
              <li><a href="#" className="text-emerald-600 hover:text-emerald-800">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-emerald-600 border-t border-emerald-100 pt-8">
          <p>&copy; {new Date().getFullYear()} modCRM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}