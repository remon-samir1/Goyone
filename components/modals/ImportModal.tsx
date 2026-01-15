
import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out",
        isAnimating ? "opacity-100" : "opacity-0"
      )}
    >
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative bg-white rounded-xl w-full max-w-[600px] p-8 shadow-2xl transform transition-all duration-300 ease-out",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary italic">Import</h2>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-mainText italic mb-2">File</label>
          <div
            className={cn(
              "border rounded-lg p-10 flex flex-col items-center justify-center transition-colors duration-200",
              isDragging ? "border-primary bg-blue-50/10 border-dashed" : "border-stroke border-solid",
              file ? "bg-green-50/30 border-green-500" : ""
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls"
            />
            
            {file ? (
              <div className="text-center">
                 <p className="text-sm font-bold text-mainText italic">{file.name}</p>
                 <p className="text-xs text-body italic mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="mt-2 text-xs text-red-500 font-bold hover:underline"
                 >
                  Remove
                 </button>
              </div>
            ) : (
               <p className="text-sm text-body italic">
                Drag & Drop your files or <span onClick={handleBrowseClick} className="text-primary cursor-pointer hover:underline font-bold">Browse</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-8 py-2 rounded-full border border-primary text-primary text-sm font-bold italic hover:bg-blue-50 transition-colors"
          >
            Cancel
          </button>
          <button
            className="px-8 py-2 rounded-full bg-primary text-white text-sm font-bold italic hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
