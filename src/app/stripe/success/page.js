"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

export default function CheckoutSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Optionally refresh billing data then redirect to dashboard
    async function refresh() {
      try {
        await apiRequest('/billing/plan', { suppressError: true });
      } catch {}
      setTimeout(() => router.push('/dashboard'), 3000);
    }
    refresh();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-semibold mb-4 text-green-600">Payment Success 🎉</h1>
      <p className="text-gray-700 mb-8 text-center max-w-md">
        Thank you! Your subscription is now active. You will be redirected to your dashboard shortly.
      </p>
      <button
        onClick={() => router.push('/dashboard')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Go to Dashboard
      </button>
    </div>
  );
} 