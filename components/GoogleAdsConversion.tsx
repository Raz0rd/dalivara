"use client";

import { useEffect } from 'react';
import { useTenant } from '@/contexts/TenantContext';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function GoogleAdsConversionScript() {
  const tenant = useTenant();

  useEffect(() => {
    if (!tenant.googleAdsConversionId || !tenant.googleAdsConversionLabel) {
      return;
    }

    // Definir função global de conversão
    (window as any).gtag_report_conversion = function(url?: string, value?: number, transactionId?: string) {
      const callback = function () {
        if (typeof(url) != 'undefined') {
          window.location.href = url;
        }
      };
      
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': `${tenant.googleAdsConversionId}/${tenant.googleAdsConversionLabel}`,
          'value': value || 1.0,
          'currency': 'BRL',
          'transaction_id': transactionId || '',
          'event_callback': callback
        });
      }
      
      return false;
    };
  }, [tenant.googleAdsConversionId, tenant.googleAdsConversionLabel]);

  return null;
}

// Hook para disparar conversão
export function useGoogleAdsConversion() {
  const tenant = useTenant();

  const reportConversion = (options?: {
    url?: string;
    value?: number;
    transactionId?: string;
  }) => {
    if (!tenant.googleAdsConversionId || !tenant.googleAdsConversionLabel) {
      console.warn('Google Ads conversion não configurado para este tenant');
      return;
    }

    if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion(
        options?.url,
        options?.value,
        options?.transactionId
      );
    } else {
      console.error('gtag_report_conversion não está disponível');
    }
  };

  return { reportConversion };
}
