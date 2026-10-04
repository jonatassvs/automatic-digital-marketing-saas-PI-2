import type { ReactNode } from "react";

type IconBadgeProps = {
  children: ReactNode;
};

// Displays a small reusable icon container used across application chrome.
export function IconBadge({ children }: IconBadgeProps) {
  return (
    <span className="icon-box" aria-hidden="true">
      {children}
    </span>
  );
}
