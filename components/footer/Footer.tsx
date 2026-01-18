"use client"
import React, { useState } from "react";
import { Sparkles, FileText, Command, Clock, HelpCircle } from "lucide-react";
import HelpModal from "@/components/modals/HelpModal";

const Footer = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-end items-center z-40">
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-blue-50 rounded-md transition-colors group">
            <Sparkles className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <button className="p-2 hover:bg-blue-50 rounded-md transition-colors group">
            <FileText className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
          </button>
          <button className="p-2 hover:bg-blue-50 rounded-md transition-colors group">
            <Command className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
          </button>
          <button className="p-2 hover:bg-blue-50 rounded-md transition-colors group">
            <Clock className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
          </button>
          <button
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className={`p-2 rounded-md transition-colors group ${isHelpOpen ? "bg-blue-100" : "hover:bg-blue-50"}`}
          >
            <HelpCircle className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
          </button>
        </div>
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};

export default Footer;
