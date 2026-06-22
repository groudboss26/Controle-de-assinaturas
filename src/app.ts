import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { resolve } from 'node:path';
import { subscriptionRoutes } from './routes/subscriptionRoutes.js';

export const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https://cdn.jsdelivr.net'],
      fontSrc: ["'self'", 'https://cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"]
    }
  }
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false
}));

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(resolve(process.cwd(), 'public')));

app.use(subscriptionRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Recurso nao encontrado.' });
});
