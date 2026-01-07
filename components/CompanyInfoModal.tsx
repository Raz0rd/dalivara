"use client";

import { X, Building2, MapPin, Phone, Mail, FileText, Users, Award } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";

interface CompanyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanyInfoModal({ isOpen, onClose }: CompanyInfoModalProps) {
  const tenant = useTenant();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <Building2 size={24} />
            <h2 className="text-xl font-bold">Sobre a {tenant.storeName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Quem Somos */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="text-primary" size={20} />
              <h3 className="font-bold text-lg text-gray-900">Quem Somos</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              A <strong>{tenant.storeName}</strong> é uma empresa especializada no fornecimento de açaí de alta qualidade para toda a região. Trabalhamos em parceria com diversas lojinhas de açaí, garantindo que nossos clientes recebam sempre o melhor produto.
            </p>
          </div>

          {/* Nossa Missão */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="text-primary" size={20} />
              <h3 className="font-bold text-lg text-gray-900">Nossa Missão</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Fornecer açaí premium para estabelecimentos parceiros e consumidores finais, mantendo os mais altos padrões de qualidade e sabor. Nosso compromisso é levar o melhor açaí do mundo até você!
            </p>
          </div>

          {/* Diferenciais */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="text-primary" size={20} />
              <h3 className="font-bold text-lg text-gray-900">Nossos Diferenciais</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Fornecedor oficial de diversas lojinhas da região</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Açaí 100% natural e de qualidade premium</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Entrega rápida e grátis na sua região</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Variedade de sabores e complementos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Preços competitivos e promoções exclusivas</span>
              </li>
            </ul>
          </div>

          {/* Dados da Empresa */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="text-primary" size={20} />
              <h3 className="font-bold text-lg text-gray-900">Dados da Empresa</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Razão Social:</span>
                <span className="font-semibold text-gray-900">CINTHIA LEA DOS SANTOS RODRIGUES</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CNPJ:</span>
                <span className="font-semibold text-gray-900">52.634.869/0001-91</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nome Fantasia:</span>
                <span className="font-semibold text-gray-900">{tenant.storeName}</span>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="text-primary" size={20} />
              <h3 className="font-bold text-lg text-gray-900">Entre em Contato</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Tem alguma dúvida ou quer fazer uma parceria? Entre em contato conosco através das nossas redes sociais ou pelo WhatsApp!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
