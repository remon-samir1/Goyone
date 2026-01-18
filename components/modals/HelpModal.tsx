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
          {
            scale: 0.5,
            opacity: 0,
            y: 40,
            transformOrigin: "bottom right",
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: "back.out(1.5)",
          },
        )
          .from(
            ".help-header",
            {
              opacity: 0,
              y: -10,
              duration: 0.3,
            },
            "-=0.3",
          )
          .from(
            ".help-search",
            {
              opacity: 0,
              scale: 0.9,
              duration: 0.3,
            },
            "-=0.2",
          )
          .from(
            ".help-card",
            {
              opacity: 0,
              y: 20,
              stagger: 0.08,
              duration: 0.4,
              ease: "power2.out",
            },
            "-=0.2",
          )
          .from(
            ".help-close",
            {
              opacity: 0,
              scale: 0,
              duration: 0.3,
              ease: "back.out(2)",
            },
            "-=0.3",
          );
      } else if (!isOpen && render) {
        const tl = gsap.timeline({
          onComplete: () => setRender(false),
        });
        tl.to(modalRef.current, {
          scale: 0.5,
          opacity: 0,
          y: 40,
          duration: 0.4,
          ease: "power2.in",
          transformOrigin: "bottom right",
        }).to(
          ".help-close",
          {
            scale: 0,
            opacity: 0,
            duration: 0.2,
          },
          0,
        );
      }
    },
    { dependencies: [isOpen], scope: containerRef },
  );

  if (!render) return null;

  return (
    <div ref={containerRef} className="fixed bottom-20 right-6 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-3xl shadow-2xl w-[400px] overflow-hidden border border-gray-100 origin-bottom-right"
      >
        {/* Header */}
        <div className="p-6 pb-2 help-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-1.5 shadow-sm shadow-blue-100">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-bold text-xl text-gray-900 italic">
              Help & Support
            </h2>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -left-14 bottom-0 bg-white p-3 rounded-full shadow-xl hover:bg-gray-50 transition-all hover:scale-110 active:scale-95 help-close group z-10"
        >
          <X className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
        </button>

        <div className="p-6">
          {/* Search */}
          <div className="relative mb-6 help-search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/10 transition-all placeholder:italic"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Help Articles */}
            <Link
              href="/crm/help-articles"
              className="p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group help-card hover:border-primary/10 hover:shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-all group-hover:scale-110">
                <Book className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm italic">
                Help Articles
              </h3>
              <p className="text-[11px] text-gray-400 font-medium">
                Browse guides and FAQs
              </p>
            </Link>

            {/* Tutorials */}
            <div className="p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group help-card hover:border-purple-500/10 hover:shadow-sm">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-all group-hover:scale-110">
                <PlayCircle className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm italic">
                Tutorials
              </h3>
              <p className="text-[11px] text-gray-400 font-medium">
                Watch video guides
              </p>
            </div>

            {/* Contact Support */}
            <div className="p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group help-card hover:border-green-500/10 hover:shadow-sm">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-100 transition-all group-hover:scale-110">
                <MessageCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm italic">
                Contact Support
              </h3>
              <p className="text-[11px] text-gray-400 font-medium">
                Chat with our team
              </p>
            </div>

            {/* Submit Ticket */}
            <div className="p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group help-card hover:border-orange-500/10 hover:shadow-sm">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-all group-hover:scale-110">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm italic">
                Submit Ticket
              </h3>
              <p className="text-[11px] text-gray-400 font-medium">
                Report an issue
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
