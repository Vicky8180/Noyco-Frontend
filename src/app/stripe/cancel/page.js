"use client";
import { useRouter } from 'next/navigation';

export default function CheckoutCancelled() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-semibold mb-4 text-red-500">Payment Cancelled</h1>
      <p className="text-gray-700 mb-8 text-center max-w-md">
        Your payment was cancelled. You can select a plan again at any time.
      </p>
      <button
        onClick={() => router.back()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Back to Plans
      </button>
    </div>
  );
} 