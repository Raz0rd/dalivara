"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import Modelo2Layout from "./Modelo2Layout";
import ReviewsSection from "@/components/ReviewsSection";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Modelo2BottomNav from "./Modelo2BottomNav";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  highlight?: string;
  stock?: number;
  isBestSeller?: boolean;
}

export default function Modelo2HomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const { toast, showToast, hideToast } = useToast();
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Nacional Açaí';
  const [countdown, setCountdown] = useState({ minutes: 15, seconds: 0 });

  // Reviews
  const reviews = [
    "/products/reviews/1.webp",
    "/products/reviews/2.webp",
    "/products/reviews/3.webp",
    "/products/reviews/4.webp",
    "/products/reviews/5.webp",
    "/products/reviews/6.webp",
    "/products/reviews/7.webp",
    "/products/reviews/8.webp",
    "/products/reviews/9.webp",
    "/products/reviews/10.webp",
    "/products/reviews/11.webp",
    "/products/reviews/12.webp",
  ];

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          return { minutes: 15, seconds: 0 }; // Reset
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Produtos EXATAMENTE como no HTML original
  const pague1Leve2: Product[] = [
    {
      id: "pague-1-leve-2-300ml",
      name: "2 Copos Açaí 300ml",
      description: "9 Complementos Grátis",
      price: 19.90,
      originalPrice: 39.80,
      image: "/images/modelo2/copo2.webp",
    },
    {
      id: "pague-1-leve-2-500ml",
      name: "2 Copos Açaí 500ml",
      description: "9 Complementos Grátis",
      price: 22.90,
      originalPrice: 43.80,
      image: "/images/modelo2/copo2.webp",
    },
    {
      id: "pague-1-leve-2-700ml",
      name: "2 Copos Açaí 700ml",
      description: "9 Complementos Grátis",
      price: 26.90,
      originalPrice: 53.80,
      image: "/images/modelo2/copo2.webp",
      badge: "MAIS VENDIDO 💜",
      highlight: "Mais que o dobro do Combo 1 por apenas R$7 a mais!",
      stock: 8,
      isBestSeller: true,
    },
    {
      id: "pague-1-leve-2-1l",
      name: "2 Copos Açaí 1L",
      description: "9 Complementos Grátis",
      price: 37.90,
      originalPrice: 75.80,
      image: "/images/modelo2/copo2.webp",
    },
  ];

  const pague1Leve2Zero: Product[] = [
    {
      id: "pague-1-leve-2-300ml-zero",
      name: "2 Copos Açaí 300ml ZERO",
      description: "9 Complementos Grátis",
      price: 22.90,
      originalPrice: 45.80,
      image: "/images/modelo2/zero2.webp",
    },
    {
      id: "pague-1-leve-2-500ml-zero",
      name: "2 Copos Açaí 500ml ZERO",
      description: "9 Complementos Grátis",
      price: 25.90,
      originalPrice: 49.80,
      image: "/images/modelo2/zero2.webp",
    },
    {
      id: "pague-1-leve-2-700ml-zero",
      name: "2 Copos Açaí 700ml ZERO",
      description: "9 Complementos Grátis",
      price: 29.90,
      originalPrice: 59.80,
      image: "/images/modelo2/zero2.webp",
      badge: "MAIS VENDIDO 💜",
      highlight: "Mais que o dobro do Combo 1 por apenas R$7 a mais!",
      stock: 16,
      isBestSeller: true,
    },
    {
      id: "pague-1-leve-2-1l-zero",
      name: "2 Copos Açaí 1L ZERO",
      description: "9 Complementos Grátis",
      price: 40.90,
      originalPrice: 81.80,
      image: "/images/modelo2/zero2.webp",
    },
  ];

  const acai: Product[] = [
    {
      id: "acai-300ml",
      name: "1 Copo Açaí 300ml",
      description: "9 Complementos Grátis",
      price: 19.90,
      image: "/images/modelo2/copo1.webp",
    },
    {
      id: "acai-500ml",
      name: "1 Copo Açaí 500ml",
      description: "9 Complementos Grátis",
      price: 22.90,
      image: "/images/modelo2/copo1.webp",
    },
    {
      id: "acai-700ml",
      name: "1 Copo Açaí 700ml",
      description: "9 Complementos Grátis",
      price: 26.90,
      image: "/images/modelo2/copo1.webp",
    },
    {
      id: "acai-1l",
      name: "1 Copo Açaí 1L",
      description: "9 Complementos Grátis",
      price: 37.90,
      image: "/images/modelo2/copo1.webp",
    },
  ];

  const acaiZero: Product[] = [
    {
      id: "acai-300ml-zero",
      name: "1 Copo Açaí 300ml ZERO",
      description: "9 Complementos Grátis",
      price: 22.90,
      image: "/images/modelo2/zero1.webp",
    },
    {
      id: "acai-500ml-zero",
      name: "1 Copo Açaí 500ml ZERO",
      description: "9 Complementos Grátis",
      price: 25.90,
      image: "/images/modelo2/zero1.webp",
    },
    {
      id: "acai-700ml-zero",
      name: "1 Copo Açaí 700ml ZERO",
      description: "9 Complementos Grátis",
      price: 29.90,
      image: "/images/modelo2/zero1.webp",
    },
    {
      id: "acai-1l-zero",
      name: "1 Copo Açaí 1L ZERO",
      description: "9 Complementos Grátis",
      price: 40.90,
      image: "/images/modelo2/zero1.webp",
    },
  ];

  const handleProductClick = (product: Product) => {
    // Redirecionar para página de detalhes do produto
    router.push(`/produto-modelo2/${product.id}`);
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

      {/* Header */}
      <header id="topo">
        {/* Banner com Background */}
        <div className="cover main" style={{
          backgroundImage: 'url(/images/modelo2/background.webp)'
        }}>
          <div className="logo">
            <figure>
              <Image 
                src="/images/modelo2/ponto.webp"
                alt={storeName}
                width={120}
                height={120}
                priority
              />
            </figure>
          </div>
          <div className="borda"></div>
        </div>

        {/* Info da Loja */}
        <div className="container">
          <div className="info">
            <h1>{storeName}</h1>
            <div className="icones">
              <a href="https://www.instagram.com/acainoponto_ofcc/" title="Instagram" target="_blank">
                <i className="fab fa-instagram"></i>
              </a>
              <a className="informacoes" href="#info" title="Info">
                <i className="fa-solid fa-info"></i>
              </a>
            </div>
            <div className="detalhe">
              <span>
                <i className="fa-solid fa-coins"></i> Pedido Mínimo <b>R$ 10,00</b>
              </span>
              <div>
                <span><i className="fa-solid fa-motorcycle"></i> <b>10-20</b> min</span> • <span style={{color: '#077c22'}}>Grátis</span>
              </div>
            </div>
            <div className="detalhe" style={{gap: '3px'}}>
              <i className="fa fa-map-marker-alt" aria-hidden="true"></i>
              <span id="localCidade">Cidade</span> - <span id="localEstado">UF</span> • 1,6km de você
            </div>
            <div className="detalhe">
              <i className="fa fa-star" aria-hidden="true"></i>
              <b>4,8</b> (136 avaliações)
            </div>
            <div className="aberto">
              <i className="fa-solid fa-circle btn-pisca"></i>
              <span id="status-loja">ABERTO</span>
            </div>
          </div>
        </div>

        {/* Menu Categorias */}
        <div id="menuCategorias">
          <div className="container">
            <div className="categorias">
              <a href="#pague-1-leve-2">Pague 1, Leve 2</a>
              <a href="#pague-1-leve-2-zero">Pague 1, Leve 2 - Zero Açúcar</a>
              <a href="#acai">Açaí</a>
              <a href="#acai-zero">Açaí Zero</a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="lista" style={{paddingBottom: 0}}>
        <div className="container">
          {/* Alertas */}
          <div className="alert alert-success">
            <b>Entrega Grátis</b> para <b id="localCidade">sua região</b>!
          </div>
          <div className="alert alert-success" style={{color: 'purple', outline: '2px solid purple'}}>
            Aproveite nossa <b>promoção com preços irresistíveis</b> igual Açaí 💜
          </div>

          {/* Pague 1, Leve 2 */}
          <div id="pague-1-leve-2" className="categoria">
            <h2>Pague 1, Leve 2</h2>
            <div className="produtos">
              {pague1Leve2.map((product) => (
                <div key={product.id} className="item">
                  <a 
                    className={`disponivel ${product.isBestSeller ? 'pulsar' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(product);
                    }}
                    style={product.isBestSeller ? {border: '2px solid #077c22', cursor: 'pointer'} : {cursor: 'pointer'}}
                  >
                    <div className="texto">
                      {product.badge && (
                        <span style={{
                          color: '#5b0e5c',
                          background: '#f1cdf2',
                          padding: '2px 2px',
                          marginBottom: '2px',
                          borderRadius: '8px',
                          textAlign: 'center',
                          display: 'block'
                        }}>
                          <b>{product.badge}</b>
                        </span>
                      )}
                      <h3>{product.name}</h3>
                      <span>{product.description}</span>
                      {product.highlight && (
                        <span style={{
                          color: '#474747',
                          background: '#e8e8e8',
                          padding: '10px 10px',
                          marginBottom: '2px',
                          marginTop: '2px',
                          borderRadius: '8px',
                          textAlign: 'left',
                          display: 'block'
                        }}>
                          {product.highlight}
                        </span>
                      )}
                      {product.originalPrice && (
                        <>
                          de <span className="precoPromocao">R$ {product.originalPrice.toFixed(2)}</span> por
                        </>
                      )}
                      <span className="preco" style={product.isBestSeller ? {fontSize: '20px'} : {}}>
                        {product.isBestSeller ? (
                          <b style={{background: '#077c22', color: 'white', borderRadius: '8px', padding: '0px 4px'}}>
                            R$ {product.price.toFixed(2)}
                          </b>
                        ) : (
                          ` R$ ${product.price.toFixed(2)} `
                        )}
                      </span>
                      {product.isBestSeller && (
                        <span><i>A maioria dos clientes escolhe esse porque é o melhor custo-benefício!</i></span>
                      )}
                      {product.stock && (
                        <span className="estoque" style={{marginTop: '4px'}}>
                          🔥 Apenas <b style={{background: 'red', color: 'white', borderRadius: '8px', padding: '0px 4px'}}>
                            {product.stock} combo(s)
                          </b> com esse preço especial
                        </span>
                      )}
                    </div>
                    <div className="fotoProduto">
                      <figure>
                        <Image 
                          src={product.image}
                          width={110}
                          height={110}
                          loading="lazy"
                          alt={product.name}
                        />
                      </figure>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="alert alert-success" style={{color: 'red', outline: '2px solid red', backgroundColor: 'rgb(255, 217, 217)'}}>
            <b>A promoção vai acabar em:</b>
            <div className="countdown">
              <div className="box">
                <span id="minutes">{String(countdown.minutes).padStart(2, '0')}</span>
                <p>Minutos</p>
              </div>
              <div className="box">
                <span id="seconds">{String(countdown.seconds).padStart(2, '0')}</span>
                <p>Segundos</p>
              </div>
            </div>
          </div>

          {/* Pague 1, Leve 2 - Zero Açúcar */}
          <div id="pague-1-leve-2-zero" className="categoria">
            <h2>Pague 1, Leve 2 - Zero Açúcar</h2>
            <div className="produtos">
              {pague1Leve2Zero.map((product) => (
                <div key={product.id} className="item">
                  <a 
                    className={`disponivel ${product.isBestSeller ? 'pulsar' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(product);
                    }}
                    style={product.isBestSeller ? {border: '2px solid #077c22', cursor: 'pointer'} : {cursor: 'pointer'}}
                  >
                    <div className="texto">
                      {product.badge && (
                        <span style={{
                          color: '#5b0e5c',
                          background: '#f1cdf2',
                          padding: '2px 2px',
                          marginBottom: '2px',
                          borderRadius: '8px',
                          textAlign: 'center',
                          display: 'block'
                        }}>
                          <b>{product.badge}</b>
                        </span>
                      )}
                      <h3>{product.name}</h3>
                      <span>{product.description}</span>
                      {product.highlight && (
                        <span style={{
                          color: '#474747',
                          background: '#e8e8e8',
                          padding: '10px 10px',
                          marginBottom: '2px',
                          marginTop: '2px',
                          borderRadius: '8px',
                          textAlign: 'left',
                          display: 'block'
                        }}>
                          {product.highlight}
                        </span>
                      )}
                      {product.originalPrice && (
                        <>
                          de <span className="precoPromocao">R$ {product.originalPrice.toFixed(2)}</span> por
                        </>
                      )}
                      <span className="preco" style={product.isBestSeller ? {fontSize: '20px'} : {}}>
                        {product.isBestSeller ? (
                          <b style={{background: '#077c22', color: 'white', borderRadius: '8px', padding: '0px 4px'}}>
                            R$ {product.price.toFixed(2)}
                          </b>
                        ) : (
                          ` R$ ${product.price.toFixed(2)} `
                        )}
                      </span>
                      {product.isBestSeller && (
                        <span><i>A maioria dos clientes escolhe esse porque é o melhor custo-benefício!</i></span>
                      )}
                      {product.stock && (
                        <span className="estoque" style={{marginTop: '4px'}}>
                          🔥 Apenas <b style={{background: 'red', color: 'white', borderRadius: '8px', padding: '0px 4px'}}>
                            {product.stock} combo(s)
                          </b> com esse preço especial
                        </span>
                      )}
                    </div>
                    <div className="fotoProduto">
                      <figure>
                        <Image 
                          src={product.image}
                          width={110}
                          height={110}
                          loading="lazy"
                          alt={product.name}
                        />
                      </figure>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="alert alert-success" style={{color: 'red', outline: '2px solid red', backgroundColor: 'rgb(255, 217, 217)'}}>
            <b>A promoção vai acabar em:</b>
            <div className="countdown">
              <div className="box">
                <span id="minutes">{String(countdown.minutes).padStart(2, '0')}</span>
                <p>Minutos</p>
              </div>
              <div className="box">
                <span id="seconds">{String(countdown.seconds).padStart(2, '0')}</span>
                <p>Segundos</p>
              </div>
            </div>
          </div>

          {/* Açaí */}
          <div id="acai" className="categoria">
            <h2>Açaí</h2>
            <div className="produtos">
              {acai.map((product) => (
                <div key={product.id} className="item">
                  <a 
                    className="disponivel"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(product);
                    }}
                    style={{cursor: 'pointer'}}
                  >
                    <div className="texto">
                      <h3>{product.name}</h3>
                      <span>{product.description}</span>
                      por
                      <span className="preco"> R$ {product.price.toFixed(2)} </span>
                    </div>
                    <div className="fotoProduto">
                      <figure>
                        <Image 
                          src={product.image}
                          width={110}
                          height={110}
                          loading="lazy"
                          alt={product.name}
                        />
                      </figure>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Açaí Zero */}
          <div id="acai-zero" className="categoria">
            <h2>Açaí Zero Açúcar</h2>
            <div className="produtos">
              {acaiZero.map((product) => (
                <div key={product.id} className="item">
                  <a 
                    className="disponivel"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(product);
                    }}
                    style={{cursor: 'pointer'}}
                  >
                    <div className="texto">
                      <h3>{product.name}</h3>
                      <span>{product.description}</span>
                      por
                      <span className="preco"> R$ {product.price.toFixed(2)} </span>
                    </div>
                    <div className="fotoProduto">
                      <figure>
                        <Image 
                          src={product.image}
                          width={110}
                          height={110}
                          loading="lazy"
                          alt={product.name}
                        />
                      </figure>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div style={{ marginTop: '2rem' }}>
            <ReviewsSection />
            <ReviewsCarousel reviews={reviews} />
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <Modelo2BottomNav />
    </Modelo2Layout>
  );
}
