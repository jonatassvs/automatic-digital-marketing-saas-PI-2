"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { responsiveStyle, type ResponsiveProps } from "@/components/base/responsiveStyle";
import { defaultWhatsappFormFields, type WhatsappFormField } from "./schema";

export type FormBlockProps = ResponsiveProps & {
  id?: string;
  fontFamily?: string;
  phoneNumber?: string;
  title?: string;
  subtitle?: string;
  introMessage?: string;
  customFields?: WhatsappFormField[];
  buttonText?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  borderRadius?: number;
  padding?: number;
};

export function sanitizeWhatsappPhone(phoneNumber = ""): string {
  return String(phoneNumber).replace(/\D/g, "");
}

export function buildWhatsappUrl(
  phoneNumber: string,
  introMessage: string,
  fields: WhatsappFormField[],
  values: Record<number, string>
): string {
  const cleanPhone = sanitizeWhatsappPhone(phoneNumber);
  const lines: string[] = [];

  if (introMessage && introMessage.trim()) {
    lines.push(introMessage.trim());
    lines.push("");
  }

  fields.forEach((field, index) => {
    const rawValue = (values[index] ?? "").trim();
    if (rawValue) {
      lines.push(`*${field.label.trim() || `Campo ${index + 1}`}:* ${rawValue}`);
    }
  });

  const message = lines.join("\n").trim();
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}${encodedText ? `?text=${encodedText}` : ""}`;
}

export function FormBlock({
  id,
  fontFamily,
  phoneNumber = "5511999999999",
  title = "Fale conosco no WhatsApp",
  subtitle = "Preencha os campos abaixo para iniciar o atendimento.",
  introMessage = "Olá! Preenchi o formulário na página:",
  customFields,
  buttonText = "Enviar pelo WhatsApp",
  backgroundColor = "#ffffff",
  borderColor = "#e5e7eb",
  textColor = "#111827",
  buttonColor = "#16a34a",
  buttonTextColor = "#ffffff",
  borderRadius = 12,
  padding = 24,
  responsiveProps
}: FormBlockProps) {
  const [values, setValues] = useState<Record<number, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeFields: WhatsappFormField[] =
    Array.isArray(customFields) && customFields.length > 0 ? customFields : defaultWhatsappFormFields;

  const baseStyle: CSSProperties = {
    backgroundColor: backgroundColor || "#ffffff",
    borderColor: borderColor || "#e5e7eb",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: `${Math.max(0, Number(borderRadius) || 0)}px`,
    padding: `${Math.max(0, Number(padding) || 0)}px`,
    color: textColor || "#111827",
    fontFamily,
    width: "100%",
    boxSizing: "border-box"
  };

  const computedStyle = responsiveStyle(baseStyle, responsiveProps);

  function handleChange(index: number, nextValue: string) {
    setValues((current) => ({ ...current, [index]: nextValue }));
    if (errorMessage) {
      setErrorMessage(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Prevent redirecting while inside the editor canvas
    if (event.currentTarget.closest("[data-editor-component-id]")) {
      return;
    }

    for (let i = 0; i < activeFields.length; i++) {
      const field = activeFields[i];
      const val = (values[i] ?? "").trim();
      if (field.required && !val) {
        setErrorMessage(`Por favor, preencha o campo obrigatório: "${field.label}".`);
        return;
      }
    }

    const cleanPhone = sanitizeWhatsappPhone(phoneNumber);
    if (!cleanPhone) {
      setErrorMessage("Número de WhatsApp de destino não configurado.");
      return;
    }

    setErrorMessage(null);
    const whatsappUrl = buildWhatsappUrl(phoneNumber, introMessage, activeFields, values);
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <form
      className="base-whatsapp-form responsive-component"
      id={id}
      style={computedStyle}
      onSubmit={handleSubmit}
      noValidate
    >
      {(title?.trim() || subtitle?.trim()) && (
        <div className="whatsapp-form-header">
          {title?.trim() ? (
            <h3 className="whatsapp-form-title" style={{ color: textColor }}>
              {title}
            </h3>
          ) : null}
          {subtitle?.trim() ? (
            <p className="whatsapp-form-subtitle" style={{ color: textColor }}>
              {subtitle}
            </p>
          ) : null}
        </div>
      )}

      <div className="whatsapp-form-fields">
        {activeFields.map((field, idx) => {
          const inputId = `${id ?? "wa-form"}-field-${idx}`;
          const isRequired = Boolean(field.required);
          const fieldLabel = field.label?.trim() || `Campo ${idx + 1}`;
          const fieldType = field.type || "text";

          return (
            <div className="whatsapp-form-field" key={field.id ?? idx}>
              <label className="whatsapp-form-label" htmlFor={inputId} style={{ color: textColor }}>
                <span>
                  {fieldLabel}
                  {isRequired ? (
                    <span className="whatsapp-form-required-mark" aria-hidden="true">
                      {" "}
                      *
                    </span>
                  ) : null}
                </span>
                <span
                  className={`whatsapp-form-badge ${
                    isRequired ? "whatsapp-form-badge-required" : "whatsapp-form-badge-optional"
                  }`}
                >
                  {isRequired ? "Obrigatório" : "Opcional"}
                </span>
              </label>

              {fieldType === "textarea" ? (
                <textarea
                  id={inputId}
                  className="whatsapp-form-input whatsapp-form-textarea"
                  placeholder={field.placeholder ?? ""}
                  required={isRequired}
                  aria-required={isRequired}
                  rows={3}
                  value={values[idx] ?? ""}
                  onChange={(e) => handleChange(idx, e.target.value)}
                />
              ) : (
                <input
                  id={inputId}
                  className="whatsapp-form-input"
                  type={fieldType}
                  placeholder={field.placeholder ?? ""}
                  required={isRequired}
                  aria-required={isRequired}
                  value={values[idx] ?? ""}
                  onChange={(e) => handleChange(idx, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>

      {errorMessage ? (
        <div className="whatsapp-form-error" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        className="whatsapp-form-submit"
        style={{
          backgroundColor: buttonColor || "#16a34a",
          color: buttonTextColor || "#ffffff"
        }}
      >
        <MessageCircle size={18} aria-hidden="true" />
        <span>{buttonText || "Enviar pelo WhatsApp"}</span>
      </button>
    </form>
  );
}
