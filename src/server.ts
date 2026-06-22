import { app } from './app.js';
import './config/database.js';

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
