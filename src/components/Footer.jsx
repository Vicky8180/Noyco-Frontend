import React from 'react';

const footerSections = [
  {
    title: "Product",
    links: [
      { name: "Home", href: "/" },
      { name: "Features", href: "/marketing/features" },
      { name: "Pricing", href: "/marketing/pricing" },
      { name: "About", href: "/marketing/about" },
      { name: "Blog", href: "/marketing/blog" },
      { name: "Contact", href: "/marketing/contact" },
    ]
  },
  {
    title: "Platform",
    links: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Admin", href: "/dashboard/admin" },
      { name: "Individual", href: "/dashboard/individual" },
    ]
  },
  {
    title: "Account",
    links: [
      { name: "Login", href: "/auth/login" },
      { name: "Sign Up", href: "/auth/signup" },
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/marketing/privacy" },
      // Add Terms of Use or other legal pages as needed
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Reports", href: "/dashboard/admin/reports" },
      { name: "Analytics", href: "/dashboard/admin/analytics" },
      { name: "Metrics", href: "/dashboard/individual/metrics" },
    ]
  },
];

const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-200">
    <div className="max-w-6xl mx-auto px-6 pt-10 pb-5">
      {/* Footer Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
        {footerSections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-900 tracking-wide uppercase">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <a
                    href={link.href}
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-6">
        {/* Additional Services */}
        <div className="mb-6">
          <p className="text-xs text-gray-600 leading-relaxed">
            Need help? Visit our <a href="/dashboard/assistant/knowledge-base" className="text-blue-600 hover:underline">Knowledge Base</a> or <a href="/marketing/contact" className="text-blue-600 hover:underline">contact support</a>.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Copyright and Legal Links */}
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-xs text-gray-600">
              Copyright © 2025 Noyco Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="/marketing/privacy" className="text-xs text-gray-600 hover:text-gray-900 transition-colors duration-200 border-r border-gray-300 pr-6">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Site Map
              </a>
            </div>
          </div>

          {/* Country/Region Selector */}
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
            <a href="#" className="text-xs text-gray-600 hover:text-gray-900 transition-colors duration-200">
              United States
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;