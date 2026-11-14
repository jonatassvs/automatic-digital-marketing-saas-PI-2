import type { SeoGenerateInput } from "@/types/page";
import { ApiError, requireValid } from "../errors";
import { object, text } from "./common";

// Patterns commonly used in prompt injection attacks against LLMs.
const INJECTION_PATTERNS: RegExp[] = [
  /\b(?:ignore|disregard|forget|skip|override)\b[^\n.!?]{0,50}\b(?:all\s+)?(?:previous|prior|above|former|system)\b[^\n.!?]{0,50}\b(?:instructions?|prompts?|rules?|directives?|commands?)/i,
  /\b(?:you\s+are\s+now|act\s+as|pretend\s+to\s+be)\b[^\n.!?]{0,50}\b(?:unrestricted|dan|jailbreak|developer\s+mode|root|admin|evil|anarchy|bypass)/i,
  /\b(?:dan\s+mode|jailbreak|developer\s+mode)\b/i,
  /<\|(?:im_start|im_end|endoftext|system)\|>/i,
  /(?:\[INST\]|\[\/INST\]|<<SYS>>|<\/SYS>>)/i,
  /<\/?(?:system|developer|assistant|instruction|prompt|admin)>/i,
  /\b(?:show|reveal|repeat|output|print|dump|leak)\b[^\n.!?]{0,50}\b(?:system\s*(?:prompt|instructions?)|api[_\s-]?keys?|passwords?|secret|credentials)/i,
];

export class SeoValidator {
  /**
   * Scans text for malicious prompt injection patterns.
   * Throws an ApiError (422) if an injection pattern is detected.
   */
  static assertNoPromptInjection(value: string, fieldName = "conteúdo"): void {
    const normalized = value.normalize("NFKC");
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(normalized)) {
        throw new ApiError(
          `Entrada no campo '${fieldName}' rejeitada por violar regras de seguranca de IA (tentativa de injecao de prompt detectada).`,
          422,
          "prompt_injection_detected"
        );
      }
    }
  }

  /**
   * Sanitizes a single text string by neutralizing XML/HTML tags and checking for injections.
   */
  static sanitizeText(raw: unknown, max = 500, fieldName = "campo"): string {
    if (raw === undefined || raw === null) return "";
    requireValid(typeof raw === "string", "Texto invalido.");
    const trimmed = raw.trim();
    if (!trimmed) return "";
    requireValid(trimmed.length <= max, `Texto no campo '${fieldName}' muito longo.`);
    requireValid(!/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(trimmed), "Caracteres de controle nao permitidos.");

    // Check prompt injection FIRST so injection attempts trigger code 'prompt_injection_detected'
    this.assertNoPromptInjection(trimmed, fieldName);

    // Disallow executable event handlers
    requireValid(!/\bon[a-z]+\s*=/i.test(trimmed), "Atributos executaveis nao permitidos.");

    // Neutralize XML angle brackets so input cannot break out of delimitations
    return trimmed.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /**
   * Validates the input payload for SEO generation.
   */
  validateInput(value: unknown): SeoGenerateInput {
    if (!value || typeof value !== "object") {
      return {};
    }

    const allowed = [
      "businessName",
      "category",
      "location",
      "targetAudience",
      "pageContent",
      "extraNotes"
    ];

    const data = object(value, allowed);

    return {
      businessName: data.businessName !== undefined ? SeoValidator.sanitizeText(data.businessName, 120, "Nome do negócio") : undefined,
      category: data.category !== undefined ? SeoValidator.sanitizeText(data.category, 120, "Categoria") : undefined,
      location: data.location !== undefined ? SeoValidator.sanitizeText(data.location, 120, "Localização") : undefined,
      targetAudience: data.targetAudience !== undefined ? SeoValidator.sanitizeText(data.targetAudience, 160, "Público-alvo") : undefined,
      pageContent: data.pageContent !== undefined ? SeoValidator.sanitizeText(data.pageContent, 3500, "Conteúdo da página") : undefined,
      extraNotes: data.extraNotes !== undefined ? SeoValidator.sanitizeText(data.extraNotes, 500, "Notas adicionais") : undefined,
    };
  }
}
