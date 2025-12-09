"use client";

interface Modelo2ProductFooterProps {
  onAddToCart: () => void;
  totalPrice: number;
}

export default function Modelo2ProductFooter({ onAddToCart, totalPrice }: Modelo2ProductFooterProps) {
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
          <i className="fa-solid fa-cart-plus"></i> ADICIONAR AO CARRINHO - R$ {totalPrice.toFixed(2)}
        </button>
      </div>
    </footer>
  );
}
