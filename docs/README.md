# Documentação

Este diretório descreve o código atual. O objetivo do produto é permitir criar, personalizar, otimizar, publicar e medir landing pages sem programação.

| Documento | Conteúdo |
| --- | --- |
| [Configuração](configuracao.md) | Requisitos, variáveis, MongoDB, execução e diagnóstico |
| [Frontend](frontend.md) | Editor, estado, renderer e integração pendente |
| [Backend](backend.md) | Camadas, autenticação, persistência e segurança |
| [API](api.md) | Endpoints, corpos, respostas, limites e erros |
| [Postman](postman.md) | Importação, execução, testes e limpeza |
| [Componentes](componentes.md) | Contrato, schemas, estilos, fontes e extensão |

## Estado de implementação

| Área | Implementado | Pendente |
| --- | --- | --- |
| Editor | Árvore, propriedades, estilos, validação e canvas | Carregar/salvar pela API; persistência local real |
| Autenticação | Cadastro, login, Bearer e logout na API | Telas e sessão no frontend |
| Páginas | CRUD, duplicação, preview JSON e estados | Dashboard e preview privado como tela |
| Publicação | JSON publicado por slug | HTML público, metadata dinâmica, sitemap e robots |
| SEO | Configuração e análise determinística | Interface integrada e sugestões por IA |
| Analytics | Ingestão e agregação no backend | Tracking no navegador e dashboard |
| GTM | Validação e armazenamento do ID | Carregamento, dataLayer e consentimento |

Frontend e backend estão no mesmo projeto Next.js, mas ainda não estão ligados funcionalmente. Não é necessário Flask, Python ou processos frontend/backend separados.

[Voltar ao resumo](../README.md)
