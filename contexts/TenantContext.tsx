"use client";

import { createContext, useContext, ReactNode } from 'react';
import type { TenantConfig } from '@/config/tenants';

const TenantContext = createContext<TenantConfig | null>(null);

export function TenantProvider({ 
  children, 
  tenant 
}: { 
  children: ReactNode; 
  tenant: TenantConfig;
}) {
  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantConfig {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
