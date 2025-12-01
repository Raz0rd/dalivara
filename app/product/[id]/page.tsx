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
  "destaque-1": {
    id: "destaque-1",
    name: "2 Copos Açaí 500ml ZERO",
    description: "Escolha até 4 opções entre açaí e cremes, até 6 adicionais e até 2 coberturas. 9 Complementos Grátis!",
    price: 25.90,
    originalPrice: 49.80,
    discount: 48,
    image: "/products/zero1.webp",
    maxAcaiCremes: 4,
    maxAdicionais: 6,
    maxCoberturas: 2,
  },
  "destaque-2": {
    id: "destaque-2",
    name: "2 Copos Açaí 700ml ZERO",
    description: "Escolha até 4 opções entre açaí e cremes, até 6 adicionais e até 2 coberturas. 9 Complementos Grátis! Mais que o dobro do Combo 1 por apenas R$7 a mais!",
    price: 29.90,
    originalPrice: 59.80,
    discount: 50,
    image: "/products/zero2.webp",
    maxAcaiCremes: 4,
    maxAdicionais: 6,
    maxCoberturas: 2,
  },
  "destaque-3": {
    id: "destaque-3",
    name: "2 Copos Açaí 1L",
    description: "Escolha até 4 opções entre açaí e cremes, até 6 adicionais e até 2 coberturas. 9 Complementos Grátis!",
    price: 37.90,
    originalPrice: 75.80,
    discount: 50,
    image: "/products/copo2.webp",
    maxAcaiCremes: 4,
    maxAdicionais: 6,
    maxCoberturas: 2,
  },
  "combo-marmita-gourmet-p": {
    id: "combo-marmita-gourmet-p",
    name: "Marmita Gourmet",
    description: "Marmita tamanho P. Escolha 1 sabor de açaí/creme, até 6 adicionais e até 2 coberturas. Acompanha Kit Kat, Nutella e Sonho de Valsa.",
    price: 24.99,
    image: "/products/marmitaGourmet.jpeg",
    maxAcaiCremes: 1,
    maxAdicionais: 6,
    maxCoberturas: 2,
    useZeroOptions: true,
  },
  "combo-marmita-600g": {
    id: "combo-marmita-600g",
    name: "Marmita G - 600g",
    description: "Marmita 600g. Escolha 1 sabor de açaí/creme, até 6 adicionais e até 2 coberturas. Acompanha copo de 100ml de granola e leite condensado.",
    price: 32.99,
    image: "/products/marmitaG.webp",
    maxAcaiCremes: 1,
    maxAdicionais: 6,
    maxCoberturas: 2,
    useZeroOptions: true,
  },
  "combo-marmita-350g": {
    id: "combo-marmita-350g",
    name: "Marmita M - 350g",
    description: "Média de 350g, indicado para 1 pessoa. Escolha 1 sabor de açaí/creme, até 6 adicionais e até 2 coberturas. Já acompanha leite condensado.",
    price: 19.99,
    image: "/products/marmitaM.jpeg",
    maxAcaiCremes: 1,
    maxAdicionais: 6,
    maxCoberturas: 2,
    useZeroOptions: true,
  },
  "combo-marmita-p": {
    id: "combo-marmita-p",
    name: "Marmita P",
    description: "Indicado para 1 pessoa. Escolha 1 sabor de açaí/creme, até 6 adicionais e até 2 coberturas. Acompanha leite condensado.",
    price: 16.99,
    image: "/products/marmitap.webp",
    maxAcaiCremes: 1,
    maxAdicionais: 6,
    maxCoberturas: 2,
    useZeroOptions: true,
  },
  "combo-marmita-p2": {
    id: "combo-marmita-p2",
    name: "Marmita P2",
    description: "Indicado para 1 pessoa. Escolha 1 sabor de açaí/creme, até 6 adicionais e até 2 coberturas. Acompanha leite condensado.",
    price: 16.99,
    image: "/products/marmitap2.jpeg",
    maxAcaiCremes: 1,
    maxAdicionais: 6,
    maxCoberturas: 2,
    useZeroOptions: true,
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
  const productId = params?.id as string || "destaque-1";
  const product = productsData[productId] || productsData["destaque-1"];

  // Verificar se deve usar opções ZERO (produtos destaque ou produtos com flag useZeroOptions)
  const isZeroProduct = productId.startsWith("destaque-") || product.useZeroOptions === true;

  // Opções de açaí/cremes para produtos ZERO
  const acaiCremesZero = [
    { id: "1", name: "Tradicional", price: 0, image: "/products/tradicional.png" },
    { id: "2", name: "Cupuaçu", price: 0, image: "/products/cupuaçu.png" },
    { id: "3", name: "Casadinho", price: 0, image: "/products/casadinho.png", description: "Metade cupuaçu, metade açaí" },
    { id: "4", name: "Trufado Avelã", price: 0, image: "/products/trufado-avela.png" },
  ];

  // Opções de açaí/cremes para produtos normais
  const acaiCremesNormal = [
    { id: "1", name: "Açaí", price: 0, image: "/products/caixa1L.jpg" },
    { id: "2", name: "Açaí Zero Açúcar", price: 0, image: "/products/acai-fit.jpg" },
    { id: "3", name: "Creme de Morango", price: 0, image: "/products/creme-morango.jpg" },
    { id: "4", name: "Creme de Cupuaçu", price: 0, image: "/products/creme-cupuacu.jpg" },
    { id: "5", name: "Creme de Maracujá", price: 0, image: "/products/creme-maracuja.jpg" },
    { id: "6", name: "Creme de Ninho", price: 0, image: "/products/creme-ninho.jpg" },
    { id: "7", name: "Creme de Oreo", price: 0, image: "/products/creme-oreo.jpg" },
    { id: "8", name: "Creme de Ovomaltine", price: 0, image: "/products/creme-ovomaltine.jpg" },
    { id: "9", name: "Creme de Paçoquita", price: 0, image: "/products/creme-pacoquita.jpg" },
  ];

  // Usar as opções corretas baseado no tipo de produto
  const acaiCremes = isZeroProduct ? acaiCremesZero : acaiCremesNormal;

  const adicionais = [
    { id: "1", name: "Banana", price: 0, image: "/products/frutas/banana.png" },
    { id: "2", name: "Morango", price: 0, image: "/products/frutas/morangos.png" },
    { id: "3", name: "Granola", price: 0, image: "/products/frutas/granola.png" },
    { id: "4", name: "Leite em Pó", price: 0, image: "/products/frutas/leite em pó.png" },
    { id: "5", name: "Paçoca", price: 0, image: "/products/frutas/paçoca.png" },
    { id: "6", name: "Amendoim", price: 0, image: "/products/frutas/amedoin.png" },
    { id: "7", name: "Manga", price: 0, image: "/products/frutas/manga.png" },
    { id: "8", name: "Uvas", price: 0, image: "/products/frutas/uvas.png" },
    { id: "9", name: "Abacaxi", price: 0, image: "/products/frutas/abacaxi.png" },
    { id: "10", name: "Chocoball", price: 0, image: "/products/frutas/chocoball.png" },
    { id: "11", name: "Sucrilhos", price: 0, image: "/products/frutas/sucrilhos.png" },
    { id: "12", name: "Confete", price: 0, image: "/products/frutas/confete.png" },
    { id: "13", name: "Bala de Goma", price: 0, image: "/products/frutas/bala de goma.png" },
  ];

  const coberturas = [
    { id: "1", name: "Leite Condensado", price: 0, image: "/products/frutas/leite condensado.png" },
    { id: "2", name: "Chocolate", price: 0, image: "/products/frutas/chocolate ao leite derretido.png" },
    { id: "3", name: "Mel", price: 0, image: "/products/frutas/mel.png" },
    { id: "4", name: "Creme de Avelã", price: 0, image: "/products/frutas/creme de avelã.png" },
    { id: "5", name: "Creme de Ninho", price: 0, image: "/products/frutas/creme de ninho.png" },
    { id: "6", name: "Creme Kinder", price: 0, image: "/products/frutas/creme kinder.png" },
    { id: "7", name: "Ovomaltine", price: 0, image: "/products/frutas/ovo maltine.png" },
    { id: "8", name: "Granulado Chocolate", price: 0, image: "/products/frutas/granulado chocolate.png" },
    { id: "9", name: "Granulado Colorido", price: 0, image: "/products/frutas/granulado colorido.png" },
    { id: "10", name: "Xarope Guaraná", price: 0, image: "/products/frutas/xarope guaraná.png" },
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

  const maxAcaiCremes = product.maxAcaiCremes || 4;
  const maxAdicionais = product.maxAdicionais || 6;
  const maxCoberturas = product.maxCoberturas || 2;
  
  const canAddToCart = selectedItems.acaiCremes.length >= 1 && selectedItems.acaiCremes.length <= maxAcaiCremes;

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
          description={`Escolha entre 1 a ${maxAcaiCremes} ${maxAcaiCremes === 1 ? 'item' : 'itens'}`}
          items={acaiCremes}
          selectedItems={selectedItems.acaiCremes}
          onSelectionChange={(items) =>
            setSelectedItems({ ...selectedItems, acaiCremes: items })
          }
          minItems={1}
          maxItems={maxAcaiCremes}
          required
        />

        <AdditionalSelector
          title="Adicionais"
          description={`Escolha até ${maxAdicionais} ${maxAdicionais === 1 ? 'item' : 'itens'}`}
          items={adicionais}
          selectedItems={selectedItems.adicionais}
          onSelectionChange={(items) =>
            setSelectedItems({ ...selectedItems, adicionais: items })
          }
          maxItems={maxAdicionais}
        />

        <AdditionalSelector
          title="Coberturas"
          description={`Escolha até ${maxCoberturas} ${maxCoberturas === 1 ? 'item' : 'itens'}`}
          items={coberturas}
          selectedItems={selectedItems.coberturas}
          onSelectionChange={(items) =>
            setSelectedItems({ ...selectedItems, coberturas: items })
          }
          maxItems={maxCoberturas}
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
