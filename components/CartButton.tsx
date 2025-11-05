"use client";

interface CartButtonProps {
  price: number;
  onAddToCart: () => void;
  disabled?: boolean;
}

export default function CartButton({ price, onAddToCart, disabled = false }: CartButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <button
        onClick={onAddToCart}
        disabled={disabled}
        className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-primary hover:bg-primary/90 active:scale-95"
        }`}
      >
        <div className="flex items-center justify-between px-4">
          <span>Adicionar ao carrinho</span>
          <span className="text-lg font-bold">
            R$ {price.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </button>
    </div>
  );
}
