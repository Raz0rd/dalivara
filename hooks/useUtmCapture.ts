"use client";

import { useEffect } from 'react';
import { getUtmParams, saveUtmsToStorage } from '@/utils/utmify';

/**
 * Hook para capturar UTMs na primeira visita e salvar no localStorage
 * Deve ser usado no layout principal para capturar em todas as páginas
 */
export function useUtmCapture() {
  useEffect(() => {
    // Só executar no cliente
    if (typeof window === 'undefined') return;

    // Verificar se já temos UTMs salvos
    const savedUtms = localStorage.getItem('saved_utms');
    
    // Capturar UTMs da URL atual
    const urlParams = new URLSearchParams(window.location.search);
    const hasUtmsInUrl = Array.from(urlParams.keys()).some(key => key.startsWith('utm_') || key === 'gclid' || key === 'fbclid');

    // Se tem UTMs na URL, salvar (sobrescrever os antigos)
    if (hasUtmsInUrl) {
      console.log('🎯 [UTM Capture] UTMs detectados na URL, salvando...');
      saveUtmsToStorage();
      const utmParams = getUtmParams();
      console.log('✅ [UTM Capture] UTMs salvos:', utmParams);
    } else if (!savedUtms) {
      // Se não tem UTMs na URL e não tem salvos, tentar capturar do Utmify
      console.log('📊 [UTM Capture] Nenhum UTM na URL, tentando capturar do Utmify...');
      const utmParams = getUtmParams();
      if (Object.keys(utmParams).length > 0) {
        saveUtmsToStorage();
        console.log('✅ [UTM Capture] UTMs capturados do Utmify:', utmParams);
      } else {
        console.log('⚠️ [UTM Capture] Nenhum UTM disponível');
      }
    } else {
      console.log('✅ [UTM Capture] UTMs já salvos anteriormente');
    }
  }, []);
}
