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
} from "lucide-react";
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
  Links :  boolean
}
const Header = ({Links} : HeaderProps ) => {
  const pathname = usePathname();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { primaryColor, setPrimaryColor } = useTheme();
  const themeColors = ["#3B82F6", "#84CC16", "#EAB308", "#EF4444", "#22C55E"];

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
    <div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Logo />
          <ChevronsRight className="text-[#8CE553] w-[18px] h-[18px]" />
          <p className="text-primary text-sm font-semibold">CRM</p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-stroke rounded-3xl ">
          <Clock4 className="text-primary w-5 h-5" />
          <p className="text-base text-placeholder">{date}</p>
          <Dot className="text-primary " />
          <p className="text-sm text-placeholder">{time}</p>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center border border-stroke p-3 bg-white gap-2 rounded-3xl flex-1">
            <Search className="text-placeholder w-[18px] h-[18px]" />
            <input
              type="text"
              className="flex-1 border-none outline-none text-placeholder h-full"
              placeholder="Serach"
            />
          </div>
          <div
            onClick={() => setIsNotificationOpen(true)}
            className="w-[40px] h-[40px] relative bg-white flex items-center justify-center rounded-full border border-stroke cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <Bell className="text-body  -[18px] h-[18px]" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-stroke">
                  <Image
                    src="/images/user-avatar.png"
                    alt="User Avatar"
                    layout="fill"
                    objectFit="cover"
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
                    src="/images/user-avatar.png"
                    alt="User"
                    layout="fill"
                    objectFit="cover"
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
                <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] p-1 rounded-xl">
                  <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-white shadow-sm text-primary">
                    <Sun className="w-4 h-4" />
                    <span className="text-[10px] font-medium italic">
                      Light
                    </span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-body hover:bg-white/50 transition-colors">
                    <Moon className="w-4 h-4" />
                    <span className="text-[10px] font-medium italic">Dark</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-body hover:bg-white/50 transition-colors">
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
                      {primaryColor.toUpperCase() === color.toUpperCase() && (
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

          <ColorPickerModal
            isOpen={isColorPickerOpen}
            onClose={() => setIsColorPickerOpen(false)}
            onApply={(color) => setPrimaryColor(color)}
          />
        </div>
      </div>

{
  Links  &&
      <div className="mt-7 bg-primary p-4 flex items-center gap-1 rounded-full">
        {links.map((data, index) => {
          const isActive = pathname === data.link;

          return (
            <Link
              key={index}
              href={data.link}
              className={`text-base font-semibold px-6 py-2 rounded-3xl duration-300
              ${
                isActive
                  ? "bg-white text-[#111827]"
                  : "text-white hover:bg-white hover:text-[#111827]"
              }
            `}
            >
              {data.name}
            </Link>
          );
        })}
      </div>
    }
      <NotificationSidebar
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
};

export default Header;
