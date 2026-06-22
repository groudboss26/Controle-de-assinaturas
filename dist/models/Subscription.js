"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModel = void 0;
const database_js_1 = require("../config/database.js");
const selectAllStatement = database_js_1.db.prepare(`
  SELECT id, name, price, due_date, period, shared, my_share
  FROM subscriptions
  ORDER BY due_date ASC, name ASC
`);
const selectByIdStatement = database_js_1.db.prepare(`
  SELECT id, name, price, due_date, period, shared, my_share
  FROM subscriptions
  WHERE id = ?
`);
const insertStatement = database_js_1.db.prepare(`
  INSERT INTO subscriptions (name, price, due_date, period, shared, my_share)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const updateStatement = database_js_1.db.prepare(`
  UPDATE subscriptions
  SET name = ?, price = ?, due_date = ?, period = ?, shared = ?, my_share = ?
  WHERE id = ?
`);
const deleteStatement = database_js_1.db.prepare(`
  DELETE FROM subscriptions
  WHERE id = ?
`);
class SubscriptionModel {
    static create(input) {
        const result = insertStatement.run(input.name, input.price, input.due_date, input.period, input.shared ? 1 : 0, input.my_share);
        return this.getById(Number(result.lastInsertRowid));
    }
    static getAll() {
        return selectAllStatement.all();
    }
    static getById(id) {
        return selectByIdStatement.get(id) ?? null;
    }
    static update(id, input) {
        const result = updateStatement.run(input.name, input.price, input.due_date, input.period, input.shared ? 1 : 0, input.my_share, id);
        if (result.changes === 0) {
            return null;
        }
        return this.getById(id);
    }
    static delete(id) {
        const result = deleteStatement.run(id);
        return result.changes > 0;
    }
}
exports.SubscriptionModel = SubscriptionModel;
