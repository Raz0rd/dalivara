"use client";

import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";

interface Modelo2LayoutProps {
  children: React.ReactNode;
}

export default function Modelo2Layout({ children }: Modelo2LayoutProps) {
  useEffect(() => {
    // Carregar CSS do modelo2
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/modelo2/delivry.css';
    document.head.appendChild(link);

    // Adicionar estilos customizados
    const style = document.createElement('style');
    style.textContent = `
      h1, h2 { color: #5b0e5c; }
      header#topo .cover { background-color: #5b0e5c; }
      header#topo .info h1 { color: #5b0e5c; }
      header#topo .info .icones a { color: #5b0e5c; border-color: #5b0e5c; }
      header#topo .cover .logo { background: #5b0e5c; }
      header#topo #menuCategorias { background: #5b0e5c; }
      header#topo .categorias a { border-top-color: #5b0e5c; }
      footer { background: #5b0e5c; }
      footer#carrinho .container .icone span { color: #5b0e5c; }
      .btn, a.voltar, .btnSair, .btnFidelidade, .btnGoogle, .btnEmail, .btnSemCadastro { background: #5b0e5c; }
      .qtdeProduto i:hover { color: #5b0e5c; }
      .lista .item .col .nomeProduto { color: #5b0e5c; }
      main#lista .produtos .item a:hover { border: 2px solid #5b0e5c; }
      #pedido .entrega .radio label input[type="radio"]:checked,
      #pedido .entrega .radio label:hover { background: #5b0e5c; }
      #pedido .pagamentos input[type="radio"]:checked+label::before,
      #detalhesProduto .info2 .opcoes input[type="checkbox"]:checked+label::before,
      #pedido .trocarPontos input[type="checkbox"]:checked+label::before {
        background-color: #5b0e5c;
        border: 2px solid #5b0e5c;
      }
      .selecionado { border: 2px solid #5b0e5c; }
      #meuCarrinho button.fechar,
      #rastreamento .registro span.passou { background: #5b0e5c; }
      span.estoque i { color: #5b0e5c; }
      
      .black-friday-bar {
        background: #000;
        color: #ffd600;
        overflow: hidden;
        white-space: nowrap;
        border-top: 2px solid #5b0e5c;
        border-bottom: 2px solid #5b0e5c;
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
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

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
