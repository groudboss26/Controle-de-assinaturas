"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const Subscription_js_1 = require("../models/Subscription.js");
const validPeriods = ['weekly', 'monthly', 'yearly'];
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
function parseBoolean(value) {
    return value === true || value === 'true' || value === 1 || value === '1';
}
function isValidDate(value) {
    if (!datePattern.test(value)) {
        return false;
    }
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function toPositiveNumber(value) {
    const numberValue = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
}
function validatePayload(body) {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const dueDate = typeof body.due_date === 'string' ? body.due_date.trim() : '';
    const period = typeof body.period === 'string' ? body.period.trim() : '';
    const price = toPositiveNumber(body.price);
    const shared = parseBoolean(body.shared);
    if (!name) {
        return { error: 'O nome da assinatura e obrigatorio.' };
    }
    if (price === null) {
        return { error: 'O preco deve ser um numero positivo.' };
    }
    if (!isValidDate(dueDate)) {
        return { error: 'A data de vencimento deve estar no formato YYYY-MM-DD.' };
    }
    if (!validPeriods.includes(period)) {
        return { error: 'O periodo deve ser weekly, monthly ou yearly.' };
    }
    const requestedShare = toPositiveNumber(body.my_share);
    const myShare = shared ? requestedShare : price;
    if (myShare === null) {
        return { error: 'A sua parte deve ser um numero positivo para assinaturas compartilhadas.' };
    }
    if (myShare > price) {
        return { error: 'A sua parte nao pode ser maior que o preco total.' };
    }
    return {
        input: {
            name,
            price,
            due_date: dueDate,
            period: period,
            shared,
            my_share: myShare
        }
    };
}
function monthlyEquivalent(subscription) {
    if (subscription.period === 'weekly') {
        return subscription.my_share * 4.345;
    }
    if (subscription.period === 'yearly') {
        return subscription.my_share / 12;
    }
    return subscription.my_share;
}
class SubscriptionController {
    static create(req, res) {
        const { input, error } = validatePayload(req.body);
        if (!input) {
            res.status(400).json({ error });
            return;
        }
        const subscription = Subscription_js_1.SubscriptionModel.create(input);
        res.status(201).json(subscription);
    }
    static getAll(_req, res) {
        res.json(Subscription_js_1.SubscriptionModel.getAll());
    }
    static getSummary(_req, res) {
        const subscriptions = Subscription_js_1.SubscriptionModel.getAll();
        const monthlyTotal = subscriptions.reduce((total, subscription) => total + monthlyEquivalent(subscription), 0);
        const nextDue = subscriptions[0] ?? null;
        res.json({
            count: subscriptions.length,
            sharedCount: subscriptions.filter((subscription) => subscription.shared === 1).length,
            monthlyTotal: Number(monthlyTotal.toFixed(2)),
            annualTotal: Number((monthlyTotal * 12).toFixed(2)),
            nextDue
        });
    }
    static update(req, res) {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: 'ID invalido.' });
            return;
        }
        const { input, error } = validatePayload(req.body);
        if (!input) {
            res.status(400).json({ error });
            return;
        }
        const subscription = Subscription_js_1.SubscriptionModel.update(id, input);
        if (!subscription) {
            res.status(404).json({ error: 'Assinatura nao encontrada.' });
            return;
        }
        res.json(subscription);
    }
    static delete(req, res) {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: 'ID invalido.' });
            return;
        }
        if (!Subscription_js_1.SubscriptionModel.delete(id)) {
            res.status(404).json({ error: 'Assinatura nao encontrada.' });
            return;
        }
        res.status(204).send();
    }
}
exports.SubscriptionController = SubscriptionController;
