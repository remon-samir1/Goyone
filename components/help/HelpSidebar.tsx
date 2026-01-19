"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Book,
  PlayCircle,
  MessageCircle,
  FileText,
  Mail,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const HelpSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Help Articles",
      description: "Guides & FAQs",
      icon: Book,
      href: "/crm/help-articles",
    },
    {
      title: "Tutorials",
      description: "Video guides",
      icon: PlayCircle,
      href: "/crm/help-articles/tutorials",
    },
    {
      title: "Contact Support",
      description: "Guides & FAQs",
      icon: MessageCircle,
      href: "/crm/help-articles/contact",
    },
    {
      title: "Submit Ticket",
      description: "Report issue",
      icon: FileText,
      href: "/crm/help-articles/submit-ticket",
    },
  ];

  return (
    <div className="w-[280px] flex-shrink-0 space-y-6">
      {/* Help Menu */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">
          Help Menu
        </h3>
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border border-transparent",
                  isActive
                    ? "bg-primary/10 text-primary border-primary/5 font-bold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-primary" : "text-gray-400",
                  )}
                />
                <div className="flex flex-col text-left">
                  <span className="text-sm leading-tight">{item.title}</span>
                  <span className="text-[10px] opacity-70 font-normal leading-tight">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Need Help? */}
      <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
        <h3 className="text-sm font-bold text-gray-900 mb-4 italic leading-tight">
          Need Help?
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm shadow-blue-200">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium italic leading-tight">
                Email us
              </p>
              <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                support@crm.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 bg-[#8CE553] rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm shadow-emerald-200">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium italic leading-tight">
                Call us
              </p>
              <p className="text-sm font-bold text-gray-900 group-hover:text-[#8CE553] transition-colors leading-tight">
                1-800-CRM-HELP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSidebar;
