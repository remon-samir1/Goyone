"use client";
import React, { useState } from "react";
import { Sparkles, FileText, Command, Clock, HelpCircle } from "lucide-react";
import HelpModal from "@/components/modals/HelpModal";
import StickyNotesModal from "@/components/modals/StickyNotesModal";
import FeedbackModal from "@/components/modals/FeedbackModal";
import KeyboardShortcutsModal from "@/components/modals/KeyboardShortcutsModal";
import Link from "next/link";

interface HeaderProps {
  Links?: boolean;
}

const Footer = ({ Links }: HeaderProps) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isStickyNotesOpen, setIsStickyNotesOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        ["INPUT", "TEXTAREA", "SELECT", "CONTENTEDITABLE"].includes(
          (e.target as HTMLElement).tagName,
        ) ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Toggle shortcuts modal with '?' (Shift + /)
      if (e.key === "?") {
        e.preventDefault();
        setIsKeyboardShortcutsOpen((prev) => !prev);
        return;
      }

      // Handle shortcuts only if no other modal is open (basic check)
      if (isHelpOpen || isStickyNotesOpen || isFeedbackOpen) return;

      const lowerKey = e.key.toLowerCase();

      // Ctrl + N: Create New Lead
      if (e.ctrlKey && lowerKey === "m") {
        e.preventDefault();
        window.location.href = "/crm/addLead";
      }

      // Ctrl + K: Quick Search
      if (e.ctrlKey && lowerKey === "k") {
        e.preventDefault();
        // Try to find search input in header
        const searchInput = document.querySelector(
          'input[type="text"][placeholder*="Search"]',
        ) as HTMLInputElement;

        if (searchInput) {
          searchInput.focus();
        } else {
          // Fallback or specific ID if known, e.g., 'global-search'
          const headerSearch = document.querySelector(
            'input[placeholder="Search"]',
          ) as HTMLInputElement;
          if (headerSearch) headerSearch.focus();
        }
      }

      // Ctrl + S: Save Changes (Mock)
      if (e.ctrlKey && lowerKey === "s") {
        e.preventDefault();
        console.log("Save Changes triggered");
        // You could dispatch a custom event here if needed
      }

      // Ctrl + E: Export Data (Mock)
      if (e.ctrlKey && lowerKey === "e") {
        e.preventDefault();
        console.log("Export Data triggered");
      }

      // Esc: Close Modals
      if (e.key === "Escape") {
        if (isKeyboardShortcutsOpen) setIsKeyboardShortcutsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHelpOpen, isStickyNotesOpen, isFeedbackOpen, isKeyboardShortcutsOpen]);

  return (
    <>
      <div className="fixed bottom-0  left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-end items-center z-40">
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
          <button
            onClick={() => setIsKeyboardShortcutsOpen(!isKeyboardShortcutsOpen)}
            className={`p-2 rounded-md transition-colors group ${isKeyboardShortcutsOpen ? "bg-primary/10" : "hover:bg-primary/5"}`}
          >
            <Command className="w-4 h-4 text-primary group-hover:text-primary" />
          </button>
          <Link
            href="/crm/activities"
            className="p-2 hover:bg-primary/5 rounded-md transition-colors group"
          >
            <Clock className="w-4 h-4 text-primary group-hover:text-primary" />
          </Link>
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
      <KeyboardShortcutsModal
        isOpen={isKeyboardShortcutsOpen}
        onClose={() => setIsKeyboardShortcutsOpen(false)}
      />
    </>
  );
};

export default Footer;
