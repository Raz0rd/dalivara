"use client";

import ReviewsButton from "./ReviewsButton";

interface HomeHeaderProps {
  onReviewsClick?: () => void;
}

export default function HomeHeader({ onReviewsClick }: HomeHeaderProps) {
  return (
    <header className="sticky top-0 bg-primary z-50 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center px-4 py-4 lg:px-8 relative">
          {/* Logo e Nome Centralizados */}
          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-xl tracking-wide">NACIONAL</span>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-3xl">👑</span>
            </div>
            <span className="text-white font-bold text-xl tracking-wide">AÇAÍ</span>
          </div>

          {/* Botão de Reviews (Desktop) - Posição Absoluta */}
          {onReviewsClick && (
            <div className="absolute right-4 lg:right-8">
              <ReviewsButton onClick={onReviewsClick} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
