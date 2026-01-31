import React from "react";
import {
  Search,
  Book,
  PlayCircle,
  MessageCircle,
  FileText,
  Zap,
  Users,
  BarChart2,
  Mail,
  Settings,
  Shield,
  ChevronRight,
  Clock,
  Eye,
  Phone,
  ArrowRight,
} from "lucide-react";
import HelpSidebar from "@/components/help/HelpSidebar";
import Link from "next/link";

const HelpArticlesPage = () => {
  return (
    <div className="px-[3%] pb-[50px] mx-auto min-h-[calc(100vh-100px)]">
      {/* Header Title Section - Aligned with content */}
      <div className="flex justify-between items-end mb-8 ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help Articles</h1>
          <p className="text-gray-500 text-sm mt-1">
            Browse our comprehensive knowledge base
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
        {/* Sidebar */}
        <div className="w-[260px] flex-shrink-0 space-y-6">
          {/* Help Menu */}
        
<HelpSidebar/>
          {/* Need Help? */}
          <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Need Help?
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm shadow-blue-200">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email us</p>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    support@crm.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 bg-[#8CE553] rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm shadow-emerald-200">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Call us</p>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#8CE553] transition-colors">
                    1-800-CRM-HELP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-10">
          {/* Browse by Category */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Browse by Category
            </h2>
            <div className="grid grid-cols-3 gap-5">
              <CategoryCard
                icon={<Zap className="w-5 h-5 text-primary" />}
                color="bg-primary/10"
                title="Getting Started"
                count={16}
              />
              <CategoryCard
                icon={<Users className="w-5 h-5 text-purple-500" />}
                color="bg-purple-50"
                title="Managing Leads"
                count={10}
              />
              <CategoryCard
                icon={<BarChart2 className="w-5 h-5 text-emerald-500" />}
                color="bg-emerald-50"
                title="Reports & Analytics"
                count={15}
              />
              <CategoryCard
                icon={<Mail className="w-5 h-5 text-sky-500" />}
                color="bg-sky-50"
                title="Email Templates"
                count={18}
              />
              <CategoryCard
                icon={<Settings className="w-5 h-5 text-orange-500" />}
                color="bg-orange-50"
                title="Automation"
                count={8}
              />
              <CategoryCard
                icon={<Shield className="w-5 h-5 text-red-500" />}
                color="bg-red-50"
                title="Security & Privacy"
                count={6}
              />
            </div>
          </section>

          {/* Popular Articles */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Popular Articles
              </h2>
              <button className="text-sm text-primary hover:text-primary/80 font-medium">
                Clear filter
              </button>
            </div>

            <div className="space-y-4">
              <ArticleCard
                isNew
                title="How to create and manage leads"
                desc="Learn the basics of adding, organizing, and tracking your sales leads"
                time="5 min"
                views="1,240 views"
              />
              <ArticleCard
                isNew
                title="Setting up your first campaign"
                desc="Step-by-step guide to creating and launching your first marketing campaign"
                time="8 min"
                views="980 views"
              />
              <ArticleCard
                title="Exporting data to CSV and Excel"
                desc="Learn how to export your CRM data in various formats for analysis"
                time="3 min"
                views="950 views"
              />
              <ArticleCard
                title="Creating custom email templates"
                desc="Design professional email templates for your outreach campaigns"
                time="6 min"
                views="980 views"
              />
              <ArticleCard
                title="Understanding user roles and permissions"
                desc="Configure access levels and permissions for your team members"
                time="5 min"
                views="980 views"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const CategoryCard = ({
  icon,
  color,
  title,
  count,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  count: number;
}) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group flex items-start gap-4">
    <div
      className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors truncate pr-2">
          {title}
        </h3>
        <span className="bg-gray-100 text-gray-500 text-[10px] font-medium px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      </div>
    </div>
  </div>
);

const ArticleCard = ({
  isNew,
  title,
  desc,
  time,
  views,
}: {
  isNew?: boolean;
  title: string;
  desc: string;
  time: string;
  views: string;
}) => (
  <Link href='/crm/help-articles/details' className="bg-white block p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {isNew && (
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              New 
            </span>
          )}
          <h3
            className={`font-semibold text-gray-900 group-hover:text-primary transition-colors ${!isNew && "mt-1"}`}
          >
            {title}
          </h3>
        </div>
        <p className="text-sm text-gray-500">{desc}</p>
        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {time}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Eye className="w-3.5 h-3.5" />
            {views}
          </div>
        </div>
      </div>
      <div className="text-gray-300 group-hover:text-primary transition-colors transform group-hover:translate-x-1 duration-300">
        <ArrowRight className="w-5 h-5" />
      </div>
    </div>
  </Link>
);

export default HelpArticlesPage;
