"use client";

import { MarketingFunnelProvider } from './context/MarketingFunnelContext';
import MarketingFunnelFlow from './components/MarketingFunnelFlow';
import './styles.css';

export default function MarketingFunnelPage() {
  return (
    <div className="min-h-screen bg-white font-mier">
      <MarketingFunnelProvider>
        <MarketingFunnelFlow />
      </MarketingFunnelProvider>
    </div>
  );
}
