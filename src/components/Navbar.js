"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../store/hooks';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, loading, logout, refreshAuthToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    const checkAndRefreshAuth = async () => {
      const isAuthPage = pathname?.startsWith('/auth');
      if (isAuthPage) return;

      if (!isAuthenticated && !loading && (typeof localStorage === 'undefined' || localStorage.getItem('loggedOut') !== 'true')) {
        try {
          await refreshAuthToken();
        } catch {
          console.log("Token refresh failed in navbar");
        }
      }
    };
    checkAndRefreshAuth();
  }, [isAuthenticated, loading, refreshAuthToken]);

  const handleLogout = async () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    await logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('loggedOut') === 'true') {
      return '/auth/login';
    }
    if (!user) return '/auth/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'individual') return '/dashboard/individual';
    return '/dashboard/individual'; // Default to individual dashboard
  };

  const loggedOutFlag = typeof localStorage !== 'undefined' && localStorage.getItem('loggedOut') === 'true';

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-300">
              <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2 L14.09 8.26 L20.97 8.92 L15.9 12.97 L17.5 19.84 L12 16.5 L6.5 19.84 L8.1 12.97 L3.03 8.92 L9.91 8.26 Z"/>
              </svg>
            </div>
            <span className="text-headline font-mier text-gray-900 group-hover:text-gray-700 transition-colors">
              Noyco
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/legal/about"
              className="text-body font-mier text-gray-600 hover:text-gray-900 transition-colors relative group"
            >
              About
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link
              href="/blog"
              className="text-body font-mier text-gray-600 hover:text-gray-900 transition-colors relative group"
            >
              Blog
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link
              href="/contact-us"
              className="text-body font-mier text-gray-600 hover:text-gray-900 transition-colors relative group"
            >
              Contact
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link
              href="/docs"
              className="text-body font-mier text-gray-600 hover:text-gray-900 transition-colors relative group"
            >
              Docs
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && !loading && !pathname?.startsWith('/auth') ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-body font-mier text-gray-700">{user?.name || user?.email}</span>
                </div>
                <Link
                  href={getDashboardLink()}
                  className="text-button font-mier border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-button font-mier text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : loading && !loggedOutFlag ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span className="text-body font-mier text-gray-500">Loading...</span>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-button font-mier text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-button font-mier bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-900 px-6 py-2 rounded-lg hover:shadow-md transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <Link
                href="/legal/about"
                className="block text-body-large font-mier text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/blog"
                className="block text-body-large font-mier text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact-us"
                className="block text-body-large font-mier text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/docs"
                className="block text-body-large font-mier text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
            </div>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-200">
              {isAuthenticated && !loading && !pathname?.startsWith('/auth') ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-caption font-mier text-gray-500">Signed in as</p>
                      <p className="text-body font-mier text-gray-800">{user?.name || user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="block w-full text-center text-button font-mier border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-center text-button font-mier text-gray-600 hover:text-gray-800 px-4 py-3 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : loading && !loggedOutFlag ? (
                <div className="flex items-center justify-center space-x-2 py-4">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  <span className="text-body font-mier text-gray-500">Loading...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    className="block w-full text-center text-button font-mier border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full text-center text-button font-mier bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-900 px-4 py-3 rounded-lg hover:shadow-md transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}