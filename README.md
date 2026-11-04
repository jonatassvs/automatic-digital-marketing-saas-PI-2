# Construtor de landing pages

Projeto em **Next.js + TypeScript**, com editor React, API em Route Handlers e MongoDB. As páginas são árvores JSON de componentes conhecidos, sem código executável fornecido pelo usuário.

**Estado atual:** o editor funciona em memória e ainda não chama a API. O backend oferece autenticação, persistência, publicação em JSON, SEO, analytics e configuração de GTM. O botão “Salvo localmente” ainda não salva; recarregar descarta as alterações. Publicação HTML, metadata das páginas e carregamento de GTM ainda não estão integrados.

## Executar

Requer Node.js 22.13+ e MongoDB local ou Atlas. Execute na raiz:

```powershell
npm ci
# Somente se você ainda não tiver um arquivo de ambiente:
Copy-Item .env.example .env.local
# Configure MONGODB_URI e MONGODB_DATABASE no arquivo escolhido.
npm run check-db
npm run dev
```

Interface: http://localhost:3000. API: http://localhost:3000/api. Se já utiliza `.env`, mantenha esse arquivo; `.env.local` tem precedência. Nunca versione credenciais.

## Documentação

- [Índice e estado de implementação](docs/README.md)
- [Instalação, ambiente e operação](docs/configuracao.md)
- [Frontend e editor](docs/frontend.md)
- [Backend, banco e segurança](docs/backend.md)
- [Referência da API](docs/api.md)
- [Testar com Postman](docs/postman.md)
- [Componentes e contrato JSON](docs/componentes.md)

Importe no Postman a [coleção](docs/postman/landing-builder.postman_collection.json) e o [ambiente local](docs/postman/local.postman_environment.json). O guia explica a ordem, os testes e a limpeza dos dados criados.

Verificações: `npm test`, `npm run typecheck`, `npm run lint` e `npm run build`.
