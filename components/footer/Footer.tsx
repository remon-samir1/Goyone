"use client";
import React, { useState } from "react";
import { Sparkles, FileText, Command, Clock, HelpCircle } from "lucide-react";
import HelpModal from "@/components/modals/HelpModal";
import StickyNotesModal from "@/components/modals/StickyNotesModal";
import FeedbackModal from "@/components/modals/FeedbackModal";

const Footer = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isStickyNotesOpen, setIsStickyNotesOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-end items-center z-40">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
            className={`p-2 rounded-md transition-colors group ${isFeedbackOpen ? "bg-primary/10" : "hover:bg-primary/5"}`}
          >
            <Sparkles className="w-4 h-4 text-primary group-hover:text-primary" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <button
            onClick={() => setIsStickyNotesOpen(!isStickyNotesOpen)}
            className={`p-2 rounded-md transition-colors group ${isStickyNotesOpen ? "bg-primary/10" : "hover:bg-primary/5"}`}
          >
            <FileText className="w-4 h-4 text-primary group-hover:text-primary" />
          </button>
          <button className="p-2 hover:bg-primary/5 rounded-md transition-colors group">
            <Command className="w-4 h-4 text-primary group-hover:text-primary" />
          </button>
          <button className="p-2 hover:bg-primary/5 rounded-md transition-colors group">
            <Clock className="w-4 h-4 text-primary group-hover:text-primary" />
          </button>
          <button
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className={`p-2 rounded-md transition-colors group ${isHelpOpen ? "bg-primary/10" : "hover:bg-primary/5"}`}
          >
            <HelpCircle className="w-4 h-4 text-primary group-hover:text-primary" />
          </button>
        </div>
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <StickyNotesModal
        isOpen={isStickyNotesOpen}
        onClose={() => setIsStickyNotesOpen(false)}
      />
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
};

export default Footer;
