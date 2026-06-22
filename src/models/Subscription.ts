import { db } from '../config/database.js';

export type Period = 'weekly' | 'monthly' | 'yearly';

export interface Subscription {
  id: number;
  name: string;
  price: number;
  due_date: string;
  period: Period;
  shared: number;
  my_share: number;
}

export interface SubscriptionInput {
  name: string;
  price: number;
  due_date: string;
  period: Period;
  shared: boolean;
  my_share: number;
}

const selectAllStatement = db.prepare(`
  SELECT id, name, price, due_date, period, shared, my_share
  FROM subscriptions
  ORDER BY due_date ASC, name ASC
`);

const selectByIdStatement = db.prepare(`
  SELECT id, name, price, due_date, period, shared, my_share
  FROM subscriptions
  WHERE id = ?
`);

const insertStatement = db.prepare(`
  INSERT INTO subscriptions (name, price, due_date, period, shared, my_share)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const updateStatement = db.prepare(`
  UPDATE subscriptions
  SET name = ?, price = ?, due_date = ?, period = ?, shared = ?, my_share = ?
  WHERE id = ?
`);

const deleteStatement = db.prepare(`
  DELETE FROM subscriptions
  WHERE id = ?
`);

export class SubscriptionModel {
  static create(input: SubscriptionInput): Subscription {
    const result = insertStatement.run(
      input.name,
      input.price,
      input.due_date,
      input.period,
      input.shared ? 1 : 0,
      input.my_share
    );

    return this.getById(Number(result.lastInsertRowid)) as Subscription;
  }

  static getAll(): Subscription[] {
    return selectAllStatement.all() as unknown as Subscription[];
  }

  static getById(id: number): Subscription | null {
    return (selectByIdStatement.get(id) as unknown as Subscription | undefined) ?? null;
  }

  static update(id: number, input: SubscriptionInput): Subscription | null {
    const result = updateStatement.run(
      input.name,
      input.price,
      input.due_date,
      input.period,
      input.shared ? 1 : 0,
      input.my_share,
      id
    );

    if (result.changes === 0) {
      return null;
    }

    return this.getById(id);
  }

  static delete(id: number): boolean {
    const result = deleteStatement.run(id);
    return result.changes > 0;
  }
}
