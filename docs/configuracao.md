# Configuração e operação

## Desenvolvimento

Use Node.js 22.13+ e npm na raiz. MongoDB pode ser local ou Atlas.

```powershell
npm ci
# Somente se ainda não houver configuração local; não sobrescreva credenciais.
Copy-Item .env.example .env.local
# Edite o arquivo antes de continuar.
npm run check-db
npm run dev
```

O projeto aceita `.env` e `.env.local` via Next.js; prefira manter uma única configuração local, pois `.env.local` prevalece sobre `.env`. Reinicie o servidor após alterar variáveis. O script de banco carrega o ambiente com `@next/env`.

## Variáveis

| Variável | Exemplo/padrão | Uso |
| --- | --- | --- |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017` | Conexão obrigatória; no Atlas inclui usuário, senha e cluster |
| `MONGODB_DATABASE` | `landing_builder_shared` | Banco selecionado explicitamente, independentemente do caminho da URI |
| `CORS_ORIGINS` | `http://localhost:3000` | Origens separadas por vírgula, sem caminho/barra final; HTTPS em produção |
| `SESSION_TTL_HOURS` | `12` | Inteiro de 1 a 168; duração das novas sessões |
| `EVENT_RETENTION_DAYS` | `90` | Inteiro de 1 a 365; retenção de novos eventos e limite de consulta |
| `TRUSTED_CLIENT_IP_HEADER` | vazio | Nome de cabeçalho confiável para limites por IP; não é um IP nem torna a API privada |

No Atlas, a URI tem o formato ilustrativo `mongodb+srv://USUARIO:SENHA@CLUSTER/?retryWrites=true&w=majority`. Use a URI fornecida pelo Atlas e codifique caracteres especiais de usuário/senha quando necessário. `MONGODB_USERNAME` e `MONGODB_PASSWORD` não são lidos separadamente pelo aplicativo. `atlas-credentials.env` é um arquivo auxiliar local; o Next.js não o carrega automaticamente.

Use um usuário de **banco**, com permissões sobre o banco escolhido, e configure o acesso de rede do Atlas para o ambiente que executa o servidor. A conexão acontece no backend. Não coloque segredos em variáveis `NEXT_PUBLIC_*`, na coleção Postman ou no Git.

`npm run check-db` conecta, cria/confere índices e executa `ping`. Pode criar coleções/índices, mas não cria usuários nem páginas de teste.

## IP e limites

Deixe `TRUSTED_CLIENT_IP_HEADER` vazio sem garantia de proxy confiável. Só configure quando o proxy sobrescrever esse cabeçalho em todas as requisições e impedir acesso direto ao servidor. O valor recebido precisa ser um único IPv4/IPv6 válido; listas não são aceitas. Ausência ou valor inválido usa o grupo compartilhado de limite.

## Comandos

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Desenvolvimento, porta padrão 3000 |
| `npm run check-db` | Conexão real e índices |
| `npm test` | Componentes, backend em MongoDB temporário e contrato |
| `npm run typecheck` | TypeScript sem emissão |
| `npm run lint` | ESLint |
| `npm run build` | Build de produção; sem conectar MongoDB durante o build |
| `npm start` | Servir o build |
| `npm run contract:export` | Atualizar snapshot após revisão dos schemas |
| `npm run contract:check` | Detectar divergência do snapshot |

Os testes de backend usam `mongodb-memory-server`, sem acessar o Atlas; o primeiro uso pode baixar um binário. A coleção Postman usa o banco do servidor escolhido: use um ambiente de desenvolvimento.

## Produção

Configure as variáveis no ambiente de implantação, mantenha segredos somente no servidor, ajuste `CORS_ORIGINS` para a origem HTTPS e permita a conexão desse ambiente ao Atlas. `.env` local não configura automaticamente a Vercel. A API usa runtime Node.js por depender de MongoDB e crypto.

A API chamada pelo navegador é acessível pela rede. A proteção dos recursos privados é autenticação e autorização. As páginas públicas em HTML ainda precisam ser implementadas; publicar pela API disponibiliza JSON.

## Diagnóstico

- Falha no `check-db`: confira credenciais de banco, URI, DNS/conectividade, acesso de rede e permissão para criar índices. O script não imprime segredos.
- `503`: confira configuração, logs protegidos e `check-db` no mesmo ambiente.
- `401`: faça login e envie o Bearer atual; ele pode ter expirado ou sido revogado.
- `403 origin_denied`: o `Origin` enviado não é permitido.
- `409`: email ou slug já utilizado, conforme o código do erro.
- `429`: aguarde a próxima janela de minuto; clientes compartilham limites por padrão.
- Configuração parece não mudar: confira `.env.local`, variáveis do processo e reinicie.

[Índice](README.md)
