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
    <nav className="bg-gradient-to-br from-gray-50 via-white to-amber-50/30 font-['Poppins'] m-0 p-0 mt-[10px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-4xl font-bold text-gray-900 select-none tracking-tight"
          >
            Noyco
          </Link>

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              href="/docs"
              className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
            >
              Docs
            </Link>
            {isAuthenticated && !loading && !pathname?.startsWith('/auth') ? (
              <>
                <span className="text-sm text-gray-700">{user?.email}</span>
                <Link
                  href={getDashboardLink()}
                  className="px-4 py-1.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
              </>
            ) : loading && !loggedOutFlag ? (
              <span className="text-sm text-gray-500">Loading...</span>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-6 py-1.5 text-lg font-semibold border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50"
                >
                  log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-1.5 text-lg font-semibold rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                >
                  sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
        <div className="sm:hidden px-4 pb-4 border-t border-gray-200">
          <Link
            href="/docs"
            className="block mt-3 px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Documentation
          </Link>
          {isAuthenticated && !loading && !pathname?.startsWith('/auth') ? (
            <>
              <p className="text-sm text-gray-500 mt-3">Signed in as</p>
              <p className="text-sm text-gray-800">{user?.email}</p>
              <Link
                href={getDashboardLink()}
                className="block mt-3 px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Dashboard
              </Link>
            </>
          ) : loading && !loggedOutFlag ? (
            <p className="mt-3 text-sm text-gray-500">Loading...</p>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block mt-3 px-4 py-2 text-base font-medium border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50"
              >
                log in
              </Link>
              <Link
                href="/auth/signup"
                className="block mt-3 px-4 py-2 text-base font-medium rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500"
              >
                sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
