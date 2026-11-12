# Backend, persistência e segurança

## Arquitetura

```text
app/api/**/route.ts → middleware HTTP → controller → service → repository → MongoDB
```

O backend roda no Next.js com runtime Node.js. Routes exportam métodos HTTP e delegam. Middleware trata origem, limites, Bearer e erros. Controllers leem JSON/parâmetros e formatam respostas. Services implementam regras e autorização. Repositories constroem consultas explícitas. Validators verificam dados em runtime. `server/application.ts` compõe dependências.

Serviços e persistência usam `server-only`. O pool MongoDB inicia sob demanda e é reutilizado por processo, com até 10 conexões; não há conexão durante o build. Inicialização também confere índices. Uma falha de inicialização permite nova tentativa na chamada seguinte.

## Identidade e autorização

Cadastro retorna usuário, sem token. Login retorna Bearer opaco de 43 caracteres, usuário e expiração. O banco guarda SHA-256 do token; senhas usam scrypt. Não há cookies de autenticação. Logout revoga a sessão. Expiração é conferida nas consultas, independentemente da limpeza TTL.

Operações privadas usam a identidade autenticada e consultas com `owner_id`. Página inexistente ou de outra pessoa retorna `404`. Campos como `owner_id`, `userId` e `isOwner` não concedem acesso; campos desconhecidos são rejeitados.

## Coleções

| Coleção | Dados / índices principais |
| --- | --- |
| `users` | UUID, nome, email único, hash de senha e data |
| `sessions` | Hash do token, `user_id` e TTL em `expiresAt` |
| `pages` | UUID, `owner_id`, JSON, integrações e datas; slug único e índice por proprietário/data |
| `events` | Evento, página/componente, visitante anônimo opcional, timestamp e TTL |
| `rate_limits` | Contadores por categoria/identidade/janela com TTL |

Formatos existentes, UUIDs, datas BSON, `owner_id`/`user_id` e hashes scrypt compatíveis com Werkzeug são preservados. Índices não apagam dados. Respostas de páginas não incluem proprietário, datas internas ou integrações; estas têm endpoints próprios.

## Estados

`draft`, `private` e `published` são aceitos. Só `published` aparece publicamente. Publicar valida o documento; despublicar muda para `private`. Duplicar cria novo ID/slug, estado `draft`, canonical vazio e indexação desativada.

Slug é único globalmente, inclusive em rascunhos. Não há uma cópia publicada separada: editar página publicada altera imediatamente seu JSON público. `status` também é aceito na criação/atualização; publish/unpublish são ações convenientes, não a única forma de mudar estado.

Excluir página não remove contas, sessões ou eventos antigos em cascata. Eventos expiram por TTL e deixam de poder ser consultados pela API de analytics da página excluída.

## Validação e limites

O servidor valida campos permitidos, componentes, propriedades, tipos, URLs, IDs e integrações independentemente do frontend. Rejeita HTML executável, handlers, URLs perigosas, operadores MongoDB em campos escalares e campos administrativos.

Limites: 512 KiB por corpo JSON, 2 KiB por evento, 80 componentes totais, 8 níveis, 10.000 caracteres por texto, 200 segmentos rich text e 6 fontes. Revise e exporte `server/validators/component-contract.json` com `npm run contract:export`; confira com `npm run contract:check`.

Limites distribuídos por minuto: 10 POSTs de autenticação (inclui logout), 120 eventos e 300 demais chamadas. Requisições inválidas também podem consumir cota. Sem IP confiável, a identidade é compartilhada. Veja [configuração](configuracao.md).

`CORS_ORIGINS` restringe origens enviadas em chamadas privadas, autenticação e health. Rotas públicas de páginas e eventos aceitam outras origens. Requisições sem `Origin`, como as usuais do Postman, seguem para autenticação normal. CORS não é autorização nem impede clientes HTTP externos.

Erros têm status/código controlados. Falhas inesperadas não retornam stack, caminhos, URI ou segredos. As respostas da API recebem `Cache-Control: no-store` e cabeçalhos de segurança; isso não significa que todas as futuras páginas HTML já tenham política configurada.

## SEO, GTM e analytics

SEO é persistido com a página. A análise é local, sem IA: verifica comprimentos, canonical, indexação, H1, ordem de títulos e alt de imagem. Não gera metadata de landing pages no HTML atualmente.

GTM aceita `{ "gtm": { "containerId": "GTM-AB12345" } }` ou `{ "gtm": null }`. Não executa snippets nem carrega automaticamente na interface.

Eventos só são aceitos para páginas publicadas. `button_click` exige Button existente; `page_view` não aceita `componentId`. `form_submit` está reservado, mas não é utilizável sem um Form validado. Timestamp vem do servidor; eventos não guardam IP/user-agent. Visitantes únicos contam `visitorId` de visualizações, não pessoas verificadas. Eventos públicos podem ser forjados e não devem determinar cobrança.

[Referência HTTP](api.md) · [Índice](README.md)
