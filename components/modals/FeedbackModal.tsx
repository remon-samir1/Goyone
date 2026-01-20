"use client";
import React, { useRef, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [feedback, setFeedback] = useState("");

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
          setFeedback("");
          onClose();
        },
      });
    }
  };

  const handleSubmit = () => {
    if (feedback.trim()) {
      // Handle feedback submission logic here
      console.log("Feedback submitted:", feedback);
      handleClose();
    }
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
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-gray-900 font-semibold text-sm">
              Share Your Feedback
            </h3>
          </div>
          <div className="w-7" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-900 text-sm font-medium mb-3">
            What do you think about the new UI?
          </p>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts, suggestions, or report issues..."
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white resize-none placeholder:text-gray-400 placeholder:italic transition-all"
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex items-center justify-center gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 border border-primary text-primary rounded-full text-sm font-semibold hover:bg-primary/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!feedback.trim()}
            className="flex-1 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
