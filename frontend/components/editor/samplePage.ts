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
            maxWidth: 1080,
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
                      component: "Heading",
                      props: {
                        level: 1,
                        text: "Mais clientes para seu negocio local",
                        color: "#12312f"
                      }
                    },
                    {
                      id: "hero-description",
                      component: "Paragraph",
                      props: {
                        text: "Crie uma pagina clara, rapida e otimizada para transformar visitas em contatos reais.",
                        color: "#52616b"
                      }
                    },
                    {
                      id: "hero-button",
                      component: "Button",
                      props: {
                        text: "Montar minha pagina",
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
                    alt: "Profissionais planejando crescimento de uma pequena empresa"
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
        paddingY: 64
      },
      children: [
        {
          id: "benefits-container",
          component: "Container",
          props: {
            maxWidth: 980,
            align: "center"
          },
          children: [
            {
              id: "benefits-title",
              component: "Heading",
              props: {
                level: 2,
                text: "Tudo que uma landing page inicial precisa",
                color: "#17202a"
              }
            },
            {
              id: "benefits-text",
              component: "Paragraph",
              props: {
                text: "Estrutura por componentes, texto editavel, imagens com alt text e botoes com destinos seguros.",
                color: "#64748b"
              }
            }
          ]
        }
      ]
    }
  ]
};
