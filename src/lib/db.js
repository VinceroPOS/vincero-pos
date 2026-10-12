import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let dbPromise = null;

export async function getDb() {
  if (!dbPromise) {
    dbPromise = open({
      filename: path.join(process.cwd(), 'vincero-pos.sqlite'),
      driver: sqlite3.Database
    }).then(async (db) => {
      // Create tables
      await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          price REAL NOT NULL,
          image TEXT,
          available INTEGER DEFAULT 1
        );
        
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          billNo TEXT NOT NULL,
          date TEXT NOT NULL,
          customerName TEXT,
          phone TEXT,
          service TEXT,
          tableId INTEGER,
          subtotal REAL NOT NULL,
          cashTendered REAL DEFAULT 0,
          changeAmount REAL DEFAULT 0,
          total REAL NOT NULL,
          payment TEXT,
          status TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          orderId INTEGER,
          name TEXT,
          qty INTEGER,
          price REAL,
          FOREIGN KEY(orderId) REFERENCES orders(id)
        );

        CREATE TABLE IF NOT EXISTS tables (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          phone TEXT UNIQUE,
          visits INTEGER DEFAULT 0,
          spent REAL DEFAULT 0,
          lastVisit TEXT
        );
      `);

      // Alter columns if migrating existing db
      try {
        await db.exec(`ALTER TABLE products ADD COLUMN image TEXT;`);
      } catch (e) {}

      try {
        await db.exec(`ALTER TABLE orders ADD COLUMN cashTendered REAL DEFAULT 0;`);
      } catch (e) {}

      try {
        await db.exec(`ALTER TABLE orders ADD COLUMN changeAmount REAL DEFAULT 0;`);
      } catch (e) {}

      // Seed tables if empty
      const { pCount } = await db.get('SELECT COUNT(*) as pCount FROM products');
      if (pCount === 0) {
        await db.exec(`
          INSERT INTO products (name, category, price, image, available) VALUES
          ('Espresso', 'Coffee', 650, '', 1),
          ('Americano', 'Coffee', 750, '', 1),
          ('Cappuccino', 'Coffee', 700, '', 1),
          ('Cafe Latte', 'Coffee', 780, '', 1),
          ('Iced Coffee', 'Cold Drinks', 850, '', 1),
          ('Ceylon Tea', 'Tea', 350, '', 1),
          ('Fresh Juice', 'Cold Drinks', 450, '', 1),
          ('Chicken Burger', 'Food', 1200, '', 1),
          ('French Fries', 'Sides', 650, '', 1),
          ('Chocolate Cake', 'Desserts', 600, '', 1)
        `);
      }

      const { tCount } = await db.get('SELECT COUNT(*) as tCount FROM tables');
      if (tCount === 0) {
        await db.exec(`
          INSERT INTO tables (name) VALUES
          ('Table 01'), ('Table 02'), ('Table 03'), ('Table 04')
        `);
      }

      return db;
    });
  }
  return dbPromise;
}
