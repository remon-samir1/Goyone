"use client";
import React, { useRef, useState } from "react";
import { X, Plus, Trash2, StickyNote } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface StickyNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Note {
  id: string;
  content: string;
  color: string;
  createdAt: Date;
}

const NOTE_COLORS = [
  { id: "white", bg: "bg-white", border: "border-gray-200" },
  { id: "blue", bg: "bg-blue-100", border: "border-blue-200" },
  { id: "yellow", bg: "bg-yellow-100", border: "border-yellow-300" },
  { id: "pink", bg: "bg-pink-100", border: "border-pink-200" },
  { id: "green", bg: "bg-green-100", border: "border-green-200" },
  { id: "purple", bg: "bg-purple-100", border: "border-purple-200" },
];

const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const StickyNotesModal = ({ isOpen, onClose }: StickyNotesModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      content: "Follow up with Sarah Johnson tomorrow",
      color: "yellow",
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2m ago
    },
    {
      id: "2",
      content: "Prepare proposal for TechCorp",
      color: "pink",
      createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1h ago
    },
    {
      id: "3",
      content: "Team meeting at 3 PM",
      color: "blue",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3h ago
    },
  ]);

  useGSAP(
    () => {
      if (isOpen && modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, x: 20, scale: 0.95 },
          { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: "power2.out" },
        );
      }
    },
    { dependencies: [isOpen], scope: containerRef },
  );

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        x: 20,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setIsAddingNote(false);
          setNewNoteContent("");
          setSelectedColor("yellow");
          onClose();
        },
      });
    }
  };

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: newNoteContent.trim(),
        color: selectedColor,
        createdAt: new Date(),
      };
      setNotes([newNote, ...notes]);
      setNewNoteContent("");
      setSelectedColor("yellow");
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleCancelAdd = () => {
    setIsAddingNote(false);
    setNewNoteContent("");
    setSelectedColor("yellow");
  };

  const getNoteColorClasses = (colorId: string) => {
    const color = NOTE_COLORS.find((c) => c.id === colorId);
    return color
      ? `${color.bg} ${color.border}`
      : "bg-yellow-100 border-yellow-300";
  };

  if (!isOpen) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 pointer-events-none">
      {/* Modal positioned at bottom right */}
      <div
        ref={modalRef}
        className="absolute bottom-14 right-4 w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-gray-100"
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <button
            onClick={handleClose}
            className="w-7 h-7 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-primary" />
            <h3 className="text-gray-900 font-semibold text-sm">
              {isAddingNote ? "Add New Sticky Notes" : "Sticky Notes"}
            </h3>
          </div>
          <div className="w-7" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="max-h-[400px] overflow-y-auto">
          {/* Add New Note Form */}
          {isAddingNote && (
            <div className="p-4 border-b border-gray-100">
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Write your thought here..."
                className="w-full px-3 py-2.5 bg-yellow-50 border border-yellow-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none placeholder:text-gray-400 placeholder:italic"
                rows={3}
                autoFocus
              />

              {/* Color Selection */}
              <div className="flex items-center gap-2 mt-3">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-6 h-6 rounded-full ${color.bg} border-2 transition-all ${
                      selectedColor === color.id
                        ? "border-primary ring-2 ring-primary/20"
                        : color.border
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleAddNote}
                  disabled={!newNoteContent.trim()}
                  className="flex-1 py-2 bg-[#EDDA2E] text-white rounded-full text-sm font-semibold hover:bg-[#d4c429] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Note
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Notes List */}
          <div className="p-3 space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`relative p-3 rounded-xl border-l-4 ${getNoteColorClasses(note.color)} shadow-sm`}
              >
                {/* Red indicator dot */}
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full" />

                <p className="text-gray-900 text-sm font-medium pr-6 leading-relaxed">
                  {note.content}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-400 text-xs">
                    {getTimeAgo(note.createdAt)}
                  </span>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}

            {notes.length === 0 && !isAddingNote && (
              <div className="text-center py-8">
                <StickyNote className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No notes yet</p>
              </div>
            )}
          </div>
        </div>

        {/* New Note Button */}
        {!isAddingNote && (
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={() => setIsAddingNote(true)}
              className="w-full py-2.5 bg-primary text-white rounded-full text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyNotesModal;
