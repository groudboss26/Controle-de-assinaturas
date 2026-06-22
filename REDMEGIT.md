# Controle de Assinaturas

Microservico para gerenciamento de assinaturas, desenvolvido com backend em Node.js e TypeScript, banco de dados SQLite nativo e frontend responsivo em HTML, JavaScript e Bootstrap.

O objetivo do projeto e permitir o cadastro, acompanhamento e controle financeiro de assinaturas recorrentes, exibindo custos mensais, custos anuais, status de vencimento e acoes rapidas como renovar ou cancelar uma assinatura.

## Tecnologias Utilizadas

- Node.js 22+
- TypeScript
- Express.js
- SQLite nativo com `node:sqlite`
- HTML5
- JavaScript Vanilla
- Bootstrap via CDN
- Helmet
- Express Rate Limit

## Padrao Arquitetonico

O backend segue o padrao MVC, separando responsabilidades em camadas bem definidas:

- Model: responsavel pelo acesso ao banco de dados SQLite e pelas consultas SQL.
- Controller: responsavel por receber requisicoes, validar dados e coordenar as respostas da API.
- Routes: responsavel por mapear os endpoints HTTP para os controllers.
- View/Frontend: interface web criada com HTML5, Bootstrap e JavaScript puro.

Estrutura principal:

```txt
src/
  app.ts
  server.ts
  config/
    database.ts
  controllers/
    SubscriptionController.ts
  models/
    Subscription.ts
  routes/
    subscriptionRoutes.ts

public/
  index.html
  app.js
  styles.css
```

## Funcionalidades

- Cadastro de assinaturas.
- Listagem das assinaturas cadastradas.
- Edicao de assinaturas.
- Cancelamento de assinaturas.
- Renovacao rapida conforme o periodo cadastrado.
- Calculo automatico da parte do usuario quando a assinatura nao e compartilhada.
- Dashboard financeiro com:
  - total de assinaturas;
  - assinaturas compartilhadas;
  - custo mensal;
  - custo anual.
- Status visual de vencimento:
  - `Vencido`;
  - `Proximo`;
  - `Em dia`.
- Alertas para assinaturas vencidas ou proximas do vencimento.
- Grafico de barras comparando custo mensal e anual por assinatura.
- Tooltip no grafico mostrando os valores representados por cada barra.

## Seguranca

O projeto aplica boas praticas basicas de seguranca:

- Uso de prepared statements no Model para prevenir SQL Injection.
- Middleware `helmet` para protecao de cabecalhos HTTP.
- Middleware `express-rate-limit` para limitar requisicoes por IP.
- Validacao de entrada nos controllers.
- Bloqueio de strings vazias.
- Validacao de preco positivo.
- Validacao de data no formato `YYYY-MM-DD`.
- Limite de tamanho para payload JSON.

## Banco de Dados

O banco utilizado e SQLite atraves do modulo nativo `node:sqlite`.

O arquivo local gerado e:

```txt
assinaturas.db
```

Tabela principal:

```txt
subscriptions
```

Campos:

- `id`
- `name`
- `price`
- `due_date`
- `period`
- `shared`
- `my_share`

## Endpoints da API

```txt
POST /subscriptions
GET /subscriptions
GET /subscriptions/summary
PUT /subscriptions/:id
DELETE /subscriptions/:id
```

## Como Executar o Projeto

Antes de executar o projeto, e obrigatorio baixar os modulos necessarios para que tudo funcione corretamente.

Instale as dependencias com:

```bash
npm install
```

Esse comando cria a pasta `node_modules` e baixa todas as bibliotecas usadas pelo projeto, incluindo Express, Helmet, Express Rate Limit, TypeScript e TSX. Sem essa etapa, os comandos de desenvolvimento, build e start podem falhar.

Execute em modo desenvolvimento:

```bash
npm run dev
```

Ou compile o TypeScript:

```bash
npm run build
```

E execute a versao compilada:

```bash
npm start
```

Depois acesse:

```txt
http://localhost:3000
```

## Scripts Disponiveis

```txt
npm run dev
```

Inicia o servidor em modo desenvolvimento.

```txt
npm run build
```

Compila o projeto TypeScript para a pasta `dist`.

```txt
npm start
```

Executa a aplicacao compilada.

## Versao

Versao atual:

```txt
1.1.0
```

O historico de mudancas esta registrado no arquivo:

```txt
atualizações.md
```

## Objetivo do Projeto

Este projeto foi criado como estudo pratico de desenvolvimento backend com TypeScript, arquitetura MVC, SQLite nativo do Node.js, boas praticas de seguranca em APIs Express e construcao de uma interface frontend simples, responsiva e funcional.
