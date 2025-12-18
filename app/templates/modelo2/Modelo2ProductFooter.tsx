"use client";

import { useState, useEffect } from "react";

interface Modelo2ProductFooterProps {
  onAddToCart: () => void;
  totalPrice: number;
}

export default function Modelo2ProductFooter({ onAddToCart, totalPrice }: Modelo2ProductFooterProps) {
  // Teste A/B randomizado do CTA
  const [ctaVariant, setCtaVariant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    // Randomizar entre opção A e B (50/50)
    setCtaVariant(Math.random() < 0.5 ? 'A' : 'B');
  }, []);

  const ctaText = ctaVariant === 'A' 
    ? '🍧 Quero meu açaí agora'
    : 'Continuar para entrega 🚀';

  return (
    <footer id="carrinho">
      <div className="container">
        <button 
          className="btn"
          onClick={onAddToCart}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {ctaText}
        </button>
        <div style={{
          textAlign: 'center',
          marginTop: '10px',
          padding: '8px',
          fontSize: '14px',
          color: '#666'
        }}>
          ⭐ <b>4,8 de 5</b> — mais de 1.000 clientes satisfeitos
        </div>
      </div>
    </footer>
  );
}
