"use client";

import React, { useRef, useState } from "react";
import { User, Camera } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string | File;
  onChange: (file: File | undefined) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onChange(file);
    }
  };

  const displayImage = preview || (typeof value === "string" ? value : null);

  return (
    <div className="relative group">
      <div
        onClick={handleClick}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:scale-105"
      >
        {displayImage ? (
          <Image
            src={displayImage}
            alt="Avatar"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-12 h-12 text-white" />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
          <Camera className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {/* Edit badge */}
      <div
        className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary/90 transition-colors"
        onClick={handleClick}
      >
        <Camera className="w-4 h-4 text-white" />
      </div>
    </div>
  );
};

export default ImageUpload;
