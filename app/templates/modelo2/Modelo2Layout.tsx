"use client";

import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import { useTenant } from "@/contexts/TenantContext";

interface Modelo2LayoutProps {
  children: React.ReactNode;
}

export default function Modelo2Layout({ children }: Modelo2LayoutProps) {
  const tenant = useTenant();
  const primaryColor = tenant.primaryColor;

  useEffect(() => {
    // Carregar CSS do modelo2
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/modelo2/delivry.css';
    document.head.appendChild(link);

    // Adicionar estilos customizados com cor do tenant
    const style = document.createElement('style');
    style.textContent = `
      h1, h2 { color: ${primaryColor}; }
      header#topo .cover { background-color: ${primaryColor}; }
      header#topo .info h1 { color: ${primaryColor}; }
      header#topo .info .icones a { color: ${primaryColor}; border-color: ${primaryColor}; }
      header#topo .cover .logo { background: ${primaryColor}; }
      header#topo #menuCategorias { background: ${primaryColor}; }
      header#topo .categorias a { border-top-color: ${primaryColor}; }
      footer { background: ${primaryColor}; }
      footer#carrinho .container .icone span { color: ${primaryColor}; }
      .btn, a.voltar, .btnSair, .btnFidelidade, .btnGoogle, .btnEmail, .btnSemCadastro { background: ${primaryColor}; }
      .qtdeProduto i:hover { color: ${primaryColor}; }
      .lista .item .col .nomeProduto { color: ${primaryColor}; }
      main#lista .produtos .item a:hover { border: 2px solid ${primaryColor}; }
      #pedido .entrega .radio label input[type="radio"]:checked,
      #pedido .entrega .radio label:hover { background: ${primaryColor}; }
      #pedido .pagamentos input[type="radio"]:checked+label::before,
      #detalhesProduto .info2 .opcoes input[type="checkbox"]:checked+label::before,
      #pedido .trocarPontos input[type="checkbox"]:checked+label::before {
        background-color: ${primaryColor};
        border: 2px solid ${primaryColor};
      }
      .selecionado { border: 2px solid ${primaryColor}; }
      #meuCarrinho button.fechar,
      #rastreamento .registro span.passou { background: ${primaryColor}; }
      span.estoque i { color: ${primaryColor}; }
      
      .black-friday-bar {
        background: #000;
        color: #ffd600;
        overflow: hidden;
        white-space: nowrap;
        border-top: 2px solid ${primaryColor};
        border-bottom: 2px solid ${primaryColor};
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
      }
      .black-friday-track {
        display: inline-block;
        padding: 4px 0;
        animation: bf-scroll 18s linear infinite;
      }
      .black-friday-track span {
        padding-right: 3rem;
      }
      @keyframes bf-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      
      /* Bottom Navigation Bar */
      .bottomBar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: ${primaryColor};
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
      }
      
      .bottomBar .contentBar {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 8px 0;
        max-width: 600px;
        margin: 0 auto;
      }
      
      .bottomBar .contentBar a {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: all 0.3s ease;
        padding: 8px 16px;
        border-radius: 12px;
        min-width: 70px;
      }
      
      .bottomBar .contentBar a:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
      }
      
      .bottomBar .contentBar a.active {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.15);
      }
      
      .bottomBar .contentBar a .icon {
        font-size: 22px;
        margin-bottom: 4px;
      }
      
      .bottomBar .contentBar a span {
        font-size: 11px;
        font-weight: 500;
      }
      
      /* Adicionar padding no body para não sobrepor o bottomBar */
      body {
        padding-bottom: 70px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, [primaryColor]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/sweetalert2@11"
        strategy="beforeInteractive"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      
      <div id="opacidade" className="fechar"></div>
      {children}
    </>
  );
}
