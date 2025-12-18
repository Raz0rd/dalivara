"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import Modelo2Layout from "./Modelo2Layout";
import Modelo2BottomNav from "./Modelo2BottomNav";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

export default function Modelo2CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const { toast, showToast, hideToast } = useToast();
  const hasItems = items.length > 0;
  const [hasBlockedCart, setHasBlockedCart] = useState(false);

  // Debug: verificar itens
  useEffect(() => {
    console.log('🛒 Carrinho Modelo2 - Total de itens:', items.length);
    console.log('🛒 Itens:', items);
  }, [items]);

  // Verificar se há pedido pendente (redireciona para pagamento)
  useEffect(() => {
    const pendingOrder = localStorage.getItem('pendingOrder');
    if (pendingOrder) {
      const order = JSON.parse(pendingOrder);
      const now = Date.now();
      
      if (now < order.expiresAt) {
        // Tem pedido pendente válido, redirecionar para pagamento
        console.log('🔒 [Carrinho Modelo2] Pedido pendente encontrado, redirecionando para pagamento...');
        router.push('/ifoodpay');
        return;
      } else {
        // Pedido expirou, limpar
        localStorage.removeItem('pendingOrder');
      }
    }
  }, [router]);

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        updateQuantity(id, newQuantity);
      }
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    showToast("Item removido do carrinho", "success");
  };

  const handleCheckout = () => {
    if (hasBlockedCart) {
      alert("Você tem um pagamento pendente. Finalize ou cancele para continuar.");
      return;
    }
    // Vai para a página de endereço (mesmo fluxo do modelo1)
    router.push('/checkout/endereco');
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

      {/* Header fixo */}
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#5b0e5c',
        color: 'white',
        padding: '15px 20px',
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <Link href="/" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '20px'
          }}>
            <i className="fa-solid fa-chevron-left"></i>
          </Link>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            margin: 0
          }}>
            Meu Carrinho
          </h1>
        </div>
      </header>

      {/* Container principal */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 140px)',
        paddingBottom: '180px',
        backgroundColor: '#f5f5f5',
        padding: '20px'
      }}>

        {/* Aviso de Carrinho Bloqueado */}
        {hasBlockedCart && (
          <div className="alert alert-warning" style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            color: '#856404',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <b>⏳ Carrinho Bloqueado</b>
            <p style={{margin: '5px 0 0'}}>
              Você tem um pagamento pendente. Finalize ou cancele para editar o carrinho.
            </p>
          </div>
        )}

        {/* Carrinho vazio */}
        {!hasItems ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
            backgroundColor: 'white',
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <i className="fa-solid fa-cart-shopping" style={{
              fontSize: '80px',
              color: '#ddd',
              marginBottom: '20px',
              display: 'block'
            }}></i>
            <h2 style={{fontSize: '24px', marginBottom: '10px', color: '#333'}}>
              Seu carrinho está vazio
            </h2>
            <p style={{fontSize: '16px', color: '#999', marginBottom: '30px'}}>
              Adicione produtos ao carrinho e faça o pedido
            </p>
            <Link href="/" style={{
              display: 'inline-block',
              padding: '15px 40px',
              textDecoration: 'none',
              borderRadius: '8px',
              backgroundColor: '#5b0e5c',
              color: 'white',
              fontWeight: 'bold'
            }}>
              <i className="fa-solid fa-arrow-left"></i> Voltar ao Cardápio
            </Link>
          </div>
        ) : (
          <>
            {/* Lista de itens */}
            <div style={{
              marginBottom: '20px'
            }}>
              <h2 style={{
                marginBottom: '15px', 
                color: '#5b0e5c', 
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                {items.length} {items.length === 1 ? 'item' : 'itens'} no carrinho
              </h2>
              
              <div style={{
                backgroundColor: 'white',
                display: 'block',
                visibility: 'visible',
                opacity: 1
              }}>
                {items.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '15px',
                    borderBottom: '1px solid #eee',
                    backgroundColor: 'white',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {/* Linha 1: Imagem + Info + Preço */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      {/* Imagem */}
                      <div style={{flexShrink: 0}}>
                        <Image 
                          src={item.image}
                          width={70}
                          height={70}
                          alt={item.name}
                          style={{borderRadius: '8px'}}
                        />
                      </div>

                      {/* Info */}
                      <div style={{flex: 1, minWidth: 0}}>
                      <span className="nomeProduto" style={{
                        display: 'block',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#5b0e5c',
                        marginBottom: '5px'
                      }}>
                        {item.name}
                      </span>
                      
                      {item.observations && (
                        <span style={{
                          display: 'block',
                          fontSize: '12px',
                          color: '#666',
                          marginBottom: '8px'
                        }}>
                          {item.observations}
                        </span>
                      )}

                      <span className="preco" style={{
                        display: 'block',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#333'
                      }}>
                        R$ {item.price.toFixed(2)}
                      </span>
                    </div>
                    </div>

                    {/* Linha 2: Controles de quantidade e remover */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '15px',
                        marginTop: '10px'
                      }}>
                        {/* Controles de quantidade */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          border: '2px solid #5b0e5c',
                          borderRadius: '8px',
                          padding: '8px 15px',
                          backgroundColor: 'white'
                        }}>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            disabled={hasBlockedCart}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: hasBlockedCart ? 'not-allowed' : 'pointer',
                              opacity: hasBlockedCart ? 0.5 : 1,
                              padding: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <i className="fa-solid fa-minus" style={{color: '#5b0e5c', fontSize: '14px'}}></i>
                          </button>
                          <span style={{
                            minWidth: '30px',
                            textAlign: 'center',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#333'
                          }}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            disabled={hasBlockedCart}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: hasBlockedCart ? 'not-allowed' : 'pointer',
                              opacity: hasBlockedCart ? 0.5 : 1,
                              padding: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <i className="fa-solid fa-plus" style={{color: '#5b0e5c', fontSize: '14px'}}></i>
                          </button>
                        </div>

                        {/* Botão remover */}
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={hasBlockedCart}
                          style={{
                            background: '#fff',
                            border: '2px solid #dc3545',
                            borderRadius: '8px',
                            cursor: hasBlockedCart ? 'not-allowed' : 'pointer',
                            opacity: hasBlockedCart ? 0.5 : 1,
                            padding: '10px 15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          title="Remover item"
                        >
                          <i className="fa-solid fa-trash" style={{color: '#dc3545', fontSize: '16px'}}></i>
                          <span style={{color: '#dc3545', fontSize: '14px', fontWeight: 'bold'}}>Remover</span>
                        </button>
                      </div>
                  </div>
                ))}
              </div>

              {/* Resumo do Pedido */}
              <div className="alert alert-success" style={{
                marginTop: '30px',
                padding: '20px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                border: '2px solid #5b0e5c'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#5b0e5c',
                  marginBottom: '15px'
                }}>
                  📋 Resumo do Pedido
                </h3>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  fontSize: '16px',
                  color: '#333'
                }}>
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'}):</span>
                  <span style={{fontWeight: 'bold'}}>R$ {getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '15px',
                  fontSize: '16px'
                }}>
                  <span style={{color: '#666'}}>Taxa de entrega:</span>
                  <span style={{color: '#077c22', fontWeight: 'bold'}}>GRÁTIS 🎉</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '15px',
                  borderTop: '2px solid #5b0e5c',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: '#5b0e5c'
                }}>
                  <span>Total:</span>
                  <span>R$ {getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div style={{
                  marginTop: '15px',
                  padding: '10px',
                  backgroundColor: '#fff',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#666',
                  textAlign: 'center'
                }}>
                  <i className="fa-solid fa-motorcycle" style={{color: '#5b0e5c', marginRight: '5px'}}></i>
                  Entrega em <b>10-20 minutos</b>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer com botões */}
      {hasItems && (
        <footer style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          padding: '15px',
          zIndex: 1000,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          borderTop: '1px solid #ddd'
        }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {/* Micro-copy de segurança */}
            <div style={{
              textAlign: 'center',
              padding: '8px',
              fontSize: '13px',
              color: '#666',
              backgroundColor: '#f0f9ff',
              borderRadius: '6px',
              border: '1px solid #e0f2fe'
            }}>
              🔒 <b>Pagamento e entrega feitos pelo iFood</b>
            </div>

            {/* Botão Finalizar Pedido - DOMINANTE */}
            <button 
              onClick={handleCheckout}
              disabled={hasBlockedCart}
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '18px',
                fontWeight: 'bold',
                border: 'none',
                cursor: hasBlockedCart ? 'not-allowed' : 'pointer',
                opacity: hasBlockedCart ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: '20px',
                paddingRight: '20px',
                backgroundColor: '#5b0e5c',
                color: 'white',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(91, 14, 92, 0.3)'
              }}
            >
              <span>Finalizar Pedido</span>
              <span style={{fontWeight: 'bold'}}>R$ {getTotalPrice().toFixed(2)}</span>
            </button>

            {/* Link simples - Despriorizado */}
            <Link href="/" style={{
              textAlign: 'center',
              padding: '8px',
              fontSize: '14px',
              color: '#666',
              textDecoration: 'underline',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: 'none'
            }}>
              Adicionar mais produtos
            </Link>
          </div>
        </footer>
      )}

      {/* Bottom Navigation quando carrinho vazio */}
      {!hasItems && <Modelo2BottomNav />}
    </Modelo2Layout>
  );
}
