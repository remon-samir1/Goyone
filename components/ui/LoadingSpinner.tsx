"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const spinner = (
    <div className="relative">
      {/* Outer ring */}
      <div
        className={`${sizeClasses[size]} rounded-full border-4 border-primary/20`}
      />
      {/* Spinning gradient arc */}
      <div
        className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-4 border-transparent border-t-primary border-r-primary/50 animate-spin`}
        style={{ animationDuration: "0.8s" }}
      />
      {/* Inner pulse */}
      <div
        className={`absolute inset-2 rounded-full bg-gradient-to-br from-primary/30 to-transparent animate-pulse`}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {/* Large animated rings */}
            <div className="w-20 h-20 rounded-full border-4 border-primary/10 animate-ping absolute inset-0" />
            <div className="w-20 h-20 rounded-full border-4 border-primary/20" />
            <div
              className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-primary border-r-[#8CE553] animate-spin"
              style={{ animationDuration: "1s" }}
            />
            <div
              className="absolute inset-2 w-16 h-16 rounded-full border-4 border-transparent border-b-primary/50 border-l-[#8CE553]/50 animate-spin"
              style={{
                animationDuration: "1.5s",
                animationDirection: "reverse",
              }}
            />
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-[#8CE553] animate-pulse shadow-lg shadow-primary/50" />
            </div>
          </div>
          <p className="text-sm font-bold text-primary italic animate-pulse">
            Creating Lead...
          </p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
