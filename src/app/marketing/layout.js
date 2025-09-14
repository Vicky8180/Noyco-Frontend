'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {children}
      </main>
      
    </div>
  );
}