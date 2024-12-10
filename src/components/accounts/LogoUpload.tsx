import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface LogoUploadProps {
  currentLogo?: string;
  onLogoChange: (logo: string | undefined) => void;
}

export function LogoUpload({ currentLogo, onLogoChange }: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    onLogoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-emerald-900">
        Company Logo
      </label>
      
      <div className="flex items-start space-x-4">
        <div className="w-24 h-24 bg-emerald-50 rounded-lg flex items-center justify-center relative">
          {currentLogo ? (
            <>
              <img 
                src={currentLogo} 
                alt="Company logo" 
                className="w-full h-full object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Upload className="w-8 h-8 text-emerald-400" />
          )}
        </div>
        
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="inline-flex items-center px-4 py-2 border border-emerald-300 rounded-md shadow-sm text-sm font-medium text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
          >
            Choose file
          </label>
          <p className="mt-2 text-sm text-emerald-500">
            Recommended: Square image, max 5MB
          </p>
        </div>
      </div>
    </div>
  );
}