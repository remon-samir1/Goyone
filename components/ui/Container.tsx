import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxW?: "sm" | "md" | "lg" | "xl" | "2xl" | "none";
}

const Container = ({ children, className, maxW = "2xl" }: ContainerProps) => {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    none: "max-w-none",
  };

  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        maxWidthClasses[maxW],
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Container;
