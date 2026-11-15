"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, AlertCircle, ArrowRight, Layers } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { RecaptchaWidget } from "@/components/auth/RecaptchaWidget";
import "@/components/auth/auth.scss";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!recaptchaToken) {
      setError("Por favor, confirme que você não é um robô (reCAPTCHA).");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password, recaptchaToken, website);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Falha ao realizar login.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge">
            <Layers size={24} />
          </div>
          <h1 className="auth-title">Acessar sua conta</h1>
          <p className="auth-subtitle">Entre no Landra para gerenciar e editar suas landing pages</p>
        </div>

        {error && (
          <div className="auth-error" role="alert" style={{ marginBottom: "16px" }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="auth-honeypot" aria-hidden="true">
            <label htmlFor="website-login">Website</label>
            <input
              id="website-login"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <RecaptchaWidget onVerify={setRecaptchaToken} />

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span>Entrando...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Entrar no Painel</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Não tem uma conta ainda?{" "}
          <Link href="/register">
            Cadastre-se gratuitamente <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}

