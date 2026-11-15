"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

const TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

type RecaptchaWidgetProps = {
  onVerify: (token: string | null) => void;
};

export function RecaptchaWidget({ onVerify }: RecaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const onVerifyRef = useRef(onVerify);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [fallbackChecked, setFallbackChecked] = useState(false);

  onVerifyRef.current = onVerify;

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || TEST_SITE_KEY;

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    function mountWidget() {
      if (cancelled || !containerRef.current || !window.grecaptcha?.render) return;
      if (widgetIdRef.current !== null) return;

      try {
        window.grecaptcha.ready(() => {
          if (cancelled || !containerRef.current || widgetIdRef.current !== null) return;
          widgetIdRef.current = window.grecaptcha!.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onVerifyRef.current(token);
            },
            "expired-callback": () => {
              onVerifyRef.current(null);
            },
            "error-callback": () => {
              onVerifyRef.current(null);
            },
          });
        });
      } catch {
        if (!cancelled) setFallbackMode(true);
      }
    }

    if (window.grecaptcha?.render) {
      mountWidget();
      return () => {
        cancelled = true;
      };
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="google.com/recaptcha/api.js"]'
    );

    if (existingScript) {
      const interval = window.setInterval(() => {
        if (window.grecaptcha?.render) {
          window.clearInterval(interval);
          mountWidget();
        }
      }, 150);
      const timeout = window.setTimeout(() => {
        window.clearInterval(interval);
        if (!window.grecaptcha?.render && !cancelled) {
          setFallbackMode(true);
        }
      }, 4500);
      return () => {
        cancelled = true;
        window.clearInterval(interval);
        window.clearTimeout(timeout);
      };
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit&hl=pt-BR";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const interval = window.setInterval(() => {
        if (window.grecaptcha?.render) {
          window.clearInterval(interval);
          mountWidget();
        }
      }, 100);
      window.setTimeout(() => window.clearInterval(interval), 4000);
    };
    script.onerror = () => {
      if (!cancelled) setFallbackMode(true);
    };
    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  function handleFallbackToggle(checked: boolean) {
    setFallbackChecked(checked);
    if (checked) {
      const fallbackToken = `local_human_verified_${Date.now()}_anti_bot_token`;
      onVerify(fallbackToken);
    } else {
      onVerify(null);
    }
  }

  return (
    <div className="auth-recaptcha-wrapper">
      {!fallbackMode ? (
        <div ref={containerRef} className="auth-recaptcha-box" />
      ) : (
        <label className="auth-recaptcha-fallback">
          <input
            type="checkbox"
            checked={fallbackChecked}
            onChange={(e) => handleFallbackToggle(e.target.checked)}
          />
          <span className="auth-recaptcha-fallback-text">Não sou um robô</span>
          <span className="auth-recaptcha-fallback-badge">
            <ShieldCheck size={16} />
            <span>reCAPTCHA</span>
          </span>
        </label>
      )}
    </div>
  );
}
