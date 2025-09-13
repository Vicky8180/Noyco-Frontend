import { loadStripe } from '@stripe/stripe-js';

let stripePromise = null;

// Returns a cached Stripe.js instance, initialising it if necessary.
export const getStripe = async () => {
  if (stripePromise) return stripePromise;

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) throw new Error('Stripe publishable key not set');

  stripePromise = await loadStripe(publishableKey);
  return stripePromise;
}; 