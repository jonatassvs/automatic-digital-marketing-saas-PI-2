import type { ValidationResult } from "@/renderer/validation";

type ValidationMessagesProps = {
  validation: ValidationResult;
};

// Displays validation errors when the current page JSON is not valid.
export function ValidationMessages({ validation }: ValidationMessagesProps) {
  if (validation.valid) {
    return null;
  }

  return (
    <section className="validation-box" role="alert">
      {validation.errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </section>
  );
}
