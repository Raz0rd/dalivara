"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import Modelo2Layout from "@/app/templates/modelo2/Modelo2Layout";
import Modelo2ProductFooter from "@/app/templates/modelo2/Modelo2ProductFooter";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

interface Topping {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock?: number;
}

// Acompanhamentos disponíveis
const coberturas: Topping[] = [
  { id: "cobertura-amora", name: "Cobertura Amora", price: 0 },
  { id: "cobertura-caramelo", name: "Cobertura Caramelo", price: 0 },
  { id: "cobertura-chocolate", name: "Cobertura Chocolate", price: 0 },
  { id: "cobertura-leite-condensado", name: "Cobertura Leite condensado", price: 0 },
  { id: "cobertura-maracuja", name: "Cobertura Maracujá", price: 0 },
  { id: "cobertura-mel", name: "Cobertura Mel", price: 0 },
  { id: "cobertura-menta", name: "Cobertura Menta", price: 0 },
  { id: "cobertura-morango", name: "Cobertura Morango", price: 0 },
];

const frutas: Topping[] = [
  { id: "abacaxi", name: "Abacaxi", price: 0 },
  { id: "banana", name: "Banana", price: 0 },
  { id: "kiwi", name: "Kiwi", price: 0 },
  { id: "morango", name: "Morango", price: 0 },
  { id: "uva", name: "Uva", price: 0 },
];

const complementos: Topping[] = [
  { id: "amendoim", name: "Amendoim", price: 0 },
  { id: "castanha", name: "Castanha", price: 0 },
  { id: "confete", name: "Confete", price: 0 },
  { id: "granola", name: "Granola", price: 0 },
  { id: "leite-em-po", name: "Leite em pó", price: 0 },
  { id: "paçoca", name: "Paçoca", price: 0 },
];

// Dados dos produtos (mesmos do Modelo2HomePage)
const allProducts: Record<string, Product> = {
  "pague-1-leve-2-300ml": {
    id: "pague-1-leve-2-300ml",
    name: "2 Copos Açaí 300ml",
    description: "9 Complementos Grátis",
    price: 19.90,
    originalPrice: 39.80,
    image: "/images/modelo2/copo2.webp",
  },
  "pague-1-leve-2-500ml": {
    id: "pague-1-leve-2-500ml",
    name: "2 Copos Açaí 500ml",
    description: "9 Complementos Grátis",
    price: 22.90,
    originalPrice: 43.80,
    image: "/images/modelo2/copo2.webp",
  },
  "pague-1-leve-2-700ml": {
    id: "pague-1-leve-2-700ml",
    name: "2 Copos Açaí 700ml",
    description: "9 Complementos Grátis",
    price: 26.90,
    originalPrice: 53.80,
    image: "/images/modelo2/copo2.webp",
    stock: 8,
  },
  "pague-1-leve-2-1l": {
    id: "pague-1-leve-2-1l",
    name: "2 Copos Açaí 1L",
    description: "9 Complementos Grátis",
    price: 37.90,
    originalPrice: 75.80,
    image: "/images/modelo2/copo2.webp",
  },
  "pague-1-leve-2-300ml-zero": {
    id: "pague-1-leve-2-300ml-zero",
    name: "2 Copos Açaí 300ml ZERO",
    description: "9 Complementos Grátis",
    price: 22.90,
    originalPrice: 45.80,
    image: "/images/modelo2/zero2.webp",
  },
  "pague-1-leve-2-500ml-zero": {
    id: "pague-1-leve-2-500ml-zero",
    name: "2 Copos Açaí 500ml ZERO",
    description: "9 Complementos Grátis",
    price: 25.90,
    originalPrice: 49.80,
    image: "/images/modelo2/zero2.webp",
  },
  "pague-1-leve-2-700ml-zero": {
    id: "pague-1-leve-2-700ml-zero",
    name: "2 Copos Açaí 700ml ZERO",
    description: "9 Complementos Grátis",
    price: 29.90,
    originalPrice: 59.80,
    image: "/images/modelo2/zero2.webp",
    stock: 16,
  },
  "pague-1-leve-2-1l-zero": {
    id: "pague-1-leve-2-1l-zero",
    name: "2 Copos Açaí 1L ZERO",
    description: "9 Complementos Grátis",
    price: 40.90,
    originalPrice: 81.80,
    image: "/images/modelo2/zero2.webp",
  },
  "acai-300ml": {
    id: "acai-300ml",
    name: "1 Copo Açaí 300ml",
    description: "9 Complementos Grátis",
    price: 19.90,
    image: "/images/modelo2/copo1.webp",
  },
  "acai-500ml": {
    id: "acai-500ml",
    name: "1 Copo Açaí 500ml",
    description: "9 Complementos Grátis",
    price: 22.90,
    image: "/images/modelo2/copo1.webp",
  },
  "acai-700ml": {
    id: "acai-700ml",
    name: "1 Copo Açaí 700ml",
    description: "9 Complementos Grátis",
    price: 26.90,
    image: "/images/modelo2/copo1.webp",
  },
  "acai-1l": {
    id: "acai-1l",
    name: "1 Copo Açaí 1L",
    description: "9 Complementos Grátis",
    price: 37.90,
    image: "/images/modelo2/copo1.webp",
  },
  "acai-300ml-zero": {
    id: "acai-300ml-zero",
    name: "1 Copo Açaí 300ml ZERO",
    description: "9 Complementos Grátis",
    price: 22.90,
    image: "/images/modelo2/zero1.webp",
  },
  "acai-500ml-zero": {
    id: "acai-500ml-zero",
    name: "1 Copo Açaí 500ml ZERO",
    description: "9 Complementos Grátis",
    price: 25.90,
    image: "/images/modelo2/zero1.webp",
  },
  "acai-700ml-zero": {
    id: "acai-700ml-zero",
    name: "1 Copo Açaí 700ml ZERO",
    description: "9 Complementos Grátis",
    price: 29.90,
    image: "/images/modelo2/zero1.webp",
  },
  "acai-1l-zero": {
    id: "acai-1l-zero",
    name: "1 Copo Açaí 1L ZERO",
    description: "9 Complementos Grátis",
    price: 40.90,
    image: "/images/modelo2/zero1.webp",
  },
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { addItem } = useCart();
  const { toast, showToast, hideToast } = useToast();
  const slug = params.slug as string;

  const product = allProducts[slug];

  const [quantity, setQuantity] = useState(1);
  const [selectedCoberturas, setSelectedCoberturas] = useState<Record<string, number>>({});
  const [selectedFrutas, setSelectedFrutas] = useState<Record<string, number>>({});
  const [selectedComplementos, setSelectedComplementos] = useState<Record<string, number>>({});

  if (!product) {
    return (
      <Modelo2Layout>
        <div className="container containerFinalizar">
          <Link href="/" className="voltar">
            <i className="fa-solid fa-chevron-left"></i> VOLTAR
          </Link>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Produto não encontrado</h2>
          </div>
        </div>
      </Modelo2Layout>
    );
  }

  const handleToppingChange = (
    category: 'coberturas' | 'frutas' | 'complementos',
    toppingId: string,
    delta: number
  ) => {
    const setter = category === 'coberturas' ? setSelectedCoberturas :
                   category === 'frutas' ? setSelectedFrutas :
                   setSelectedComplementos;

    setter(prev => {
      const current = prev[toppingId] || 0;
      const newValue = Math.max(0, Math.min(2, current + delta)); // Máximo 2 de cada
      
      if (newValue === 0) {
        const { [toppingId]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [toppingId]: newValue };
    });
  };

  const getTotalToppings = (category: 'coberturas' | 'frutas' | 'complementos') => {
    const selected = category === 'coberturas' ? selectedCoberturas :
                     category === 'frutas' ? selectedFrutas :
                     selectedComplementos;
    return Object.values(selected).reduce((sum, qty) => sum + qty, 0);
  };

  const handleAddToCart = () => {
    // Montar lista de acompanhamentos
    const toppings: string[] = [];
    
    Object.entries(selectedCoberturas).forEach(([id, qty]) => {
      const topping = coberturas.find(t => t.id === id);
      if (topping && qty > 0) {
        toppings.push(`${topping.name} (${qty}x)`);
      }
    });
    
    Object.entries(selectedFrutas).forEach(([id, qty]) => {
      const topping = frutas.find(t => t.id === id);
      if (topping && qty > 0) {
        toppings.push(`${topping.name} (${qty}x)`);
      }
    });
    
    Object.entries(selectedComplementos).forEach(([id, qty]) => {
      const topping = complementos.find(t => t.id === id);
      if (topping && qty > 0) {
        toppings.push(`${topping.name} (${qty}x)`);
      }
    });

    // Adicionar ao carrinho
    addItem({
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      observations: toppings.length > 0 ? `Acompanhamentos: ${toppings.join(', ')}` : undefined,
    });

    // Mostrar notificação
    showToast(`${product.name} adicionado ao carrinho!`, "success");

    // Ir para o carrinho após 1 segundo
    setTimeout(() => {
      router.push('/carrinho');
    }, 1000);
  };

  return (
    <Modelo2Layout>
      {/* Toast de Notificações */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="container containerFinalizar">
        <Link href="/" className="voltar">
          <i className="fa-solid fa-chevron-left"></i> VOLTAR
        </Link>
        
        <div id="detalhesProduto">
          <div className="info1">
            <div className="fotoProduto">
              <figure>
                <Image 
                  src={product.image}
                  width={300}
                  height={300}
                  alt={product.name}
                />
              </figure>
            </div>
            <div className="descricao">
              <h3>{product.name}</h3>
              <span className="detalhe">{product.description}</span>
              {product.originalPrice && (
                <>
                  de <span className="precoPromocao">R$ {product.originalPrice.toFixed(2)}</span> por
                </>
              )}
              <span className="preco">
                R$ {product.price.toFixed(2)}
              </span>
              {product.stock && (
                <span className="estoque">
                  <i className="fa-solid fa-circle-down"></i> apenas{' '}
                  <b style={{background: 'red', color: 'white', borderRadius: '8px', padding: '0px 4px'}}>
                    {product.stock} combos
                  </b>{' '}
                  disponíveis
                </span>
              )}
            </div>
          </div>

          <div className="info2">
            {/* Coberturas */}
            <div id="complementos-gratis" className="tipo">
              <div className="topo">
                <div>
                  <h3>Coberturas:</h3>
                  <span className="detalhe">Escolha até 2 opções</span>
                </div>
                <div className="col2">
                  <span className="escolhidos">
                    <span>{getTotalToppings('coberturas')}</span>/2
                  </span>
                  <i className="fa-solid fa-circle-check" style={{display: 'inline'}}></i>
                </div>
              </div>
              {coberturas.map(topping => (
                <div key={topping.id} className="opcoes">
                  <div className="desc" style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                    <span className="nome">
                      <b>{topping.name}</b>
                      <span className="preco">
                        {topping.price > 0 && `+ R$ ${topping.price.toFixed(2)}`}
                      </span>
                    </span>
                    <div className="qtdeProdutoOpcao">
                      <button 
                        className="removerQtdeOpcao"
                        onClick={() => handleToppingChange('coberturas', topping.id, -1)}
                        disabled={!selectedCoberturas[topping.id]}
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <input 
                        className="qtdeOpcao"
                        type="text"
                        value={selectedCoberturas[topping.id] || 0}
                        readOnly
                      />
                      <button 
                        className="adicionarQtdeOpcao"
                        onClick={() => handleToppingChange('coberturas', topping.id, 1)}
                        disabled={getTotalToppings('coberturas') >= 2}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Frutas */}
            <div id="complementos-gratis" className="tipo">
              <div className="topo">
                <div>
                  <h3>Frutas:</h3>
                  <span className="detalhe">Escolha até 2 opções</span>
                </div>
                <div className="col2">
                  <span className="escolhidos">
                    <span>{getTotalToppings('frutas')}</span>/2
                  </span>
                  <i className="fa-solid fa-circle-check" style={{display: 'inline'}}></i>
                </div>
              </div>
              {frutas.map(topping => (
                <div key={topping.id} className="opcoes">
                  <div className="desc" style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                    <span className="nome">
                      <b>{topping.name}</b>
                      <span className="preco">
                        {topping.price > 0 && `+ R$ ${topping.price.toFixed(2)}`}
                      </span>
                    </span>
                    <div className="qtdeProdutoOpcao">
                      <button 
                        className="removerQtdeOpcao"
                        onClick={() => handleToppingChange('frutas', topping.id, -1)}
                        disabled={!selectedFrutas[topping.id]}
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <input 
                        className="qtdeOpcao"
                        type="text"
                        value={selectedFrutas[topping.id] || 0}
                        readOnly
                      />
                      <button 
                        className="adicionarQtdeOpcao"
                        onClick={() => handleToppingChange('frutas', topping.id, 1)}
                        disabled={getTotalToppings('frutas') >= 2}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Complementos */}
            <div id="complementos-gratis" className="tipo">
              <div className="topo">
                <div>
                  <h3>Complementos:</h3>
                  <span className="detalhe">Escolha até 2 opções</span>
                </div>
                <div className="col2">
                  <span className="escolhidos">
                    <span>{getTotalToppings('complementos')}</span>/2
                  </span>
                  <i className="fa-solid fa-circle-check" style={{display: 'inline'}}></i>
                </div>
              </div>
              {complementos.map(topping => (
                <div key={topping.id} className="opcoes">
                  <div className="desc" style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                    <span className="nome">
                      <b>{topping.name}</b>
                      <span className="preco">
                        {topping.price > 0 && `+ R$ ${topping.price.toFixed(2)}`}
                      </span>
                    </span>
                    <div className="qtdeProdutoOpcao">
                      <button 
                        className="removerQtdeOpcao"
                        onClick={() => handleToppingChange('complementos', topping.id, -1)}
                        disabled={!selectedComplementos[topping.id]}
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <input 
                        className="qtdeOpcao"
                        type="text"
                        value={selectedComplementos[topping.id] || 0}
                        readOnly
                      />
                      <button 
                        className="adicionarQtdeOpcao"
                        onClick={() => handleToppingChange('complementos', topping.id, 1)}
                        disabled={getTotalToppings('complementos') >= 2}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantidade */}
            <div className="tipo">
              <div className="topo">
                <h3>Quantidade:</h3>
              </div>
              <div className="qtdeProduto">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <i className="fa-solid fa-minus"></i>
                </button>
                <input type="text" value={quantity} readOnly />
                <button onClick={() => setQuantity(quantity + 1)}>
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer com botão adicionar */}
      <Modelo2ProductFooter 
        onAddToCart={handleAddToCart}
        totalPrice={product.price * quantity}
      />
    </Modelo2Layout>
  );
}
