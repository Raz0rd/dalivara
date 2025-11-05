"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import ProductInfo from "@/components/ProductInfo";
import AdditionalSelector from "@/components/AdditionalSelector";
import FreebieSelector from "@/components/FreebieSelector";
import CartButton from "@/components/CartButton";
import Toast from "@/components/Toast";
import AddToCartModal from "@/components/AddToCartModal";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/useToast";

// Dados dos produtos
const productsData: Record<string, any> = {
  "1": {
    id: "1",
    name: "Combo 1 Kg",
    description: "Escolha até 4 opções entre açaí e cremes, até 6 adicionais e até 2 coberturas. Obs.: Todos os cremes, adicionais e coberturas escolhidos no combo serão inclusos no peso.",
    price: 38.99,
    originalPrice: 45.99,
    discount: 15,
    image: "/products/caixa1L.jpg",
  },
  "destaque-1": {
    id: "destaque-1",
    name: "2 Copos Açaí 500ml ZERO",
    description: "Escolha até 4 opções entre açaí e cremes, até 6 adicionais e até 2 coberturas. 9 Complementos Grátis!",
    price: 25.90,
    originalPrice: 49.80,
    discount: 48,
    image: "/products/zero1.webp",
  },
  "destaque-2": {
    id: "destaque-2",
    name: "2 Copos Açaí 700ml ZERO",
    description: "Escolha até 4 opções entre açaí e cremes, até 6 adicionais e até 2 coberturas. 9 Complementos Grátis! Mais que o dobro do Combo 1 por apenas R$7 a mais!",
    price: 29.90,
    originalPrice: 59.80,
    discount: 50,
    image: "/products/zero2.webp",
  },
  "destaque-3": {
    id: "destaque-3",
    name: "2 Copos Açaí 1L",
    description: "Escolha até 4 opções entre açaí e cremes, até 6 adicionais e até 2 coberturas. 9 Complementos Grátis!",
    price: 37.90,
    originalPrice: 75.80,
    discount: 50,
    image: "/products/copo2.webp",
  },
};

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const { addItem } = useCart();
  const { toast, showToast, hideToast } = useToast();
  const [selectedItems, setSelectedItems] = useState({
    acaiCremes: [] as any[],
    adicionais: [] as any[],
    coberturas: [] as any[],
  });
  const [selectedFreebie, setSelectedFreebie] = useState<string | null>(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [observations, setObservations] = useState("");

  // Pegar produto baseado no ID da URL
  const productId = params?.id as string || "1";
  const product = productsData[productId] || productsData["1"];

  const acaiCremes = [
    { id: "1", name: "Açaí", price: 0 },
    { id: "2", name: "Açaí Zero Açúcar", price: 0 },
    { id: "3", name: "Creme de Morango", price: 0 },
    { id: "4", name: "Creme de Cupuaçu", price: 0 },
    { id: "5", name: "Creme de Maracujá", price: 0 },
  ];

  const adicionais = [
    { id: "1", name: "Banana", price: 0 },
    { id: "2", name: "Morango", price: 0 },
    { id: "3", name: "Granola", price: 0 },
    { id: "4", name: "Leite em Pó", price: 0 },
    { id: "5", name: "Paçoca", price: 0 },
    { id: "6", name: "Amendoim", price: 0 },
  ];

  const coberturas = [
    { id: "1", name: "Leite Condensado", price: 0 },
    { id: "2", name: "Chocolate", price: 0 },
    { id: "3", name: "Mel", price: 0 },
    { id: "4", name: "Calda de Morango", price: 0 },
  ];

  const handleAddToCart = () => {
    // Apenas abrir o modal
    setModalQuantity(1);
    setShowAddToCartModal(true);
  };

  const handleConfirmAddToCart = () => {
    // Adicionar item ao carrinho com observações
    addItem({
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: modalQuantity,
      image: product.image,
      customizations: {
        acaiCremes: selectedItems.acaiCremes.map(item => item.name),
        adicionais: selectedItems.adicionais.map(item => item.name),
        coberturas: selectedItems.coberturas.map(item => item.name),
        brinde: selectedFreebie || undefined,
      },
      observations: observations || undefined,
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    setModalQuantity(newQuantity);
  };

  const canAddToCart = selectedItems.acaiCremes.length >= 1 && selectedItems.acaiCremes.length <= 4;

  return (
    <main className="min-h-screen bg-white pb-24">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      <Header title="Detalhes do produto" onBack={() => router.push("/")} />
      
      {/* Container centralizado para desktop */}
      <div className="max-w-2xl mx-auto">
        <ProductInfo product={product} />

        <div className="px-4 space-y-4">
        <AdditionalSelector
          title="Açaí e Cremes"
          description="Escolha entre 1 a 4 itens"
          items={acaiCremes}
          selectedItems={selectedItems.acaiCremes}
          onSelectionChange={(items) =>
            setSelectedItems({ ...selectedItems, acaiCremes: items })
          }
          minItems={1}
          maxItems={4}
          required
        />

        <AdditionalSelector
          title="Adicionais"
          description="Escolha até 6 itens"
          items={adicionais}
          selectedItems={selectedItems.adicionais}
          onSelectionChange={(items) =>
            setSelectedItems({ ...selectedItems, adicionais: items })
          }
          maxItems={6}
        />

        <AdditionalSelector
          title="Coberturas"
          description="Escolha até 2 itens"
          items={coberturas}
          selectedItems={selectedItems.coberturas}
          onSelectionChange={(items) =>
            setSelectedItems({ ...selectedItems, coberturas: items })
          }
          maxItems={2}
        />

        {/* Brinde Grátis */}
        <FreebieSelector onSelect={setSelectedFreebie} />
        </div>

        <CartButton
          price={product.price}
          onAddToCart={handleAddToCart}
          disabled={!canAddToCart}
        />
      </div>

      <AddToCartModal
        isOpen={showAddToCartModal}
        onClose={() => setShowAddToCartModal(false)}
        onContinue={() => {
          handleConfirmAddToCart();
          setShowAddToCartModal(false);
          router.push("/");
        }}
        onGoToCart={() => {
          handleConfirmAddToCart();
          setShowAddToCartModal(false);
          router.push("/carrinho");
        }}
        productName={product.name}
        quantity={modalQuantity}
        onQuantityChange={handleQuantityChange}
        onObservationsChange={setObservations}
      />
    </main>
  );
}
