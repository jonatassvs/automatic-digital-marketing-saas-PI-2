"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers, ArrowRight, ShieldCheck, Zap, Palette } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import "@/components/auth/auth.scss";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="auth-page">
        <p style={{ color: "#64748b" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Layers size={20} color="#ffffff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
            Landing Builder
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/login"
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              color: "#e2e8f0",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 500
            }}
          >
            Entrar
          </Link>
          <Link
            href="/register"
            style={{
              padding: "8px 18px",
              borderRadius: "6px",
              background: "#2563eb",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
            }}
          >
            Criar Conta
          </Link>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "60px 24px",
          maxWidth: "860px",
          margin: "0 auto"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "9999px",
            background: "rgba(37, 99, 235, 0.15)",
            border: "1px solid rgba(37, 99, 235, 0.4)",
            color: "#60a5fa",
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: "24px"
          }}
        >
          <Zap size={14} /> Conectado ao MongoDB & Next.js
        </div>

        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBottom: "20px"
          }}
        >
          Crie landing pages de alta conversão <br />
          <span
            style={{
              background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            sem escrever uma linha de código
          </span>
        </h1>

        <p
          style={{
            fontSize: "1.15rem",
            color: "#94a3b8",
            lineHeight: 1.6,
            maxWidth: "640px",
            marginBottom: "36px"
          }}
        >
          Editor visual declarativo em blocos, otimizado para SEO, rápido e totalmente integrado ao
          seu banco de dados MongoDB.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              borderRadius: "10px",
              background: "#2563eb",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "1.05rem",
              fontWeight: 700,
              boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.5)"
            }}
          >
            Começar Gratuitamente <ArrowRight size={18} />
          </Link>
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 24px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#f8fafc",
              textDecoration: "none",
              fontSize: "1.05rem",
              fontWeight: 600
            }}
          >
            Acessar Painel
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px",
            marginTop: "64px",
            width: "100%",
            textAlign: "left"
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "20px",
              borderRadius: "12px"
            }}
          >
            <Palette size={24} color="#60a5fa" style={{ marginBottom: "12px" }} />
            <h3 style={{ fontSize: "1rem", margin: "0 0 6px" }}>Editor Visual Intuitivo</h3>
            <p style={{ fontSize: "0.86rem", color: "#94a3b8", margin: 0 }}>
              Adicione seções, títulos, botões e imagens com preview instantâneo.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "20px",
              borderRadius: "12px"
            }}
          >
            <ShieldCheck size={24} color="#34d399" style={{ marginBottom: "12px" }} />
            <h3 style={{ fontSize: "1rem", margin: "0 0 6px" }}>Seguro e Confiável</h3>
            <p style={{ fontSize: "0.86rem", color: "#94a3b8", margin: 0 }}>
              Arquitetura declarativa com sanitização rigorosa contra injeções.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "20px",
              borderRadius: "12px"
            }}
          >
            <Zap size={24} color="#fbbf24" style={{ marginBottom: "12px" }} />
            <h3 style={{ fontSize: "1rem", margin: "0 0 6px" }}>SEO Nativo</h3>
            <p style={{ fontSize: "0.86rem", color: "#94a3b8", margin: 0 }}>
              Meta tags, Open Graph e slugs customizados para aparecer no Google.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
