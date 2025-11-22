"use client";

import { useUtmCapture } from '@/hooks/useUtmCapture';

/**
 * Componente para capturar UTMs automaticamente
 * Deve ser incluído no layout principal
 */
export default function UtmCapture() {
  useUtmCapture();
  return null; // Não renderiza nada
}
