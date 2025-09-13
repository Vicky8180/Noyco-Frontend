// New service to open Stripe customer portal
import { apiRequest } from '@/lib/api';

export const openCustomerPortal = async () => {
  const { portal_url } = await apiRequest('/stripe/portal-link', {
    method: 'POST',
  });

  if (portal_url) {
    // Full redirect to Stripe-managed portal
    window.location.href = portal_url;
  } else {
    throw new Error('Failed to obtain portal link');
  }
}; 