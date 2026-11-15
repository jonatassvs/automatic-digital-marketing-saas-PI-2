import type { Metadata } from "next";
import "./globals.scss";
import "@/components/base/responsive.scss";
import { AuthProvider } from "@/components/auth/AuthContext";

export const metadata: Metadata = {
  title: "Landra - Construtor de Landing Pages",
  description: "Landra: Editor de landing pages de alta conversão sem código."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
