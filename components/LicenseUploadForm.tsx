'use client';

import React, { useState, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';

interface LicenseUploadFormProps {
  userId?: string; // Or some identifier for associating the license with a user
  onFrontImageSelect: (file: File | null) => void;
  onBackImageSelect: (file: File | null) => void;
}

export function LicenseUploadForm({
  userId, 
  onFrontImageSelect, 
  onBackImageSelect 
}: LicenseUploadFormProps) {
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = event.target.files?.[0] || null;
    if (type === 'front') {
      setFrontPreview(file ? URL.createObjectURL(file) : null);
      onFrontImageSelect(file);
    } else {
      setBackPreview(file ? URL.createObjectURL(file) : null);
      onBackImageSelect(file);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4">Upload Driver's License</h2>
      
      <div className="space-y-2">
        <Label htmlFor="licenseFront" className="text-base font-medium">Front of License</Label>
        <Input 
          id="licenseFront" 
          type="file" 
          accept="image/jpeg, image/png" 
          onChange={(e) => handleFileChange(e, 'front')} 
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
        />
        {frontPreview && (
          <div className="mt-2 border rounded-md p-2">
            <p className="text-sm text-gray-500 mb-1">Preview:</p>
            <Image src={frontPreview} alt="Front of license preview" width={200} height={120} className="rounded-md object-contain mx-auto" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseBack" className="text-base font-medium">Back of License</Label>
        <Input 
          id="licenseBack" 
          type="file" 
          accept="image/jpeg, image/png" 
          onChange={(e) => handleFileChange(e, 'back')} 
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
        />
        {backPreview && (
          <div className="mt-2 border rounded-md p-2">
            <p className="text-sm text-gray-500 mb-1">Preview:</p>
            <Image src={backPreview} alt="Back of license preview" width={200} height={120} className="rounded-md object-contain mx-auto" />
          </div>
        )}
      </div>

      {/* FR 5.2.3: Upload Time Constraint - This is a conceptual note. 
          Actual implementation would be part of session management or backend logic. 
          A UI timer could be added if the 20-minute constraint is a hard session timeout initiated here. */}
      {/* <p className="text-xs text-gray-500 text-center mt-2">
        Please complete your upload within 20 minutes.
      </p> */}
    </div>
  );
} 