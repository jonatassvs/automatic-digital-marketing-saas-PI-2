"use client";

import { useState, type ReactNode, type CSSProperties } from "react";
import { Menu, X } from "lucide-react";
import { responsiveStyle, type ResponsiveProps } from "@/components/base/responsiveStyle";

type NavbarBlockProps = ResponsiveProps & {
  id?: string;
  fontFamily?: string;
  logoText?: string;
  logoImage?: string;
  logoAlt?: string;
  logoHref?: string;
  logoWidth?: number;
  link1Text?: string;
  link1Url?: string;
  link2Text?: string;
  link2Url?: string;
  link3Text?: string;
  link3Url?: string;
  link4Text?: string;
  link4Url?: string;
  link5Text?: string;
  link5Url?: string;
  link6Text?: string;
  link6Url?: string;
  ctaText?: string;
  ctaUrl?: string;
  linkColor?: string;
  ctaBackgroundColor?: string;
  ctaTextColor?: string;
  sticky?: boolean;
  children?: ReactNode;
};

export function NavbarBlock({
  id,
  fontFamily,
  logoText = "Minha Marca",
  logoImage = "",
  logoAlt = "Logo",
  logoHref = "#",
  logoWidth = 140,
  link1Text = "Início",
  link1Url = "#",
  link2Text = "Serviços",
  link2Url = "#servicos",
  link3Text = "Sobre",
  link3Url = "#sobre",
  link4Text = "Contato",
  link4Url = "#contato",
  link5Text = "",
  link5Url = "",
  link6Text = "",
  link6Url = "",
  ctaText = "",
  ctaUrl = "",
  linkColor = "#374151",
  ctaBackgroundColor = "#2563eb",
  ctaTextColor = "#ffffff",
  sticky = false,
  responsiveProps,
  children
}: NavbarBlockProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { text: link1Text, url: link1Url },
    { text: link2Text, url: link2Url },
    { text: link3Text, url: link3Url },
    { text: link4Text, url: link4Url },
    { text: link5Text, url: link5Url },
    { text: link6Text, url: link6Url }
  ].filter((item) => Boolean(item.text && item.text.trim()));

  const baseStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    color: "#1f2937",
    fontFamily,
    position: sticky ? "sticky" : "relative",
    top: sticky ? 0 : undefined,
    zIndex: sticky ? 100 : undefined,
    width: "100%",
    boxSizing: "border-box"
  };

  const computedStyle = responsiveStyle(baseStyle, responsiveProps);

  return (
    <header className="base-navbar responsive-component" id={id} style={computedStyle}>
      <div className="navbar-container">
        {/* Brand / Logo on the left */}
        <div className="navbar-brand">
          <a href={logoHref || "#"} className="navbar-logo-link">
            {logoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoImage}
                alt={logoAlt || logoText}
                className="navbar-logo-img"
                style={{ maxWidth: logoWidth, maxHeight: 52 }}
              />
            ) : (
              <span className="navbar-logo-text">{logoText}</span>
            )}
          </a>
        </div>

        {/* Desktop Navigation Links on the right */}
        <nav className="navbar-nav desktop-only" aria-label="Navegação principal">
          <ul className="navbar-links">
            {links.map((link, idx) => (
              <li key={idx}>
                <a href={link.url || "#"} className="navbar-link" style={{ color: linkColor }}>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
          {children}
          {ctaText && ctaText.trim() && (
            <a
              href={ctaUrl || "#"}
              className="navbar-cta-btn"
              style={{ backgroundColor: ctaBackgroundColor, color: ctaTextColor }}
            >
              {ctaText}
            </a>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="navbar-toggle mobile-only"
          aria-label={isMobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ color: linkColor }}
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Sandwich Drawer */}
      {isMobileMenuOpen && (
        <nav className="navbar-mobile-drawer mobile-only" aria-label="Menu móvel">
          <ul className="navbar-mobile-links">
            {links.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.url || "#"}
                  className="navbar-mobile-link"
                  style={{ color: linkColor }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
          {children && <div className="navbar-mobile-children">{children}</div>}
          {ctaText && ctaText.trim() && (
            <a
              href={ctaUrl || "#"}
              className="navbar-cta-btn mobile-cta"
              style={{ backgroundColor: ctaBackgroundColor, color: ctaTextColor }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {ctaText}
            </a>
          )}
        </nav>
      )}
    </header>
  );
}

