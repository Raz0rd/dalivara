"use client";

import Image from "next/image";
import ReviewsButton from "./ReviewsButton";

interface HomeHeaderProps {
  onReviewsClick?: () => void;
}

export default function HomeHeader({ onReviewsClick }: HomeHeaderProps) {
  return (
    <header className="sticky top-0 z-50 shadow-md">
      <div className="max-w-md mx-auto relative">
        {/* Background com imagem do banner */}
        <div className="relative h-32 sm:h-40 overflow-hidden">
          <Image
            src="/banneracai.jpg"
            alt="Banner Açaí"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay escuro para melhorar legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
          
          {/* Conteúdo do header */}
          <div className="relative h-full flex items-center justify-between px-4 py-4 gap-2">
            {/* Logo na esquerda */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <Image
                  src="/nacional.png"
                  alt="Nacional Açaí Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl sm:text-2xl tracking-wide drop-shadow-lg">NACIONAL</span>
                <span className="text-white font-bold text-xl sm:text-2xl tracking-wide drop-shadow-lg">AÇAÍ</span>
              </div>
            </div>

            {/* Botão de Reviews */}
            {onReviewsClick && (
              <div className="flex-shrink-0">
                <ReviewsButton onClick={onReviewsClick} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
