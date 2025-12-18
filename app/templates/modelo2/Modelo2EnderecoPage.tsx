"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import Modelo2Layout from "./Modelo2Layout";

interface AddressData {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
}

export default function Modelo2EnderecoPage() {
  const router = useRouter();
  const { userData, setUserData } = useUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<AddressData>({
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");

  useEffect(() => {
    // Carregar dados salvos
    if (userData) {
      setFullName(userData.name || "");
      setEmail(userData.email || "");
      if (userData.address) {
        setAddress({
          ...userData.address,
          number: userData.address.number || "",
        });
        setCep(userData.address.cep);
      }
    }
  }, [userData]);

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setCep(formatted);
    setCepError("");

    const numbers = formatted.replace(/\D/g, "");
    
    if (numbers.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${numbers}/json/`);
        const data = await response.json();

        if (data.erro) {
          setCepError("CEP não encontrado. Preencha manualmente.");
          setAddress({
            cep: formatted,
            street: "",
            number: "",
            neighborhood: "",
            city: "",
            state: "",
            complement: "",
          });
        } else {
          const hasEmptyFields = !data.logradouro || !data.bairro;
          
          if (hasEmptyFields) {
            setCepError("CEP encontrado, mas preencha os dados manualmente.");
          }
          
          setAddress({
            cep: formatted,
            street: data.logradouro || "",
            number: address.number || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
            complement: "",
          });
        }
      } catch (error) {
        setCepError("Erro ao buscar CEP");
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Salvar dados completos
    setUserData({
      ...userData,
      name: fullName,
      email,
      address,
    });

    // Ir para resumo do pedido (onde escolhe entrega e gera PIX)
    router.push("/checkout/resumo");
  };

  const isValid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    cep.replace(/\D/g, "").length === 8 &&
    address.number.trim().length > 0;

  return (
    <Modelo2Layout>
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
          <Link href="/carrinho" style={{
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
            Dados de Entrega
          </h1>
        </div>
      </header>

      {/* Container principal */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 140px)',
        paddingBottom: '100px',
        backgroundColor: '#f5f5f5',
        padding: '20px'
      }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Dados Pessoais */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#5b0e5c',
              marginBottom: '10px'
            }}>
              📝 Dados Pessoais
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#666',
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#f0f9ff',
              borderRadius: '6px',
              border: '1px solid #e0f2fe'
            }}>
              ℹ️ Os demais dados você confirma no iFood
            </p>

            <div style={{marginBottom: '15px'}}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '5px'
              }}>
                Nome Completo *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Digite seu nome completo"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '5px'
              }}>
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                required
              />
            </div>
          </div>

          {/* CEP e Endereço */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#5b0e5c',
              marginBottom: '15px'
            }}>
              📍 Endereço para Entrega
            </h2>

            <div style={{marginBottom: '15px'}}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '5px'
              }}>
                CEP *
              </label>
              <input
                type="text"
                value={cep}
                onChange={handleCepChange}
                placeholder="00000-000"
                maxLength={9}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `2px solid ${cepError ? '#dc3545' : '#ddd'}`,
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                required
              />
              {loadingCep && (
                <span style={{fontSize: '12px', color: '#666', display: 'block', marginTop: '5px'}}>Buscando CEP...</span>
              )}
              {cepError && (
                <span style={{fontSize: '12px', color: '#dc3545', display: 'block', marginTop: '5px'}}>{cepError}</span>
              )}
            </div>

            {/* Mostrar endereço encontrado */}
            {address.street && address.city && address.state && (
              <>
                <div style={{
                  marginBottom: '15px',
                  padding: '12px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '6px',
                  border: '1px solid #e0f2fe'
                }}>
                  <p style={{fontSize: '14px', color: '#666', marginBottom: '5px'}}>
                    <strong>Endereço encontrado:</strong>
                  </p>
                  <p style={{fontSize: '14px', color: '#333'}}>
                    {address.street}, {address.neighborhood}<br/>
                    {address.city} - {address.state}
                  </p>
                </div>

                {/* Número */}
                <div style={{marginBottom: '15px'}}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '5px'
                  }}>
                    Número *
                  </label>
                  <input
                    type="text"
                    value={address.number}
                    onChange={(e) => setAddress({...address, number: e.target.value})}
                    placeholder="Ex: 123"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    required
                  />
                </div>

                {/* Complemento */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '5px'
                  }}>
                    Complemento (opcional)
                  </label>
                  <input
                    type="text"
                    value={address.complement}
                    onChange={(e) => setAddress({...address, complement: e.target.value})}
                    placeholder="Ex: Apto 101, Bloco A"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Footer com botão continuar */}
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
          margin: '0 auto'
        }}>
          <button 
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '18px',
              fontWeight: 'bold',
              border: 'none',
              cursor: (!isValid || isSubmitting) ? 'not-allowed' : 'pointer',
              opacity: (!isValid || isSubmitting) ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              backgroundColor: '#5b0e5c',
              color: 'white',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Processando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrow-right"></i>
                Continuar para o iFood
              </>
            )}
          </button>
          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            marginTop: '10px',
            padding: '0 10px'
          }}>
            Você finalizará o pagamento no iFood com total segurança
          </p>
        </div>
      </footer>
    </Modelo2Layout>
  );
}
