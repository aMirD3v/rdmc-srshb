"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  Database,
  FileText,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SignInModal from "../auth/SignInModal";
import UserNav from "../auth/UserNav";

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDatasetMenuOpen, setIsDatasetMenuOpen] = useState(false);

  const navItems = [
    {
      label: "Dataset Communities",
      href: "/communities",
      icon: Database,
      description: "Browse by research groups",
    },
    {
      label: "All Datasets",
      href: "/datasets",
      icon: FileText,
      description: "Complete repository collection",
    },
    {
      label: "Statistics",
      href: "/statistics",
      icon: BarChart3,
      description: "Usage and analytics",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.jpg" alt="logo" width={50} height={50} />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-900">
                    Somali Regional State Health Bureau
                  </h1>
                  <p className="text-xs text-gray-600">
                    Research Data Repository
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                    <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                      {item.label}
                    </span>
                  </div>
                  <div className="absolute hidden group-hover:block top-full left-0 mt-1 w-48 px-2 py-1 text-xs text-gray-500 bg-white rounded shadow-lg">
                    {item.description}
                  </div>
                </Link>
              ))}
            </nav>

            {/* Search and User Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button - Desktop */}
              <button className="hidden md:flex items-center gap-2 px-4 py-2 ">
                <Search size={18} className="text-gray-500" />
              </button>

              {/* User Actions */}
              {session ? <UserNav /> : <SignInModal />}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Search */}
              <div className="mb-6">
                <form action="/search" method="GET" className="relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="q"
                      placeholder="Search repository..."
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                    />
                  </div>
                </form>
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <item.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link
                  href="/submit"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all"
                >
                  <FileText size={20} />
                  <span className="font-medium">Submit Research</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      <div className="hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 pt-20">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search datasets, publications, authors, communities..."
                className="w-full pl-14 pr-4 py-4 text-2xl border-0 focus:ring-0 focus:outline-none bg-transparent"
                autoFocus
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {/* Quick Search Suggestions */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Public Health",
                  "Clinical Studies",
                  "Academic Research",
                  "Data Visualization",
                  "Open Access",
                ].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
