"use client";
import React from "react";
import {
  Search,
  Clock,
  Eye,
  Share2,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/components/logo/logo";

const ArticleDetailsPage = () => {
  return (
    <div className="px-[3%] pb-[80px] mx-auto min-h-screen">
      {/* Header Search */}
      <div className="flex justify-between mb-10">
      <div className="flex items-center gap-1">
          <Logo width={160}/>
          <ChevronsRight className="text-[#8CE553] w-[18px] h-[18px]" />
          <p className="text-primary text-sm font-semibold">CRM</p>
        </div>
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-5 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>
      </div>
      <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 italic leading-tight">
              Help Articles Details
            </h1>
            <p className="text-gray-500 text-sm italic font-medium mb-8">
              Browse our comprehensive knowledge base
            </p>

            {/* <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm shadow-primary/20">
                New
              </span>
            </div> */}
            <h2 className="text-xl font-bold text-gray-900 italic mb-4">
              How to create and manage leads
            </h2>
            <div className="flex items-center gap-4 text-xs text-gray-400 font-medium italic">
              <span className="flex items-center gap-1.5 border-r border-gray-100 pr-4">
                <Clock className="w-3.5 h-3.5" />5 min read
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                1,240 views
              </span>
            </div>
          </div>
      <div className="flex gap-10">
        {/* Main Article Content */}
        <div className="flex-1 max-w-[850px] bg-white rounded-[0.5rem] border border-gray-50 shadow-sm p-4">
          {/* Article Header */}
    

          {/* Intro Text */}
          <div className="prose prose-gray max-w-none text-gray-600 italic font-medium leading-relaxed mb-10">
            Welcome to this comprehensive guide. In this article, we'll walk you
            through everything you need to know to get the most out of this
            feature.
          </div>

          {/* Getting Started Section */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-gray-900 italic mb-4">
              Getting Started
            </h3>
            <p className="text-sm text-gray-600 italic font-medium mb-6 leading-relaxed">
              Before we dive into the details, let's make sure you understand
              the basics. This feature is designed to help you streamline your
              workflow and increase productivity.
            </p>

            {/* Quick Setup Box */}
            <div className="bg-primary/[0.03] border border-primary/5 rounded-[1.5rem] p-8 space-y-4">
              <h4 className="text-sm font-bold text-gray-900 italic mb-4">
                Quick Setup Steps
              </h4>
              {[
                "Navigate to the main dashboard",
                "Click on the settings icon in the top right corner",
                "Select your preferences from the available options",
                "Save your changes and you're ready to go",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm shadow-primary/20">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-500 italic font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Key Features */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-gray-900 italic mb-4">
              Key Features
            </h3>
            <p className="text-sm text-gray-600 italic font-medium mb-4 leading-relaxed">
              This powerful feature comes with several capabilities that will
              transform the way you work:
            </p>
            <ul className="space-y-3">
              {[
                "Automated workflows to save time on repetitive tasks",
                "Real-time collaboration with team members",
                "Advanced analytics and reporting dashboards",
                "Customizable templates for common scenarios",
                "Integration with popular third-party tools",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-primary italic font-medium"
                >
                  <span className="mt-2 w-1 h-1 bg-current rounded-full flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          {/* Pro Tip Box */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex gap-4 mb-10">
            <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-primary font-medium italic leading-relaxed">
              <span className="font-bold">Pro Tip:</span> You can customize most
              settings to match your specific workflow. Don't hesitate to
              experiment with different configurations to find what works best
              for you.
            </p>
          </div>

          {/* Best Practices */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-gray-900 italic mb-5 leading-tight">
              Best Practices
            </h3>
            <p className="text-sm text-gray-600 italic font-medium mb-6 leading-relaxed">
              To get the most out of this feature, we recommend following these
              best practices:
            </p>
            <div className="space-y-4">
              {[
                "Review your settings regularly to ensure they align with your current needs",
                "Take advantage of keyboard shortcuts to speed up your workflow",
                "Set up notifications so you never miss important updates",
                "Document your custom configurations for team reference",
              ].map((practice, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#8CE553] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 italic font-medium">
                    {practice}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Important Alert */}
          <div className="bg-orange-50 border-l-4 border-orange-400 rounded-r-2xl p-6 flex gap-4 mb-10">
            <div className="mt-1">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-xs text-orange-700 italic font-bold leading-relaxed">
              Important: Some advanced features require administrator
              privileges. Contact your system administrator if you need access
              to these capabilities.
            </p>
          </div>

          {/* Troubleshooting */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-gray-900 italic mb-4">
              Troubleshooting Common Issues
            </h3>
            <p className="text-sm text-gray-600 italic font-medium mb-6 leading-relaxed">
              If you encounter any problems, here are some common solutions:
            </p>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 italic font-medium">
                  Issue: Changes not saving - Make sure you click the "Save"
                  button after making modifications. Your browser may also be
                  blocking cookies, which can prevent settings from being
                  stored.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 italic font-medium">
                  Issue: Feature not appearing - Verify that you have the
                  necessary permissions and that the feature is enabled in your
                  account settings.
                </p>
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <section className="mb-12 border-b border-gray-100 pb-12">
            <h3 className="text-lg font-bold text-gray-900 italic mb-4">
              Next Steps
            </h3>
            <p className="text-sm text-gray-600 italic font-medium leading-relaxed">
              Now that you've learned the basics, you're ready to start using
              this feature in your daily work. For more advanced topics, check
              out our related articles or contact our support team.
            </p>
          </section>

          {/* Helpful Feedback */}
          <div className="flex items-center gap-6">
            <p className="text-sm font-bold text-gray-900 italic">
              Was this article helpful?
            </p>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#8CE553] text-white rounded-xl text-xs font-bold italic shadow-sm hover:scale-105 transition-transform">
                <ThumbsUp className="w-3.5 h-3.5" />
                Yes, this helped
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl text-xs font-bold italic shadow-sm hover:bg-gray-50 transition-colors">
                No, I need more help
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="w-[320px] space-y-6">
          <div className="bg-white rounded-[0.5rem] border border-gray-50 shadow-sm p-8">
            <h3 className="text-sm font-bold text-gray-800 italic mb-5">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-xl hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-3">
                  <Share2 className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-bold text-gray-400 italic group-hover:text-gray-900">
                    Share Article
                  </span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-xl hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-bold text-gray-400 italic group-hover:text-gray-900">
                    Save for Later
                  </span>
                </div>
              </button>
            </div>

            <div className="mt-10 border-t border-gray-100 pt-8">
              <h3 className="text-sm font-bold text-gray-800 italic mb-5">
                Related Articles
              </h3>
              <div className="space-y-4">
                {[
                  "Advanced configuration options",
                  "Integration with third-party tools",
                  "Keyboard shortcuts reference",
                ].map((article, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="block text-xs text-primary font-bold italic hover:underline truncate"
                  >
                    {article}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-10 border-t border-gray-100 pt-8">
              <h3 className="text-sm font-bold text-gray-800 italic mb-2">
                Still need help?
              </h3>
              <p className="text-[10px] text-gray-400 font-medium italic mb-5">
                Contact our support team for personalized assistance
              </p>
              <Link
                href="/crm/help-articles/contact"
                className="block w-full text-center py-3 bg-primary text-white rounded-xl text-xs font-bold italic shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailsPage;
