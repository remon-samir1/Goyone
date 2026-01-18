import React, { useRef, useState } from "react";
import {
  X,
  Search,
  Book,
  PlayCircle,
  MessageCircle,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [render, setRender] = useState(isOpen);

  // Handle mounting/unmounting with animation
  useGSAP(
    () => {
      if (isOpen) {
        setRender(true);
        const tl = gsap.timeline();
        tl.fromTo(
          modalRef.current,
          { scale: 0, opacity: 0, transformOrigin: "bottom right" },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            display: "block",
          },
        );
      } else if (!isOpen && render) {
        const tl = gsap.timeline({
          onComplete: () => setRender(false),
        });
        tl.to(modalRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          transformOrigin: "bottom right",
        });
      }
    },
    { dependencies: [isOpen], scope: containerRef },
  );

  if (!render) return null;

  return (
    <div ref={containerRef} className="fixed bottom-20 right-6 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-[400px] overflow-hidden border border-gray-100 origin-bottom-right"
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-1">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-semibold text-lg text-gray-800">
              Help & Support
            </h2>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -left-12 bottom-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="px-5 pb-5">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Help Articles */}
            <Link
              href="/crm/help-articles"
              className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <Book className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Help Articles</h3>
              <p className="text-xs text-gray-500">Browse guides and FAQs</p>
            </Link>

            {/* Tutorials */}
            <div className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                <PlayCircle className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Tutorials</h3>
              <p className="text-xs text-gray-500">Watch video guides</p>
            </div>

            {/* Contact Support */}
            <div className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-100 transition-colors">
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                Contact Support
              </h3>
              <p className="text-xs text-gray-500">Chat with our team</p>
            </div>

            {/* Submit Ticket */}
            <div className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
                <FileText className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Submit Ticket</h3>
              <p className="text-xs text-gray-500">Report an issue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
