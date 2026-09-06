import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Landing Page Builder",
  description: "Editor inicial para montar landing pages por JSON declarativo."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
