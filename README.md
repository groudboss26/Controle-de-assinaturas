# Controle de Assinaturas

Microservico MVC em Node.js com TypeScript, Express, SQLite nativo (`node:sqlite`) e frontend HTML/JavaScript com Bootstrap.

## Como rodar

```bash
npm install
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
