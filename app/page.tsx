"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HomeHeader from "@/components/HomeHeader";
import StoreInfo from "@/components/StoreInfo";
import ProductListCard from "@/components/ProductListCard";
import BottomNav from "@/components/BottomNav";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ReviewsSection from "@/components/ReviewsSection";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import LocationConfirmationModal from "@/components/LocationConfirmationModal";
import DeliveryBanner from "@/components/DeliveryBanner";
import AddToCartModal from "@/components/AddToCartModal";
import DesktopCart from "@/components/DesktopCart";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/useToast";
import { useLocation } from "@/hooks/useLocation";
import Toast from "@/components/Toast";
import { gtag_report_conversion } from "@/config/googleAds";

function ConversionTestButton({ onTest }: { onTest: () => void }) {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const convv = searchParams.get('convv');
    if (convv) {
      setShow(true);
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    <button
      onClick={onTest}
      className="fixed bottom-24 right-4 z-50 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
    >
      <span className="text-xl">🎯</span>
      <span>Testar Conversão</span>
    </button>
  );
}

function HomeContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("combos");
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const combosRef = useRef<HTMLDivElement>(null);
  const deliciasRef = useRef<HTMLDivElement>(null);
  const milkshakeRef = useRef<HTMLDivElement>(null);
  const bebidasRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { toast, showToast, hideToast } = useToast();
  const { location, loading, showConfirmation, tempLocation, confirmLocation } = useLocation();

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTestConversion = () => {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    const transactionId = `TEST-${randomNumber}`;
    
    // Disparar conversão do Google Ads usando função oficial
    const success = gtag_report_conversion(1.0, transactionId);
    
    if (success !== false) {
      alert(`✅ Conversão de teste enviada!\n\nValor: R$ 1,00\nTransaction ID: ${transactionId}\n\nVerifique no Google Ads em alguns minutos.`);
    } else {
      alert('❌ Google Ads não carregado ainda. Aguarde alguns segundos e tente novamente.');
    }
  };

  const handleAddToCart = (product: any) => {
    setCurrentProduct(product);
    setModalQuantity(1);
    addItem({
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setShowAddToCartModal(true);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setModalQuantity(newQuantity);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    let ref;
    switch (tab) {
      case "combos":
        ref = combosRef;
        break;
      case "delicias":
        ref = deliciasRef;
        break;
      case "milkshake":
        ref = milkshakeRef;
        break;
      case "bebidas":
        ref = bebidasRef;
        break;
    }
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const destaqueProducts = [
    {
      id: "destaque-1",
      name: "2 Copos Açaí 500ml ZERO",
      description: "9 Complementos Grátis",
      price: 25.90,
      originalPrice: 49.80,
      discount: 48,
      image: "/products/zero1.webp",
      badge: null,
    },
    {
      id: "destaque-2",
      name: "2 Copos Açaí 700ml ZERO",
      description: "9 Complementos Grátis • Mais que o dobro do Combo 1 por apenas R$7 a mais!",
      price: 29.90,
      originalPrice: 59.80,
      discount: 50,
      image: "/products/zero2.webp",
      badge: "MAIS VENDIDO 💜",
      highlight: "A maioria dos clientes escolhe esse porque é o melhor custo-benefício!",
      stock: 1,
    },
    {
      id: "destaque-3",
      name: "2 Copos Açaí 1L",
      description: "9 Complementos Grátis",
      price: 37.90,
      originalPrice: 75.80,
      discount: 50,
      image: "/products/copo2.webp",
      badge: null,
    },
  ];

  const combosProducts = [
    {
      id: "1",
      name: "Combo 1 Kg",
      description: "Escolha até 4 opções entre açaí e cremes, até 6 adicionais e até 2 coberturas. Obs.: Todos os cremes, adicionais e coberturas...",
      price: 38.99,
      originalPrice: 45.99,
      discount: 15,
      image: "/products/caixa1L.jpg",
    },
    {
      id: "2",
      name: "Combo 300g",
      description: "Escolha até 2 opções entre açaí e cremes, até 2 adicionais e até 1 cobertura. Obs.: Todos os cremes, adicionais e coberturas...",
      price: 15.99,
      image: "/products/combo-300g.jpg",
    },
    {
      id: "3",
      name: "Combo 500g",
      description: "Escolha até 3 opções entre açaí e cremes, até 3 adicionais e até 2 coberturas. Obs.: Todos os cremes, adicionais e coberturas...",
      price: 23.99,
      image: "/products/combo-500g.jpg",
    },
    {
      id: "4",
      name: "Combo 750g",
      description: "Escolha até 4 opções entre açaí e cremes, até 4 adicionais e até 2 coberturas. Obs.: Todos os cremes, adicionais e coberturas...",
      price: 34.99,
      image: "/products/combo-750g.jpg",
    },
  ];

  const deliciasProducts = [
    { id: "5", name: "Açaí Mix Premium", description: "Caixa mix de 1L, aprox. 1kg.", price: 21.99, image: "/products/caixa1L.jpg" },
    { id: "6", name: "Açaí Fit", description: "Caixa mix de 1L, aprox. 1kg. Obs.: Adoçado com Maltitol", price: 21.99, image: "/products/caixa1L.jpg" },
    { id: "7", name: "Creme de Ninho Mix", description: "Caixa mix de 1L, aprox. 1kg.", price: 21.99, image: "/products/caixa1L.jpg" },
    { id: "8", name: "Creme de Cupuaçu Mix", description: "Caixa mix de 1L, aprox. 1kg.", price: 21.99, image: "/products/caixa1L.jpg" },
    { id: "9", name: "Creme de Morango Mix", description: "Caixa mix de 1L, aprox. 1kg.", price: 21.99, image: "/products/caixa1L.jpg" },
    { id: "10", name: "Creme de Tapioca Mix", description: "Caixa mix de 1L, aprox. 1kg.", price: 21.99, image: "/products/caixa1L.jpg" },
    { id: "11", name: "Creme de Castanha Mix", description: "Caixa mix de 1L, aprox. 1kg.", price: 21.99, image: "/products/caixa1L.jpg" },
    { id: "12", name: "Creme de Maracujá Mix", description: "Caixa mix de 1L, aprox. 1kg.", price: 21.99, image: "/products/caixa1L.jpg" },
    { id: "13", name: "Creme de Ovomaltine Mix", description: "Caixa mix de 1L, aprox. 1kg.", price: 21.99, image: "/products/caixa1L.jpg" },
    { id: "14", name: "Creme de Abacaxi Mix", description: "Caixa mix de 1L, aprox. 1kg.", price: 21.99, image: "/products/caixa1L.jpg" },
    { id: "15", name: "Creme de Oreo Mix", description: "Caixa mix de 1L, aprox. 1kg.", price: 21.99, image: "/products/caixa1L.jpg" },
    { id: "16", name: "Creme de Paçoquita Mix", description: "Caixa mix de 1L, aprox. 1kg.", price: 21.99, image: "/products/caixa1L.jpg" },
    { id: "17", name: "Creme de Pistache", description: "Caixa mix de 1L, aprox. 1kg.", price: 21.99, image: "/products/caixa1L.jpg" },
    { id: "18", name: "Creme de Chocobrownie", description: "Caixa mix de 1L, aprox. 1kg.", price: 21.99, image: "/products/caixa1L.jpg" },
  ];

  const milkShakeProducts = [
    { id: "19", name: "Milk-Shake Açaí 300ml", price: 12.00, originalPrice: 15.00, discount: 20, image: "/products/milkshake-acai-300.jpg" },
    { id: "20", name: "Milk-Shake Açaí 500ml", price: 15.60, originalPrice: 19.50, discount: 20, image: "/products/milkshake-acai-500.jpg" },
    { id: "21", name: "Milk-Shake Ninho 300ml", price: 12.00, originalPrice: 15.00, discount: 20, image: "/products/milkshake-ninho-300.jpg" },
    { id: "22", name: "Milk-Shake Ninho 500ml", price: 15.60, originalPrice: 19.50, discount: 20, image: "/products/milkshake-ninho-500.jpg" },
    { id: "23", name: "Milk-Shake Ovomaltine 300ml", price: 12.00, originalPrice: 15.00, discount: 20, image: "/products/milkshake-ovo-300.jpg" },
    { id: "24", name: "Milk-Shake Ovomaltine 500ml", price: 15.60, originalPrice: 19.50, discount: 20, image: "/products/milkshake-ovo-500.jpg" },
    { id: "25", name: "Milk-Shake Chocolate 300ml", price: 10.40, originalPrice: 13.00, discount: 20, image: "/products/milkshake-choco-300.jpg" },
    { id: "26", name: "Milk-Shake Chocolate 500ml", price: 14.00, originalPrice: 17.50, discount: 20, image: "/products/milkshake-choco-500.jpg" },
    { id: "27", name: "Milk-Shake Morango 300ml", price: 10.40, originalPrice: 13.00, discount: 20, image: "/products/milkshake-morango-300.jpg" },
    { id: "28", name: "Milk-Shake Morango 500ml", price: 14.00, originalPrice: 17.50, discount: 20, image: "/products/milkshake-morango-500.jpg" },
    { id: "29", name: "Milk-Shake Baunilha 300ml", price: 10.40, originalPrice: 13.00, discount: 20, image: "/products/milkshake-baunilha-300.jpg" },
    { id: "30", name: "Milk-Shake Baunilha 500ml", price: 14.00, originalPrice: 17.50, discount: 20, image: "/products/milkshake-baunilha-500.jpg" },
    { id: "31", name: "Milk-Shake Abacaxi 300ml", price: 10.40, originalPrice: 13.00, discount: 20, image: "/products/milkshake-abacaxi-300.jpg" },
    { id: "32", name: "Milk-Shake Abacaxi 500ml", price: 14.00, originalPrice: 17.50, discount: 20, image: "/products/milkshake-abacaxi-500.jpg" },
    { id: "33", name: "Milk-Shake Coco 300ml", price: 10.40, originalPrice: 13.00, discount: 20, image: "/products/milkshake-coco-300.jpg" },
    { id: "34", name: "Milk-Shake Coco 500ml", price: 14.00, originalPrice: 17.50, discount: 20, image: "/products/milkshake-coco-500.jpg" },
  ];

  const bebidasProducts = [
    { id: "35", name: "Água mineral sem gás 500ml", price: 2.50, image: "/products/agua-sem-gas.jpg" },
    { id: "36", name: "Água mineral com gás 500ml", price: 3.00, image: "/products/agua-com-gas.jpg" },
  ];

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


  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      
      {/* Botão de Teste de Conversão */}
      <Suspense fallback={null}>
        <ConversionTestButton onTest={handleTestConversion} />
      </Suspense>
      
      {/* Modal de confirmação de localização */}
      <LocationConfirmationModal
        city={tempLocation?.city || ""}
        onConfirm={confirmLocation}
        isVisible={showConfirmation}
      />

      {/* Modal de produto adicionado ao carrinho */}
      <AddToCartModal
        isOpen={showAddToCartModal}
        onClose={() => setShowAddToCartModal(false)}
        onContinue={() => setShowAddToCartModal(false)}
        onGoToCart={() => {
          setShowAddToCartModal(false);
          router.push("/carrinho");
        }}
        productName={currentProduct?.name || ""}
        quantity={modalQuantity}
        onQuantityChange={handleQuantityChange}
      />

      <HomeHeader onReviewsClick={scrollToReviews} />
      
      {/* Carrinho Desktop (Lateral Direita) */}
      <DesktopCart />
      
      {/* Container centralizado para desktop */}
      <div className="max-w-2xl mx-auto lg:mr-[420px]">
        {/* Banner de entrega */}
        {location && (
          <DeliveryBanner
            city={location.city}
            deliveryTime={location.deliveryTime}
          />
        )}

        {/* Informações da Loja */}
        <StoreInfo 
          city={location?.city} 
          state={location?.region}
          deliveryTime={location?.deliveryTime}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Destaque - Carousel */}
        <FeaturedCarousel products={destaqueProducts} />

        {/* Combos */}
        <div ref={combosRef} className="bg-white mb-2">
          <div className="px-4 py-3 flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Combos</h2>
            <span className="text-xs font-bold px-2 py-1 rounded uppercase text-primary">
              COMBOS
            </span>
          </div>
          {combosProducts.map((product) => (
            <ProductListCard key={product.id} product={product} />
          ))}
        </div>

        {/* Delícias na Caixa 1L */}
        <div ref={deliciasRef} className="bg-white mb-2">
          <div className="px-4 py-3 flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Delícias na Caixa 1L</h2>
            <span className="text-xs font-bold px-2 py-1 rounded uppercase text-primary">
              21,99!!!
            </span>
          </div>
          {deliciasProducts.map((product) => (
            <ProductListCard key={product.id} product={product} />
          ))}
        </div>

        {/* Milk-Shake */}
        <div ref={milkshakeRef} className="bg-white mb-2">
          <div className="px-4 py-3 flex items-center gap-2">
            <h2 className="text-lg font-bold text-primary">Milk-Shake</h2>
            <span className="text-xs font-bold px-2 py-1 rounded uppercase bg-primary text-white">
              PROMO
            </span>
          </div>
          {milkShakeProducts.map((product) => (
            <ProductListCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bebidas */}
        <div ref={bebidasRef} className="bg-white mb-2">
          <div className="px-4 py-3">
            <h2 className="text-lg font-bold text-gray-900">Bebidas</h2>
          </div>
          {bebidasProducts.map((product) => (
            <ProductListCard key={product.id} product={product} />
          ))}
        </div>

        {/* Reviews Section */}
        <div ref={reviewsRef}>
          <ReviewsSection />

          {/* Reviews Carousel */}
          <ReviewsCarousel reviews={reviews} />
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <HomeContent />
    </Suspense>
  );
}
