# Referência da API

Base local: `http://localhost:3000/api`. Corpos são JSON com `Content-Type: application/json`. Rotas privadas exigem `Authorization: Bearer TOKEN`. Cadastro não autentica automaticamente: faça login depois.

Sucesso com conteúdo: `{ "data": ... }`. Erro controlado: `{ "error": { "code": "validation_error", "message": "..." } }`. Respostas `202` e `204` abaixo não têm corpo. As rotas também oferecem `OPTIONS` (200); método não exportado é tratado pelo Next.js como 405.

## Endpoints

`pageId` é o UUID retornado na criação; `slug` fica em `seo.slug`. “Privado” significa autenticado e, para páginas, proprietário.

| Método | Caminho | Acesso | Sucesso / resultado |
| --- | --- | --- | --- |
| GET | `/health` | Público | 200, `{status:"ok"}` após ping MongoDB |
| POST | `/auth/register` | Público | 201, usuário `{id,name,email}` |
| POST | `/auth/login` | Público | 200, sessão descrita abaixo |
| GET | `/auth/me` | Privado | 200, usuário |
| POST | `/auth/logout` | Privado | 204, revoga token atual |
| GET | `/pages` | Privado | 200, array de páginas do usuário |
| POST | `/pages` | Privado | 201, página criada |
| GET | `/pages/:pageId` | Privado | 200, página |
| PUT | `/pages/:pageId` | Privado | 200, página atualizada |
| DELETE | `/pages/:pageId` | Privado | 204 |
| GET | `/pages/:pageId/preview` | Privado | 200, JSON da página, não HTML |
| POST | `/pages/:pageId/publish` | Privado | 200, página com estado published |
| POST | `/pages/:pageId/unpublish` | Privado | 200, página com estado private |
| POST | `/pages/:pageId/duplicate` | Privado | 201, nova página draft |
| PUT | `/pages/:pageId/seo` | Privado | 200, página com SEO substituído |
| GET | `/pages/:pageId/seo/check` | Privado | 200, `{issues,issueCount}` |
| GET | `/pages/:pageId/integrations` | Privado | 200, `{gtm:null}` ou configuração |
| PUT | `/pages/:pageId/integrations` | Privado | 200, configuração atualizada |
| GET | `/public/pages/:slug` | Público | 200, JSON apenas se publicada |
| GET | `/public/pages/:slug/integrations` | Público | 200, GTM apenas se publicada |
| POST | `/events` | Público | 202, evento aceito |
| GET | `/analytics/pages/:pageId` | Privado | 200, agregação |

### Consultas

- `GET /pages?limit=20&offset=0`: limit de 1 a 100, offset de 0 a 10000; resposta é array, sem total nem envelope de paginação adicional.
- `GET /analytics/pages/:pageId?days=30`: days inteiro de 1 a `EVENT_RETENTION_DAYS`; padrão é o menor entre 30 e a retenção. O período começa no instante atual menos days, não no início do dia.

## Autenticação

Cadastro:

```json
{"name":"Conta de teste","email":"teste@example.com","password":"Senha-apenas-de-teste-123!"}
```

Login usa somente `email` e `password`. Nome tem até 100 caracteres; email até 254, normalizado para minúsculas; senha de 12 a 128 caracteres. Campos extras são rejeitados.

Resposta de login:

```json
{
  "data": {
    "accessToken": "TOKEN_OPACO",
    "tokenType": "Bearer",
    "expiresAt": "2026-10-04T18:00:00.000Z",
    "user": {"id":"UUID","name":"Conta de teste","email":"teste@example.com"}
  }
}
```

Me e logout não recebem corpo. Após logout, usar o token revogado retorna 401.

## Criar e atualizar páginas

Exemplo aceito por `POST /pages` e `PUT /pages/:pageId`:

```json
{
  "name": "Página de teste",
  "status": "draft",
  "seo": {
    "title": "Serviços locais para seu negócio",
    "description": "Conheça nossos serviços e fale com nossa equipe para receber uma proposta personalizada para seu negócio.",
    "slug": "pagina-de-teste",
    "robotsIndex": false,
    "robotsFollow": true
  },
  "components": [
    {"id":"hero-title","component":"Text","props":{"type":"heading","level":"h1","text":"Meu negócio"},"children":[]},
    {"id":"contact-button","component":"Button","props":{"text":"Fale conosco","href":"https://example.com/contato"},"children":[]}
  ],
  "design": {"mobileMaxWidth":720,"fonts":[],"defaultFont":"system"}
}
```

`name`, `seo` e `components` são obrigatórios. Nome: 1–150 caracteres e não vazio após trim. `status` padrão é `draft`; `design` omitido recebe o padrão acima. `id` opcional é ignorado na criação (o servidor gera UUID); em atualização, se fornecido, precisa coincidir com o caminho. Não envie `owner_id`, datas ou integrações nesse corpo.

PUT substitui os campos editáveis da página; não é PATCH. Envie novamente nome, SEO e componentes. Omitir status volta para draft e omitir design aplica o padrão. Integrações são alteradas no endpoint próprio. Resposta inclui `id`, `name`, `status`, `seo`, `components` e design quando presente.

Publish, unpublish e duplicate não precisam de corpo. Duplicação gera slug novo; o original fica intacto. Slug é globalmente único mesmo para draft. Publicação não cria URL HTML e não exige ausência de avisos no SEO checker.

## SEO

`PUT /pages/:pageId/seo` recebe o objeto SEO completo diretamente, sem envolver em `seo`. Obrigatórios: `title`, `description`, `slug`, `robotsIndex`, `robotsFollow`. Título até 200 caracteres, descrição até 500 e slug até 100, com letras minúsculas ASCII, números e hífens entre grupos.

Opcionais: `canonicalUrl`, `ogTitle` (200), `ogDescription` (500), `ogImage`. URLs não vazias devem ser HTTP(S) absolutas. Os dois robots são booleanos. Campos opcionais omitidos deixam de fazer parte do SEO substituído.

`GET /pages/:pageId/seo/check` retorna issues com `code`, `message` e `componentId` opcional. Códigos atuais: `title_length`, `description_length`, `canonical_missing`, `index_disabled`, `heading_order`, `image_alt`, `primary_heading`. São sugestões locais, sem chamada de IA.

## Integrações

```json
{"gtm":{"containerId":"GTM-AB12345"}}
```

O container segue `GTM-` com 4–20 letras maiúsculas/números. Remova com `{"gtm":null}`. Não envie snippets, HTML ou scripts. A resposta tem o mesmo formato dentro de `data`.

## Eventos e analytics

Visualização:

```json
{"type":"page_view","pageId":"UUID","visitorId":"visitante-anonimo-123"}
```

Clique:

```json
{"type":"button_click","pageId":"UUID","componentId":"contact-button","visitorId":"visitante-anonimo-123"}
```

Página deve estar publicada. `visitorId` é opcional, 16–64 letras ASCII/números/underscore/hífen. Não use email ou dados pessoais. `page_view` rejeita `componentId`; clique exige Button real da árvore. Não envie `timestamp`, pois o servidor o define. `form_submit` falha por enquanto: Form não existe no contrato validado.

Exemplo de agregação após uma visualização e um clique:

```json
{"data":{"days":1,"pageViews":1,"uniqueVisitors":1,"buttonClicks":1,"formSubmissions":0,"formSubmissionsPerView":0}}
```

`formSubmissionsPerView` é razão, não porcentagem, arredondada em 4 casas; zero sem visualizações. Unique visitors considera somente visitorIds presentes em page_view.

## Erros e limites

| Status | Códigos comuns | Significado |
| --- | --- | --- |
| 400 | `invalid_json` | JSON malformado |
| 401 | `unauthorized`, `invalid_credentials` | Sem sessão válida ou login incorreto |
| 403 | `origin_denied` | Origin não permitido |
| 404 | `not_found` | Página inexistente, alheia ou não publicada na rota pública |
| 409 | `email_unavailable`, `slug_unavailable` | Conflito de unicidade |
| 413 | `payload_too_large` | Corpo acima do limite |
| 415 | `unsupported_media_type` | Content-Type não é application/json |
| 422 | `validation_error` | Campo, propriedade, consulta ou valor inválido |
| 429 | `rate_limited` | Cota esgotada; resposta inclui Retry-After: 60 |
| 500 / 503 | `internal_error` | Falha interna / banco ou aplicação indisponível |

Limites e autorização são executados antes de várias validações; uma chamada pode retornar 401/429 antes de avaliar seu JSON. Consulte [backend](backend.md) para limites de árvore, corpo, retenção e requisições. Veja [Postman](postman.md) para exemplos executáveis de todas as operações.

[Índice](README.md)
