"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, Play, Clock, Eye, X, Pause } from "lucide-react";
import HelpSidebar from "@/components/help/HelpSidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const TutorialsPage = () => {
  const [activeFilter, setActiveFilter] = useState("All Tutorials");
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const filters = [
    { name: "All Tutorials", count: 24 },
    { name: "Getting Started", count: 8 },
    { name: "Lead Management", count: 6 },
    { name: "Reports", count: 5 },
    { name: "Automation", count: 5 },
  ];

  const tutorials = [
    {
      title: "Getting Started with CRM",
      description:
        "Learn the basics of navigating and using your CRM dashboard",
      views: "9,320 views",
      duration: "0:10",
      isNew: true,
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Creating Your First Lead",
      description:
        "Step-by-step guide to adding and managing leads in the system",
      views: "9,320 views",
      duration: "0:12",
      isNew: true,
      thumbnail:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
    },
    {
      title: "Building Custom Reports",
      description: "Create powerful reports to track your sales performance",
      views: "7,560 views",
      duration: "0:10",
      isNew: true,
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bbbda536ad89?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Email Campaign Setup",
      description: "Learn how to create and send email campaigns to your leads",
      views: "6,890 views",
      duration: "0:12",
      isNew: true,
      thumbnail:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
    },
    {
      title: "Automating Your Workflow",
      description:
        "Set up automation rules to save time and increase efficiency",
      views: "5,640 views",
      duration: "0:10",
      isNew: true,
      thumbnail:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Advanced Lead Scoring",
      description:
        "Master lead scoring techniques to prioritize your opportunities",
      views: "6,890 views",
      duration: "0:12",
      isNew: true,
      thumbnail:
        "https://images.unsplash.com/photo-1553484771-047a44eee27b?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
    },
  ];

  // Animation for modal
  useGSAP(
    () => {
      if (selectedVideoIndex !== null && modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.2)" },
        );
      }
    },
    { dependencies: [selectedVideoIndex], scope: containerRef },
  );

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setSelectedVideoIndex(null);
          setIsPlaying(false);
        },
      });
    }
  };

  const goToVideo = (index: number) => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedVideoIndex(index);
    setIsPlaying(false);
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 100);
  };

  return (
    <div
      ref={containerRef}
      className="px-[3%] pb-[50px] mx-auto min-h-[calc(100vh-100px)]"
    >
      {/* Header Title Section */}
      <div className="flex justify-between items-end mb-8 ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Tutorials</h1>
          <p className="text-gray-500 text-sm mt-1 italic font-medium leading-tight">
            Watch step-by-step video guides
          </p>
        </div>
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>
      </div>

      <div className="flex gap-8">
        <HelpSidebar />

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Filters */}
          <div className="flex items-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter.name}
                onClick={() => setActiveFilter(filter.name)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 italic font-medium border",
                  activeFilter === filter.name
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-gray-500 border-gray-100 hover:border-primary/30",
                )}
              >
                {filter.name}
                <span
                  className={cn(
                    "text-[10px] opacity-70",
                    activeFilter === filter.name
                      ? "text-white"
                      : "text-gray-400",
                  )}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-2 gap-6">
            {tutorials.map((video, index) => (
              <div
                key={index}
                onClick={() => setSelectedVideoIndex(index)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 hover:shadow-md transition-all group flex flex-col cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Play className="w-5 h-5 fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                  {video.isNew && (
                    <span className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      New
                    </span>
                  )}
                  <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    {video.duration}
                  </span>
                </div>

                {/* Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors italic leading-tight mb-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                    {video.description}
                  </p>
                  <div className="mt-auto flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      {video.views}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {video.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideoIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div
            ref={modalRef}
            className="relative z-10 w-full max-w-[600px] mx-4"
          >
            {/* Navigation Dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {tutorials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToVideo(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    selectedVideoIndex === index
                      ? "bg-primary scale-110"
                      : "bg-white/50 hover:bg-white/80",
                  )}
                />
              ))}
            </div>

            {/* Video Player Container */}
            <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl aspect-video relative">
              {/* Video Thumbnail/Placeholder */}
              {!isPlaying && (
                <>
                  <Image
                    src={tutorials[selectedVideoIndex].thumbnail}
                    alt={tutorials[selectedVideoIndex].title}
                    fill
                    className="object-cover"
                  />
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    {/* Play Button */}
                    <button
                      onClick={handlePlayVideo}
                      className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    >
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-lg">
                        <Play className="w-7 h-7 fill-current ml-1.5" />
                      </div>
                    </button>
                  </div>
                </>
              )}

              {/* HTML5 Video Player */}
              {isPlaying && (
                <video
                  ref={videoRef}
                  src={tutorials[selectedVideoIndex].videoUrl}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  onEnded={() => setIsPlaying(false)}
                />
              )}

              {/* Duration Badge */}
              {!isPlaying && (
                <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                  {tutorials[selectedVideoIndex].duration}
                </span>
              )}
            </div>

            {/* Video Title */}
            <div className="text-center mt-6">
              <h3 className="text-white text-lg font-bold italic">
                {tutorials[selectedVideoIndex].title}
              </h3>
              <p className="text-white/60 text-sm mt-1 italic">
                {tutorials[selectedVideoIndex].description}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialsPage;
