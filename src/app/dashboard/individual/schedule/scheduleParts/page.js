"use client";

import React from 'react';
import { IntegratedFlowProvider } from './context/IntegratedFlowContext';
import IntegratedFlowWizard from './components/core/IntegratedFlowWizard';

const AnoopPage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--beige)' }}>
      <IntegratedFlowProvider>
        <IntegratedFlowWizard />
      </IntegratedFlowProvider>
    </div>
  );
};

export default AnoopPage;
