"use client";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner Vermelho */}
        <div className="w-16 h-16 border-4 border-[#f02f2f] border-t-transparent rounded-full animate-spin"></div>
        
        {/* Texto */}
        <p className="text-white font-semibold text-lg">Processando...</p>
      </div>
    </div>
  );
}
