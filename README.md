# Controle de Assinaturas

Microservico MVC em Node.js com TypeScript, Express, SQLite nativo (`node:sqlite`) e frontend HTML/JavaScript com Bootstrap.

## Como rodar

Antes de iniciar o projeto, e obrigatorio baixar os modulos necessarios. Para isso, execute:

```bash
npm install
```

Esse comando cria a pasta `node_modules` e instala todas as dependencias listadas no `package.json`, como Express, Helmet, Express Rate Limit, TypeScript e TSX.

Depois, inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Scripts

- `npm run dev`: inicia o servidor em modo desenvolvimento.
- `npm run build`: compila o TypeScript em `dist/`.
- `npm start`: executa a versao compilada.

## Endpoints

- `POST /subscriptions`
- `GET /subscriptions`
- `GET /subscriptions/summary`
- `PUT /subscriptions/:id`
- `DELETE /subscriptions/:id`
