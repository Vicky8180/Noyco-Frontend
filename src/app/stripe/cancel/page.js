"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CheckoutCancelled() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard/individual/plan');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-semibold mb-4 text-red-500">Plan Cancelled</h1>
      <p className="text-gray-700 mb-8 text-center max-w-md">
        Your payment was cancelled. Redirecting back to plans page...
      </p>
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <button
        onClick={() => router.push('/dashboard/individual/plan')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go to Plans Now
      </button>
    </div>
  );
} 