import React, { useState } from 'react';
import { openCustomerPortal } from '../services/portalService';
import { Loader2 } from 'lucide-react';
import { showToast } from '@/lib/toast';

export default function SubscriptionManager({ children, className = '' }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await openCustomerPortal();
    } catch (err) {
      console.error('Portal error', err);
      showToast('Unable to open subscription portal', 'error');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center justify-center px-4 py-2  bg-gray-200 hover:bg-gray-300 disabled:opacity-60 ${className}`}
    >
      {loading ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : (
        children || 'Manage subscription'
      )}
    </button>
  );
} 