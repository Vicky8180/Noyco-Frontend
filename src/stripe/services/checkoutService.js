import { apiRequest } from '@/lib/api';
import { getStripe } from '../utils/stripeLoader';

export const createCheckout = async (planType, billingCycle = 'monthly') => {
  const stripe = await getStripe();
  const body = { plan_type: planType, billing_cycle: billingCycle };
  const { checkout_url } = await apiRequest('/stripe/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  // Prefer using redirect to URL to avoid CORS issues
  if (checkout_url) {
    window.location.href = checkout_url;
  } else {
    throw new Error('Failed to get checkout URL');
  }
}; 