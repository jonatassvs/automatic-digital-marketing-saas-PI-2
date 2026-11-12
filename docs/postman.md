# Testar a API com Postman

Sim: a API pode ser testada diretamente sem integrar o frontend. Nenhuma credencial do MongoDB vai para o Postman; somente a URL HTTP e a sessão da aplicação.

## Importação e execução

1. Configure o banco de desenvolvimento e execute `npm run dev` na raiz.
2. No Postman, use **Import** para abrir [a coleção v2.1](postman/landing-builder.postman_collection.json) e [o ambiente local](postman/local.postman_environment.json).
3. Selecione o ambiente **Landing Builder — local**. `baseUrl` deve ser `http://localhost:3000`, sem `/api` e sem barra final; ajuste a porta se necessário.
4. Abra a coleção no **Runner**, selecione todas as pastas, mantenha a ordem e use **uma iteração**.
5. Execute e confira os testes de cada resposta. Testes negativos esperam 401, 404, 409 ou 422; esses status significam sucesso nesses casos.

Pode usar Send manualmente, seguindo a mesma ordem. O primeiro request de health prepara variáveis da execução. Rode-o antes do cadastro. Não crie variáveis de ambiente com nomes reservados abaixo: elas podem sobrepor as variáveis da coleção.

## O que a coleção faz

- Gera emails, senha sintética e slug únicos por execução; cadastra duas contas e faz login.
- Captura `accessToken`, `otherAccessToken`, `pageId` e `duplicatePageId` automaticamente.
- Cria, lista, lê, atualiza e consulta preview; verifica que draft não é público.
- Verifica que a segunda conta não pode ler, editar, excluir, publicar, duplicar, despublicar, ver preview, SEO, integrações ou analytics da primeira.
- Verifica rejeição de campos administrativos, componentes desconhecidos, URL perigosa e GTM inválido.
- Configura SEO/GTM, publica, consulta JSON público, envia visualização/clique e confere agregados.
- Despublica, verifica a retirada pública, remove páginas criadas e revoga as duas sessões.
- Confirma que o token revogado falha e limpa as variáveis sensíveis da coleção.

As requisições têm descrições, corpos de exemplo e scripts de teste. A autenticação Bearer é herdada da coleção; requests públicos usam No Auth e testes da outra conta usam seu token específico.

## Variáveis

| Variável | Origem / finalidade |
| --- | --- |
| `baseUrl` | Ambiente; endereço do servidor |
| `runId` | Gerado ao executar health |
| `email`, `otherEmail`, `password` | Credenciais sintéticas geradas; não use contas reais |
| `accessToken`, `otherAccessToken` | Preenchidos pelo login |
| `pageId`, `duplicatePageId` | IDs capturados de respostas |
| `slug`, `visitorId` | Valores únicos para publicação e analytics |

Não há senhas reais, tokens preenchidos ou URI do Atlas nos arquivos versionados. Não exporte resultados com segredos nem compartilhe tokens da execução.

## Efeitos no banco e limpeza

**A coleção grava no banco configurado no backend.** Execute em desenvolvimento. Ela cria duas contas, uma página, uma cópia, duas sessões e eventos. Ao concluir, exclui as duas páginas e revoga as sessões. As contas permanecem, pois não existe endpoint de exclusão de usuário. Eventos permanecem até TTL; contadores também expiram. Se precisar eliminar tudo, use um banco dedicado de testes e faça a limpeza administrativa desse banco após conferir seu nome.

Se interromper o Runner, as etapas finais não serão executadas. Use os IDs e tokens ainda presentes nas variáveis para executar a pasta de limpeza antes de iniciar de novo. Reiniciar health gera novas variáveis e perde as referências da execução anterior.

Uma execução completa usa 6 POSTs de autenticação (2 cadastros, 2 logins, 2 logouts), abaixo da cota de 10/minuto. Aguarde pelo menos um minuto entre execuções completas para evitar 429, especialmente quando o IP é compartilhado com outros clientes. Não configure múltiplas iterações sem considerar essa cota.

## Problemas frequentes

- Conexão recusada: o Next.js não está rodando, ou `baseUrl` tem porta errada.
- Postman no navegador: use um agente que consiga alcançar seu localhost, como o Desktop Agent, ou o aplicativo desktop.
- 401 inesperado: execute login, confira variáveis sobrepostas e a aba Authorization.
- 404 inesperado: verifique o `pageId`, o proprietário e se a página foi publicada antes da consulta pública.
- 409 no cadastro: você repetiu o request sem gerar novos emails; comece uma nova execução após limpar a anterior.
- 429: aguarde e repita a etapa; não desative limites do backend para executar testes.
- 503: rode `npm run check-db` e confira o ambiente do servidor.

A coleção não faz testes de carga, nem esgota rate limits, nem substitui os testes automatizados de profundidade, tamanho e segurança do repositório. Leia a [referência da API](api.md) e o [estado do frontend](frontend.md).

[Índice](README.md)
