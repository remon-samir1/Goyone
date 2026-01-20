"use client";
import React, { useRef } from "react";
import { Phone } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallModal = ({ isOpen, onClose }: CallModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isOpen && modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" },
        );
      }
    },
    { dependencies: [isOpen], scope: containerRef },
  );

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Call Modal Window */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-[400px] mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Content */}
        <div className="p-8 text-center">
          {/* Phone Icon */}
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-5">
            <Phone className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-gray-900 font-bold text-lg mb-2">Call Support</h3>
          <p className="text-gray-500 text-sm font-medium mb-6">
            Our support team is available to help you
          </p>

          {/* Phone Number */}
          <div className="bg-primary/5 rounded-2xl p-4 mb-6">
            <p className="text-gray-400 text-xs font-medium mb-1">Call us at</p>
            <p className="text-mainText text-lg font-semibold">+1 (555) 123-4567</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleClose}
              className="px-8 py-2.5 border border-primary text-primary rounded-full text-sm font-bold italic hover:bg-primary/5 transition-colors"
            >
              Cancel
            </button>
            <a
              href="tel:+15551234567"
              onClick={handleClose}
              className="px-8 py-2.5 bg-primary text-white rounded-full text-sm font-bold italic hover:bg-primary/90 transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
