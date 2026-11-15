import type { LandingPageDocument } from "@/types/page";

export const samplePage: LandingPageDocument = {
  id: "local-demo",
  name: "Pagina local de teste",
  status: "draft",
  seo: {
    title: "Consultoria Aurora para Pequenas Empresas",
    description: "Landing page inicial para testar composicao, SEO e componentes.",
    slug: "consultoria-aurora",
    robotsIndex: false,
    robotsFollow: true
  },
  components: [
    {
      id: "navbar",
      component: "Navbar",
      props: {
        logoText: "Consultoria Aurora",
        logoHref: "#",
        backgroundColor: "#ffffff",
        links: [
          { text: "Início", url: "#hero" },
          { text: "Diferenciais", url: "#benefits" },
          { text: "Contato", url: "#contato" }
        ],
        link1Text: "Início",
        link1Url: "#hero",
        link2Text: "Diferenciais",
        link2Url: "#benefits",
        link3Text: "Contato",
        link3Url: "#contato",
        link4Text: "",
        link4Url: "",
        ctaText: "Falar no WhatsApp",
        ctaUrl: "#contato",
        linkColor: "#374151",
        ctaBackgroundColor: "#16a34a",
        ctaTextColor: "#ffffff",
        sticky: true
      }
    },
    {
      id: "hero",
      component: "Section",
      props: {
        background: "#f8fbfa",
        paddingY: 76
      },
      children: [
        {
          id: "hero-container",
          component: "Container",
          props: {
            maxWidth: 1120,
            align: "left"
          },
          children: [
            {
              id: "hero-layout",
              component: "Grid",
              props: {
                columns: 2,
                gap: 32
              },
              children: [
                {
                  id: "hero-copy",
                  component: "Flex",
                  props: {
                    direction: "column",
                    gap: 16,
                    align: "flex-start"
                  },
                  children: [
                    {
                      id: "hero-title",
                      component: "Text",
                      props: {
                        type: "heading",
                        level: "h1",
                        text: "Mais clientes todos os dias para o seu negócio local",
                        color: "#12312f",
                        align: "left",
                        useDesktopFontSize: true,
                        fontSizeMobile: 34,
                        fontSizeDesktop: 46
                      }
                    },
                    {
                      id: "hero-description",
                      component: "Text",
                      props: {
                        type: "paragraph",
                        text: "Apresente seus serviços com clareza, conquiste a confiança dos visitantes e receba pedidos de orçamento direto no seu WhatsApp.",
                        color: "#52616b",
                        align: "left",
                        fontSizeMobile: 17,
                        fontSizeDesktop: 18
                      }
                    },
                    {
                      id: "hero-button",
                      component: "Button",
                      props: {
                        text: "Solicitar orçamento agora",
                        href: "#contato",
                        variant: "primary"
                      }
                    }
                  ]
                },
                {
                  id: "hero-image",
                  component: "Image",
                  props: {
                    src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1100&q=80",
                    alt: "Profissionais planejando crescimento de uma pequena empresa",
                    aspectRatio: "4 / 3",
                    borderRadius: 12
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "benefits",
      component: "Section",
      props: {
        background: "#ffffff",
        paddingY: 72
      },
      children: [
        {
          id: "benefits-container",
          component: "Container",
          props: {
            maxWidth: 1120,
            align: "center"
          },
          children: [
            {
              id: "benefits-title",
              component: "Text",
              props: {
                type: "heading",
                level: "h2",
                text: "Por que escolher nossos serviços?",
                color: "#17202a",
                align: "center",
                useDesktopFontSize: true,
                fontSizeMobile: 28,
                fontSizeDesktop: 36
              }
            },
            {
              id: "benefits-text",
              component: "Text",
              props: {
                type: "paragraph",
                text: "Combinamos qualidade, agilidade e atendimento próximo para entregar o melhor resultado para você.",
                color: "#64748b",
                align: "center",
                fontSizeMobile: 17,
                fontSizeDesktop: 18
              }
            },
            {
              id: "benefits-spacer",
              component: "Spacer",
              props: {
                height: 32
              }
            },
            {
              id: "benefits-grid",
              component: "Grid",
              props: {
                columns: 3,
                gap: 24
              },
              children: [
                {
                  id: "benefit-card-1",
                  component: "Flex",
                  props: {
                    direction: "column",
                    gap: 10,
                    align: "flex-start",
                    mobilePaddingTop: 24,
                    mobilePaddingRight: 24,
                    mobilePaddingBottom: 24,
                    mobilePaddingLeft: 24,
                    mobileBackgroundColor: "#f8fafc",
                    mobileBorderRadius: 12
                  },
                  children: [
                    {
                      id: "benefit-1-title",
                      component: "Text",
                      props: {
                        type: "heading",
                        level: "h3",
                        text: "1. Atendimento Rápido",
                        color: "#111827",
                        fontSizeMobile: 20,
                        fontSizeDesktop: 22
                      }
                    },
                    {
                      id: "benefit-1-desc",
                      component: "Text",
                      props: {
                        type: "paragraph",
                        text: "Resposta ágil pelo WhatsApp para tirar dúvidas e enviar propostas sem burocracia.",
                        color: "#4b5563",
                        fontSizeMobile: 15,
                        fontSizeDesktop: 15
                      }
                    }
                  ]
                },
                {
                  id: "benefit-card-2",
                  component: "Flex",
                  props: {
                    direction: "column",
                    gap: 10,
                    align: "flex-start",
                    mobilePaddingTop: 24,
                    mobilePaddingRight: 24,
                    mobilePaddingBottom: 24,
                    mobilePaddingLeft: 24,
                    mobileBackgroundColor: "#f8fafc",
                    mobileBorderRadius: 12
                  },
                  children: [
                    {
                      id: "benefit-2-title",
                      component: "Text",
                      props: {
                        type: "heading",
                        level: "h3",
                        text: "2. Solução Sob Medida",
                        color: "#111827",
                        fontSizeMobile: 20,
                        fontSizeDesktop: 22
                      }
                    },
                    {
                      id: "benefit-2-desc",
                      component: "Text",
                      props: {
                        type: "paragraph",
                        text: "Planejamento personalizado de acordo com a necessidade e o momento do seu negócio.",
                        color: "#4b5563",
                        fontSizeMobile: 15,
                        fontSizeDesktop: 15
                      }
                    }
                  ]
                },
                {
                  id: "benefit-card-3",
                  component: "Flex",
                  props: {
                    direction: "column",
                    gap: 10,
                    align: "flex-start",
                    mobilePaddingTop: 24,
                    mobilePaddingRight: 24,
                    mobilePaddingBottom: 24,
                    mobilePaddingLeft: 24,
                    mobileBackgroundColor: "#f8fafc",
                    mobileBorderRadius: 12
                  },
                  children: [
                    {
                      id: "benefit-3-title",
                      component: "Text",
                      props: {
                        type: "heading",
                        level: "h3",
                        text: "3. Qualidade Garantida",
                        color: "#111827",
                        fontSizeMobile: 20,
                        fontSizeDesktop: 22
                      }
                    },
                    {
                      id: "benefit-3-desc",
                      component: "Text",
                      props: {
                        type: "paragraph",
                        text: "Compromisso com prazos, transparência em cada etapa e foco em resultados reais.",
                        color: "#4b5563",
                        fontSizeMobile: 15,
                        fontSizeDesktop: 15
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "contato",
      component: "Contact",
      props: {
        background: "#f8fafc",
        paddingY: 72
      },
      children: [
        {
          id: "contact-container",
          component: "Container",
          props: {
            maxWidth: 1120,
            align: "center"
          },
          children: [
            {
              id: "contact-heading",
              component: "Text",
              props: {
                type: "heading",
                level: "h2",
                text: "Entre em contato conosco",
                color: "#111827",
                align: "center",
                useDesktopFontSize: true,
                fontSizeMobile: 28,
                fontSizeDesktop: 36
              }
            },
            {
              id: "contact-description",
              component: "Text",
              props: {
                type: "paragraph",
                text: "Preencha seus dados abaixo para iniciar uma conversa direta com nossa equipe pelo WhatsApp.",
                color: "#4b5563",
                align: "center",
                fontSizeMobile: 16,
                fontSizeDesktop: 18
              }
            },
            {
              id: "contact-spacer",
              component: "Spacer",
              props: {
                height: 28
              }
            },
            {
              id: "contact-grid",
              component: "Grid",
              props: {
                columns: 2,
                gap: 32
              },
              children: [
                {
                  id: "contact-image",
                  component: "Image",
                  props: {
                    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
                    alt: "Equipe pronta para atender pelo WhatsApp",
                    aspectRatio: "4 / 3",
                    borderRadius: 12
                  }
                },
                {
                  id: "contact-whatsapp-form",
                  component: "Form",
                  props: {
                    phoneNumber: "5511999999999",
                    title: "Fale conosco no WhatsApp",
                    subtitle: "Preencha os campos abaixo para iniciar o atendimento.",
                    introMessage: "Olá! Preenchi o formulário na página:",
                    buttonText: "Enviar pelo WhatsApp",
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                    textColor: "#111827",
                    buttonColor: "#16a34a",
                    buttonTextColor: "#ffffff",
                    borderRadius: 12,
                    padding: 24,
                    customFields: [
                      {
                        id: "field-name",
                        label: "Seu nome",
                        type: "text",
                        placeholder: "Digite seu nome completo",
                        required: true
                      },
                      {
                        id: "field-phone",
                        label: "Seu WhatsApp / Telefone",
                        type: "tel",
                        placeholder: "(11) 99999-9999",
                        required: true
                      },
                      {
                        id: "field-message",
                        label: "Como podemos ajudar?",
                        type: "textarea",
                        placeholder: "Conte brevemente o que você procura...",
                        required: false
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "footer",
      component: "Footer",
      props: {
        background: "#0f172a",
        paddingY: 56
      },
      children: [
        {
          id: "footer-container",
          component: "Container",
          props: {
            maxWidth: 1120,
            align: "left"
          },
          children: [
            {
              id: "footer-grid",
              component: "Grid",
              props: {
                columns: 3,
                gap: 32
              },
              children: [
                {
                  id: "footer-brand-col",
                  component: "Flex",
                  props: {
                    direction: "column",
                    gap: 10,
                    align: "flex-start"
                  },
                  children: [
                    {
                      id: "footer-brand-title",
                      component: "Text",
                      props: {
                        type: "heading",
                        level: "h3",
                        text: "Consultoria Aurora",
                        color: "#ffffff",
                        useDesktopFontSize: true,
                        fontSizeMobile: 22,
                        fontSizeDesktop: 24
                      }
                    },
                    {
                      id: "footer-brand-desc",
                      component: "Text",
                      props: {
                        type: "paragraph",
                        text: "Soluções pensadas para gerar resultados reais para o seu negócio.",
                        color: "#94a3b8",
                        fontSizeMobile: 15,
                        fontSizeDesktop: 15
                      }
                    }
                  ]
                },
                {
                  id: "footer-nav-col",
                  component: "Flex",
                  props: {
                    direction: "column",
                    gap: 8,
                    align: "flex-start"
                  },
                  children: [
                    {
                      id: "footer-nav-title",
                      component: "Text",
                      props: {
                        type: "heading",
                        level: "h4",
                        text: "Navegação",
                        color: "#ffffff",
                        fontSizeMobile: 17,
                        fontSizeDesktop: 18
                      }
                    },
                    {
                      id: "footer-link-1",
                      component: "Link",
                      props: {
                        text: "Início",
                        href: "#hero"
                      }
                    },
                    {
                      id: "footer-link-2",
                      component: "Link",
                      props: {
                        text: "Diferenciais",
                        href: "#benefits"
                      }
                    },
                    {
                      id: "footer-link-3",
                      component: "Link",
                      props: {
                        text: "Contato",
                        href: "#contato"
                      }
                    }
                  ]
                },
                {
                  id: "footer-contact-col",
                  component: "Flex",
                  props: {
                    direction: "column",
                    gap: 8,
                    align: "flex-start"
                  },
                  children: [
                    {
                      id: "footer-contact-title",
                      component: "Text",
                      props: {
                        type: "heading",
                        level: "h4",
                        text: "Contato",
                        color: "#ffffff",
                        fontSizeMobile: 17,
                        fontSizeDesktop: 18
                      }
                    },
                    {
                      id: "footer-contact-1",
                      component: "Text",
                      props: {
                        type: "paragraph",
                        text: "WhatsApp: (11) 99999-9999",
                        color: "#cbd5e1",
                        fontSizeMobile: 15,
                        fontSizeDesktop: 15
                      }
                    },
                    {
                      id: "footer-contact-2",
                      component: "Text",
                      props: {
                        type: "paragraph",
                        text: "E-mail: contato@consultoriaaurora.com.br",
                        color: "#cbd5e1",
                        fontSizeMobile: 15,
                        fontSizeDesktop: 15
                      }
                    },
                    {
                      id: "footer-contact-3",
                      component: "Text",
                      props: {
                        type: "paragraph",
                        text: "Atendimento: Seg a Sex, 09h às 18h",
                        color: "#cbd5e1",
                        fontSizeMobile: 15,
                        fontSizeDesktop: 15
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "footer-spacer",
              component: "Spacer",
              props: {
                height: 28
              }
            },
            {
              id: "footer-copyright",
              component: "Text",
              props: {
                type: "paragraph",
                text: "© 2026 Consultoria Aurora. Todos os direitos reservados.",
                color: "#64748b",
                align: "center",
                fontSizeMobile: 14,
                fontSizeDesktop: 14
              }
            }
          ]
        }
      ]
    }
  ]
};
