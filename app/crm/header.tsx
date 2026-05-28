"use client";
import React, { useEffect, useState } from "react";
import Logo from "@/components/logo/logo";
import {
  Bell,
  ChevronsRight,
  Clock4,
  Dot,
  Search,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  Check,
  Settings,
  Lock,
  Palette,
  LogOut,
  Plus,
  Menu,
  X,
} from "lucide-react";
import LeadSearch from "@/components/crm/LeadSearch";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ColorPickerModal from "@/components/modals/ColorPickerModal";
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import NotificationSidebar from "@/components/crm/NotificationSidebar";
interface HeaderProps {
  Links: boolean;
}
const Header = ({ Links }: HeaderProps) => {
  const pathname = usePathname();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { primaryColor, setPrimaryColor, themeMode, setThemeMode } = useTheme();
  const themeColors = ["#3B82F6", "#84CC16", "#EAB308", "#EF4444", "#22C55E"];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const formattedDate = now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setDate(formattedDate);
      setTime(formattedTime);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const links: { [key: string]: string }[] = [
    {
      name: "Leads",
      link: "/crm",
    },
    {
      name: "Individual Account",
      link: "/crm/individual-account",
    },
    {
      name: "Company Account",
      link: "/crm/company-account",
    },
    {
      name: "Tasks",
      link: "/crm/tasks",
    },
    {
      name: "Calls",
      link: "/crm/calls",
    },
    {
      name: "Meetings",
      link: "/crm/meetings",
    },
    {
      name: "Deals",
      link: "/crm/deals",
    },
    {
      name: "Invoices",
      link: "/crm/invoices",
    },
    {
      name: "Calender",
      link: "/crm/calender",
    },
    {
      name: "Activities",
      link: "/crm/activities",
    },
  ];
  return (
    <>
      <div
        className={`
          transition-all duration-300 z-[50] px-[3%] py-4
          ${
            isScrolled
              ? "sticky top-0 left-0 right-0  bg-white/70 backdrop-blur-lg shadow-md  py-3"
              : "sticky top-0 bg-transparent"
          }
            `}
      >
        <div className="flex items-center justify-between lg:justify-start gap-4">
          <div className="flex items-center gap-1 shrink-0">
            <Logo />
            <ChevronsRight className="text-header-accent w-[18px] h-[18px]" />
            <Link href={"/crm"} className="text-primary text-sm font-semibold">
              CRM
            </Link>
          </div>

          {/* DateTime - Desktop Only */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white border border-stroke rounded-3xl shrink-0">
            <Clock4 className="text-primary w-5 h-5" />
            <p className="text-base text-placeholder whitespace-nowrap">
              {date}
            </p>
            <Dot className="text-primary" />
            <p className="text-sm text-placeholder whitespace-nowrap">{time}</p>
          </div>

          {/* Search - Responsive */}
          <div className="hidden sm:flex flex-1 items-center ">
            <LeadSearch />
          </div>

          {/* Actions & Mobile Menu */}
          <div className="flex items-center gap-2">
            <div
              onClick={() => setIsNotificationOpen(true)}
              className="w-[40px] h-[40px] relative bg-white flex items-center justify-center rounded-full border border-stroke cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Bell className="text-body w-[18px] h-[18px]" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
            </div>

            {/* User Profile - Desktop Only Link/Trigger */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-stroke">
                      <Image
                        src="/images/user.png"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <ChevronDown className="w-4 h-4 text-placeholder" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[280px] p-2 bg-white rounded-2xl shadow-xl border border-stroke"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-stroke shrink-0">
                      <Image
                        src="/images/user.png"
                        alt="User"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary italic text-base">
                        Mohamed
                      </h4>
                      <p className="text-xs text-body italic truncate max-w-[150px]">
                        mohamed@company.com
                      </p>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Theme Mode */}
                  <div className="p-3">
                    <h5 className="text-sm font-bold text-placeholder italic mb-3">
                      Theme Mode
                    </h5>
                    <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] dark:bg-gray-800 p-1 rounded-xl">
                      <button
                        onClick={() => setThemeMode("light")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors",
                          themeMode === "light"
                            ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
                            : "text-body hover:bg-white/50 dark:hover:bg-gray-700/50",
                        )}
                      >
                        <Sun className="w-4 h-4" />
                        <span className="text-[10px] font-medium italic">
                          Light
                        </span>
                      </button>
                      <button
                        onClick={() => setThemeMode("dark")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors",
                          themeMode === "dark"
                            ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
                            : "text-body hover:bg-white/50 dark:hover:bg-gray-700/50",
                        )}
                      >
                        <Moon className="w-4 h-4" />
                        <span className="text-[10px] font-medium italic">
                          Dark
                        </span>
                      </button>
                      <button
                        onClick={() => setThemeMode("system")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors",
                          themeMode === "system"
                            ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
                            : "text-body hover:bg-white/50 dark:hover:bg-gray-700/50",
                        )}
                      >
                        <Monitor className="w-4 h-4" />
                        <span className="text-[10px] font-medium italic">
                          System
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Theme Colors */}
                  <div className="px-3 pb-3">
                    <h5 className="text-sm font-bold text-placeholder italic mb-3">
                      Theme Colors
                    </h5>
                    <div className="flex items-center gap-2">
                      {themeColors.map((color) => (
                        <button
                          key={color}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                            primaryColor.toUpperCase() === color.toUpperCase()
                              ? "ring-2 ring-primary ring-offset-2"
                              : "",
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => setPrimaryColor(color)}
                        >
                          {primaryColor.toUpperCase() ===
                            color.toUpperCase() && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </button>
                      ))}
                      <button
                        className="w-8 h-8 rounded-full border border-stroke flex items-center justify-center hover:bg-gray-50 transition-colors text-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsColorPickerOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Menu Items */}
                  <div className="p-2 space-y-1">
                    <DropdownMenuItem className="cursor-pointer text-mainText font-medium italic p-2.5 rounded-xl hover:bg-[#F8FAFC]">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                        <Settings className="w-4 h-4" />
                      </div>
                      <span className="ml-3">Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-mainText font-medium italic p-2.5 rounded-xl hover:bg-[#F8FAFC]">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <span className="ml-3">Lock Screen</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-mainText font-medium italic p-2.5 rounded-xl hover:bg-[#F8FAFC]">
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                        <Palette className="w-4 h-4" />
                      </div>
                      <span className="ml-3">Themes</span>
                    </DropdownMenuItem>

                    <div className="mt-4 pt-2 flex justify-center">
                      <button className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold italic text-sm transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center bg-white border border-stroke rounded-full hover:bg-gray-50 transition-colors"
              >
                <Menu className="w-5 h-5 text-body" />
              </button>
            </div>

            {/* Custom Mobile Sidebar */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-[100] lg:hidden">
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <div className="absolute top-0 left-0 bottom-0 w-[300px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                  <div className="p-6 border-b border-stroke flex items-center justify-between">
                    <Logo />
                    <button onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="w-6 h-6 text-body hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 py-8">
                    <div className="space-y-2">
                      <div className="px-4 py-2 text-xs font-bold text-placeholder uppercase tracking-wider">
                        Navigation
                      </div>
                      {links.map((data, index) => {
                        const isActive = pathname === data.link;
                        return (
                          <Link
                            key={index}
                            href={data.link}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold italic transition-all",
                              isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-mainText hover:bg-background/5",
                            )}
                          >
                            <ChevronsRight
                              className={cn(
                                "w-4 h-4",
                                isActive ? "text-white/70" : "text-placeholder",
                              )}
                            />
                            {data.name}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="px-4 text-xs font-bold text-placeholder uppercase tracking-wider">
                        Information
                      </div>
                      <div className="px-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-body italic">
                          <Clock4 className="w-4 h-4 text-primary" />
                          {date} • {time}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-stroke">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-stroke shrink-0">
                        <Image
                          src="/images/user.png"
                          alt="User"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary italic text-base">
                          Mohamed
                        </h4>
                        <p className="text-xs text-body italic truncate max-w-[150px]">
                          mohamed@company.com
                        </p>
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 p-3 text-red-500 bg-red-50 rounded-xl font-bold italic text-sm hover:bg-red-100 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}

            <ColorPickerModal
              isOpen={isColorPickerOpen}
              onClose={() => setIsColorPickerOpen(false)}
              onApply={(color) => setPrimaryColor(color)}
            />
          </div>
        </div>

        {Links && (
          <>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex mt-7 bg-gradient-to-r from-header-gradient-from to-header-gradient-to p-4 items-center gap-1 rounded-full shadow-lg shadow-primary/10">
              {links.map((data, index) => {
                const isActive = pathname === data.link;
                return (
                  <Link
                    key={index}
                    href={data.link}
                    className={`text-sm font-semibold px-6 py-2 rounded-3xl duration-300 whitespace-nowrap
                    ${
                      isActive
                        ? "bg-white text-[#111827] shadow-sm"
                        : "text-white hover:bg-white/20"
                    }
                  `}
                  >
                    {data.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Search Row */}
            <div className="flex sm:hidden mt-4">
              <LeadSearch />
            </div>
          </>
        )}
      </div>

      <NotificationSidebar
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
};

export default Header;
