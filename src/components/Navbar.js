// "use client";
// import Link from 'next/link';
// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../store/hooks';
// import { useRouter, usePathname } from 'next/navigation';
// import { TOKEN_REFRESH_INTERVAL } from '../lib/constant';

// export default function Navbar() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const { user, isAuthenticated, loading, logout, refreshAuthToken } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();
//   const refreshIntervalRef = useRef(null);

//   // Try to refresh token on initial load if needed
//   useEffect(() => {
//     const checkAndRefreshAuth = async () => {
//       // Skip auto-refresh on auth pages to avoid re-auth after logout
//       const isAuthPage = pathname?.startsWith('/auth');
//       if (isAuthPage) return;

//       // Only try to refresh if not authenticated, not already loading, and not explicitly logged out
//       if (!isAuthenticated && !loading && (typeof localStorage === 'undefined' || localStorage.getItem('loggedOut') !== 'true')) {
//         try {
//           await refreshAuthToken();
//         } catch (error) {
//           console.log("Token refresh failed in navbar");
//         }
//       }
//     };

//     checkAndRefreshAuth();
//   }, [isAuthenticated, loading, refreshAuthToken]);

//   const handleLogout = async () => {
//     if (refreshIntervalRef.current) {
//       clearInterval(refreshIntervalRef.current);
//       refreshIntervalRef.current = null;
//     }
//     await logout();
//     router.push('/');
//   };

//   const getDashboardLink = () => {
//     // If we have explicit loggedOut flag, point to login
//     if (typeof localStorage !== 'undefined' && localStorage.getItem('loggedOut') === 'true') {
//       return '/auth/login';
//     }
//     if (!user) return '/auth/login';

//     if (user.role === 'admin') {
//       return '/dashboard/admin';
//     } else if (user.role === 'hospital') {
//       return '/dashboard/hospital';
//     } else if (user.role === 'assistant') {
//       return '/dashboard/assistant';
//     } else if (user.role === 'individual') {
//       return '/dashboard/individual';
//     }

//     return '/';
//   };

//   const loggedOutFlag = typeof localStorage !== 'undefined' && localStorage.getItem('loggedOut') === 'true';

//   return (
//     <nav className="bg-white shadow-sm border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo on the left */}
//           <div className="flex items-center flex-shrink-0">
//             <Link
//               href="/"
//               className="text-2xl text-gray-900 -tracking-wider hover:text-gray-700 transition-colors duration-200 select-none"
//             >
//               Noyco
//             </Link>
//           </div>
//           {/* Centered navigation links */}
//           <div className="hidden sm:flex flex-1 items-center justify-center space-x-4">
//             <Link href="/" className={`${pathname === '/' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
//               Home
//             </Link>
//             <Link href="/marketing/pricing" className={`${pathname === '/marketing/pricing' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
//               Pricing
//             </Link>
            
//           </div>
//           {/* Right side (auth buttons) */}
//           <div className="hidden sm:ml-6 sm:flex sm:items-center">
//             {isAuthenticated && !loading && !pathname?.startsWith('/auth') ? (
//               <div className="flex items-center space-x-4">
//                 <span className="text-sm text-gray-700">
//                   {user?.email}
//                 </span>
//                 <Link href={getDashboardLink()} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
//                   Dashboard
//                 </Link>
//               </div>
//             ) : loading && !loggedOutFlag ? (
//               <span className="text-sm text-gray-500">Loading...</span>
//             ) : (
//               <div className="flex items-center space-x-4">
//                 <Link href="/auth/login" className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//                   Log in
//                 </Link>
//                 <Link href="/auth/signup" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
//                   Sign up
//                 </Link>
//               </div>
//             )}
//           </div>
//           {/* Mobile menu button */}
//           <div className="-mr-2 flex items-center sm:hidden">
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
//             >
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 {mobileMenuOpen ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {mobileMenuOpen && (
//         <div className="sm:hidden">
//           <div className="pt-2 pb-3 space-y-1">
//             <Link href="/" className={`${pathname === '/' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
//               Home
//             </Link>
//             <Link href="/marketing/features" className={`${pathname === '/marketing/features' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
//               Features
//             </Link>
//             <Link href="/marketing/pricing" className={`${pathname === '/marketing/pricing' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
//               Pricing
//             </Link>
            
//           </div>
//           <div className="pt-4 pb-3 border-t border-gray-200">
//             {isAuthenticated && !loading && !pathname?.startsWith('/auth') ? (
//               <div className="space-y-1">
//                 <div className="px-4 py-2">
//                   <p className="text-sm font-medium text-gray-500">Signed in as</p>
//                   <p className="text-sm font-medium text-gray-800">{user?.email}</p>
//                 </div>
//                 <Link href={getDashboardLink()} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
//                   Dashboard
//                 </Link>
//               </div>
//             ) : loading && !loggedOutFlag ? (
//               <div className="px-4 py-2">
//                 <p className="text-sm font-medium text-gray-500">Loading...</p>
//               </div>
//             ) : (
//               <div className="space-y-1">
//                 <Link href="/auth/login" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
//                   Log in
//                 </Link>
//                 <Link href="/auth/signup" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
//                   Sign up
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }
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
    if (user.role === 'hospital') return '/dashboard/hospital';
    if (user.role === 'assistant') return '/dashboard/assistant';
    if (user.role === 'individual') return '/dashboard/individual';
    return '/';
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
