import type { Metadata } from "next";
import Link from "next/link";
import {
  Layers,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Tag,
  MousePointerClick,
  Eye,
  Send,
  Zap,
  HelpCircle,
  Copy,
  ShieldCheck,
  BarChart2
} from "lucide-react";

export const metadata: Metadata = {
  title: "Como obter o ID do Google Tag Manager - Landra",
  description: "Tutorial passo a passo para obter seu Container ID do Google Tag Manager (GTM) e rastrear eventos no Landra."
};

export default function GoogleTagManagerTutorialPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0b0f17",
        color: "#f8fafc",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        lineHeight: 1.6
      }}
    >
      {/* Top Header */}
      <header
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(11, 15, 23, 0.8)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "16px 24px"
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#ffffff",
              textDecoration: "none"
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                background: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Layers size={18} color="#ffffff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
              Landra
            </span>
          </Link>

          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "6px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#e2e8f0",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 500,
              transition: "all 0.15s ease"
            }}
          >
            <ArrowLeft size={15} />
            <span>Voltar ao Painel</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          maxWidth: "840px",
          margin: "0 auto",
          padding: "48px 24px 80px"
        }}
      >
        {/* Breadcrumb / Tag */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "9999px",
              background: "rgba(37, 99, 235, 0.15)",
              border: "1px solid rgba(37, 99, 235, 0.35)",
              color: "#60a5fa",
              fontSize: "0.8rem",
              fontWeight: 600
            }}
          >
            <Tag size={13} /> Tutorial Oficial • Google Tag Manager
          </span>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>• Leitura de 3 minutos</span>
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            marginBottom: "16px"
          }}
        >
          Como obter o ID do Google Tag Manager e rastrear sua landing page
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "#94a3b8",
            lineHeight: 1.6,
            marginBottom: "36px"
          }}
        >
          Aprenda o passo a passo para criar sua conta no Google Tag Manager (GTM), encontrar o seu
          identificador de contêiner (<code style={{ color: "#38bdf8", background: "rgba(56, 189, 248, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>GTM-XXXXXXX</code>)
          e capturar visualizações e cliques em botões automaticamente no Landra.
        </p>

        {/* Banner de Destaque: Sem Código */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(16, 185, 129, 0.08))",
            border: "1px solid rgba(37, 99, 235, 0.3)",
            borderRadius: "12px",
            padding: "20px 24px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "flex-start",
            gap: "16px"
          }}
        >
          <div
            style={{
              background: "#2563eb",
              borderRadius: "8px",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <ShieldCheck size={20} color="#ffffff" />
          </div>
          <div>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "1rem", color: "#ffffff", fontWeight: 700 }}>
              Você não precisa colar códigos JavaScript no Landra!
            </h4>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#cbd5e1", lineHeight: 1.5 }}>
              O Google Tag Manager frequentemente pede para você colar trechos de <code>&lt;script&gt;</code> no cabeçalho do site.
              <strong> No Landra, você não precisa fazer isso.</strong> Por motivos de segurança e velocidade,
              você só precisa copiar o seu código <strong>GTM-XXXXXXX</strong> e colar no editor. Nossa plataforma cuida de toda a injeção técnica automaticamente.
            </p>
          </div>
        </div>

        {/* Steps Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Passo 1 */}
          <section
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "28px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.95rem"
                }}
              >
                1
              </span>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                Acesse o Google Tag Manager
              </h2>
            </div>

            <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginBottom: "16px" }}>
              O Google Tag Manager é uma ferramenta gratuita do Google. Para começar, faça login com sua conta do Google (ou crie uma conta gratuita).
            </p>

            <a
              href="https://tagmanager.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "8px",
                background: "#2563eb",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 600
              }}
            >
              <span>Abrir tagmanager.google.com</span>
              <ExternalLink size={15} />
            </a>
          </section>

          {/* Passo 2 */}
          <section
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "28px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.95rem"
                }}
              >
                2
              </span>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                Crie uma Conta e um Contêiner Web
              </h2>
            </div>

            <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginBottom: "12px" }}>
              Caso ainda não tenha um contêiner criado para a sua página, clique no botão <strong>“Criar conta”</strong> no painel do Tag Manager e preencha:
            </p>

            <ul style={{ color: "#94a3b8", fontSize: "0.92rem", paddingLeft: "20px", margin: "0 0 16px 0", display: "grid", gap: "8px" }}>
              <li>
                <strong style={{ color: "#f1f5f9" }}>Nome da conta:</strong> Nome da sua empresa ou negócio (ex: <em>Minha Loja</em>).
              </li>
              <li>
                <strong style={{ color: "#f1f5f9" }}>País:</strong> Selecione Brasil.
              </li>
              <li>
                <strong style={{ color: "#f1f5f9" }}>Nome do contêiner:</strong> Nome ou endereço do seu site (ex: <em>minhaempresa.com.br</em> ou <em>Landra</em>).
              </li>
              <li>
                <strong style={{ color: "#f1f5f9" }}>Plataforma segmentada:</strong> Escolha impreterivelmente a opção <span style={{ color: "#38bdf8", fontWeight: 600 }}>Web</span>.
              </li>
            </ul>

            <p style={{ color: "#cbd5e1", fontSize: "0.92rem", margin: 0 }}>
              Clique em <strong>Criar</strong> e aceite os termos do contrato de serviço.
            </p>
          </section>

          {/* Passo 3 */}
          <section
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "28px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.95rem"
                }}
              >
                3
              </span>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                Copie o seu Container ID (GTM-XXXXXXX)
              </h2>
            </div>

            <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginBottom: "16px" }}>
              No canto superior direito da tela do Google Tag Manager (ao lado do botão azul &ldquo;Enviar&rdquo;), você verá um código no seguinte formato:
            </p>

            {/* Simulação Visual do Topo do GTM */}
            <div
              style={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "16px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Google Tag Manager</span>
                <span style={{ color: "#475569" }}>/</span>
                <span style={{ fontSize: "0.9rem", color: "#f8fafc", fontWeight: 600 }}>Minha Empresa (Web)</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    background: "rgba(37, 99, 235, 0.2)",
                    border: "1px dashed #3b82f6",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <Tag size={15} color="#60a5fa" />
                  <span style={{ fontFamily: "monospace", fontSize: "1.05rem", fontWeight: 800, color: "#93c5fd" }}>
                    GTM-N8K9Q2W
                  </span>
                </div>

                <div
                  style={{
                    background: "#2563eb",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    padding: "6px 14px",
                    borderRadius: "6px"
                  }}
                >
                  Enviar
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                background: "rgba(234, 179, 8, 0.08)",
                border: "1px solid rgba(234, 179, 8, 0.25)",
                borderRadius: "8px",
                padding: "12px 16px",
                fontSize: "0.85rem",
                color: "#fde047"
              }}
            >
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>Atenção:</strong> Se abrir uma janela modal com o título &ldquo;Instalar o Gerenciador de tags do Google&rdquo;, basta clicar em <strong>OK</strong> para fechar. Você só precisa copiar o código que começa com <code>GTM-</code>.
              </div>
            </div>
          </section>

          {/* Passo 4 */}
          <section
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "28px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.95rem"
                }}
              >
                4
              </span>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                Cole o ID no Editor do Landra
              </h2>
            </div>

            <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginBottom: "14px" }}>
              Com o código copiado, volte para o Landra:
            </p>

            <ol style={{ color: "#94a3b8", fontSize: "0.92rem", paddingLeft: "20px", margin: "0 0 16px 0", display: "grid", gap: "8px" }}>
              <li>Abra o editor da sua landing page no Landra.</li>
              <li>No painel lateral direito, role até o bloco <strong>Google Tag Manager</strong>.</li>
              <li>Cole o seu código no campo <strong>ID do Contêiner</strong> (ex: <code>GTM-N8K9Q2W</code>).</li>
              <li>
                Clique no botão superior <strong>Salvar Alterações</strong>.
              </li>
            </ol>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#4ade80",
                fontSize: "0.85rem",
                background: "rgba(74, 222, 128, 0.1)",
                border: "1px solid rgba(74, 222, 128, 0.2)",
                padding: "10px 14px",
                borderRadius: "8px"
              }}
            >
              <CheckCircle2 size={16} />
              <span>Pronto! Sua landing page agora carrega o Google Tag Manager com segurança e sem impacto na velocidade.</span>
            </div>
          </section>

          {/* Passo 5 */}
          <section
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "28px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.95rem"
                }}
              >
                5
              </span>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                Eventos que o Landra Envia Automaticamente (DataLayer)
              </h2>
            </div>

            <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginBottom: "16px" }}>
              O Landra dispara eventos estruturados diretamente para a camada de dados (<code>window.dataLayer</code>), permitindo que você crie tags no GTM para o <strong>Google Analytics 4</strong>, <strong>Meta Pixel (Facebook/Instagram)</strong> ou <strong>Google Ads</strong>:
            </p>

            <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
              <div
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px"
                }}
              >
                <div style={{ background: "rgba(56, 189, 248, 0.15)", padding: "8px", borderRadius: "6px", color: "#38bdf8" }}>
                  <Eye size={18} />
                </div>
                <div>
                  <strong style={{ color: "#f8fafc", fontSize: "0.95rem" }}>page_view</strong>
                  <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>
                    Disparado automaticamente sempre que um visitante entra ou carrega a sua landing page.
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px"
                }}
              >
                <div style={{ background: "rgba(168, 85, 247, 0.15)", padding: "8px", borderRadius: "6px", color: "#c084fc" }}>
                  <MousePointerClick size={18} />
                </div>
                <div>
                  <strong style={{ color: "#f8fafc", fontSize: "0.95rem" }}>button_click</strong>
                  <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>
                    Disparado quando o usuário clica em botões ou chamadas para ação (CTA), incluindo o identificador do componente (<code>componentId</code>) e o texto do botão.
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px"
                }}
              >
                <div style={{ background: "rgba(34, 197, 94, 0.15)", padding: "8px", borderRadius: "6px", color: "#4ade80" }}>
                  <Zap size={18} />
                </div>
                <div>
                  <strong style={{ color: "#f8fafc", fontSize: "0.95rem" }}>form_submit</strong>
                  <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>
                    Disparado quando o visitante envia dados através de formulários de contato ou captura de leads.
                  </p>
                </div>
              </div>
            </div>

            <p style={{ color: "#cbd5e1", fontSize: "0.9rem", margin: 0 }}>
              💡 <strong>Dica no Google Tag Manager:</strong> Para criar um acionador (trigger) para esses eventos, no GTM vá em <em>Acionadores → Novo → Evento Personalizado</em> e insira o nome do evento (ex: <code>button_click</code>).
            </p>
          </section>

          {/* Passo 6 */}
          <section
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "28px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.95rem"
                }}
              >
                6
              </span>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                Publique o Contêiner no Google Tag Manager
              </h2>
            </div>

            <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginBottom: "16px" }}>
              Sempre que você criar ou editar tags, acionadores ou variáveis no Tag Manager, você precisa publicar as alterações para que elas comecem a valer no seu site:
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  padding: "8px 16px",
                  borderRadius: "6px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Send size={15} />
                <span>Enviar</span>
              </div>
              <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                → Clique em <strong>Publicar</strong> na tela seguinte.
              </span>
            </div>
          </section>
        </div>

        {/* Perguntas Frequentes */}
        <div style={{ marginTop: "48px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <HelpCircle size={18} color="#60a5fa" /> Perguntas Frequentes
          </h3>

          <div style={{ display: "grid", gap: "14px" }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                padding: "16px 20px",
                borderRadius: "10px"
              }}
            >
              <strong style={{ color: "#f8fafc", fontSize: "0.95rem", display: "block", marginBottom: "4px" }}>
                O Google Tag Manager é gratuito?
              </strong>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "#94a3b8" }}>
                Sim! O Google Tag Manager é 100% gratuito e mantido pelo Google para qualquer empresa ou profissional.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                padding: "16px 20px",
                borderRadius: "10px"
              }}
            >
              <strong style={{ color: "#f8fafc", fontSize: "0.95rem", display: "block", marginBottom: "4px" }}>
                Posso remover ou trocar o ID a qualquer momento?
              </strong>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "#94a3b8" }}>
                Sim. Basta apagar ou alterar o ID no campo do editor do Landra e salvar a página. Se o campo ficar em branco, o carregamento do Tag Manager é imediatamente desativado.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé da Página de Tutorial */}
        <div
          style={{
            marginTop: "56px",
            paddingTop: "28px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
            Landra • Plataforma de Landing Pages de Alta Conversão
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <Link
              href="/dashboard"
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                background: "#2563eb",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 600
              }}
            >
              Ir para o Painel
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
