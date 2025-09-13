'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { LandingFooter } from './landing';

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboardPath = pathname?.startsWith('/dashboard');
  
  return (
    <>
      {!isDashboardPath && <Navbar />}
      {children}
      {!isDashboardPath && <LandingFooter />}
    </>
  );
} 


