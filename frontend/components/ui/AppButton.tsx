import type { ButtonHTMLAttributes, ReactNode } from "react";

type AppButtonVariant = "primary" | "secondary" | "danger" | "icon";

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: AppButtonVariant;
};

const variantClassNames: Record<AppButtonVariant, string> = {
  primary: "primary-action",
  secondary: "secondary-action",
  danger: "danger-action",
  icon: "icon-action"
};

// Renders a shared application button with the correct visual variant.
export function AppButton({
  children,
  className,
  variant = "secondary",
  type = "button",
  ...props
}: AppButtonProps) {
  const classNames = [variantClassNames[variant], className].filter(Boolean).join(" ");

  return (
    <button className={classNames} type={type} {...props}>
      {children}
    </button>
  );
}
