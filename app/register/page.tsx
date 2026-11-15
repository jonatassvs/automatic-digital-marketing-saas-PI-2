"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, AlertCircle, ArrowRight, Layers } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { RecaptchaWidget } from "@/components/auth/RecaptchaWidget";
import "@/components/auth/auth.scss";

export default function RegisterPage() {
  const router = useRouter();
  const { user, register, isLoading } = useAuth();
  const [name, setName] = useState("");
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

    if (!name.trim()) {
      setError("Informe o seu nome.");
      return;
    }

    if (!email.trim()) {
      setError("Informe o seu e-mail.");
      return;
    }

    if (password.length < 12) {
      setError("Por segurança, a senha deve ter no mínimo 12 caracteres.");
      return;
    }

    if (!recaptchaToken) {
      setError("Por favor, confirme que você não é um robô (reCAPTCHA).");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password, recaptchaToken, website);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Falha ao criar conta.";
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
          <h1 className="auth-title">Criar sua conta no Landra</h1>
          <p className="auth-subtitle">Crie landing pages profissionais em minutos sem código</p>
        </div>

        {error && (
          <div className="auth-error" role="alert" style={{ marginBottom: "16px" }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="name">Seu Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Silva"
              required
            />
          </div>

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
              placeholder="Mínimo de 12 caracteres"
              autoComplete="new-password"
              minLength={12}
              required
            />
            <span className="auth-hint">A senha precisa ter pelo menos 12 caracteres.</span>
          </div>

          <div className="auth-honeypot" aria-hidden="true">
            <label htmlFor="website-register">Website</label>
            <input
              id="website-register"
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
              <span>Criando conta...</span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Criar Conta e Acessar</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Já possui uma conta?{" "}
          <Link href="/login">
            Fazer login <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}

