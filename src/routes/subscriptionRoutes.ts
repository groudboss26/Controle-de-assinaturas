import { Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController.js';

export const subscriptionRoutes = Router();

subscriptionRoutes.post('/subscriptions', SubscriptionController.create);
subscriptionRoutes.get('/subscriptions', SubscriptionController.getAll);
subscriptionRoutes.get('/subscriptions/summary', SubscriptionController.getSummary);
subscriptionRoutes.put('/subscriptions/:id', SubscriptionController.update);
subscriptionRoutes.delete('/subscriptions/:id', SubscriptionController.delete);
