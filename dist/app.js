"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const node_path_1 = require("node:path");
const subscriptionRoutes_js_1 = require("./routes/subscriptionRoutes.js");
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)({
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
exports.app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
}));
exports.app.use(express_1.default.json({ limit: '20kb' }));
exports.app.use(express_1.default.urlencoded({ extended: false }));
exports.app.use(express_1.default.static((0, node_path_1.resolve)(process.cwd(), 'public')));
exports.app.use(subscriptionRoutes_js_1.subscriptionRoutes);
exports.app.use((_req, res) => {
    res.status(404).json({ error: 'Recurso nao encontrado.' });
});
