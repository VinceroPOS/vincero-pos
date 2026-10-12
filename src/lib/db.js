import { createClient } from '@libsql/client';

let client = null;
let initialized = false;

export async function getDb() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL || 'libsql://vincero-db-vinceropos.aws-ap-south-1.turso.io';
    const authToken = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE4MTI1OTcsImlkIjoiMDFhMTMwNTgtZTIwMS03NDcwLWE1NDQtMmQ4Nzk3OWYwYjJmIiwia2lkIjoiUEZLWjllc2dfVHBMVkZqeGZETGROd1Q4U0oyQ1hDVkU2NWNlTzhrWW11VSIsInJpZCI6IjE0OWI1ZjkwLTcyYmEtNDhjZi1iZjQ3LTUzYTI0Y2EyN2QyNSJ9.jD1oLZ5LQ2pNqTomCjBEQBdi55z9LOU_IuhCoD0APdJta4j80AJYW1hyV7Fa1WCcuSXQqAWuyJQlEUcrJ6mDDQ';

    client = createClient({
      url,
      authToken
    });
  }

  if (!initialized) {
    // Create tables
    await client.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT,
        available INTEGER DEFAULT 1
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        billNo TEXT NOT NULL,
        date TEXT NOT NULL,
        customerName TEXT,
        phone TEXT,
        service TEXT,
        tableId INTEGER,
        subtotal REAL NOT NULL,
        discount REAL DEFAULT 0,
        cashTendered REAL DEFAULT 0,
        changeAmount REAL DEFAULT 0,
        total REAL NOT NULL,
        payment TEXT,
        status TEXT NOT NULL
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER,
        name TEXT,
        qty INTEGER,
        price REAL,
        FOREIGN KEY(orderId) REFERENCES orders(id)
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS tables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT UNIQUE,
        visits INTEGER DEFAULT 0,
        spent REAL DEFAULT 0,
        lastVisit TEXT
      );
    `);

    // Seed products if empty
    const pCheck = await client.execute('SELECT COUNT(*) as pCount FROM products');
    const pCount = pCheck.rows[0]?.pCount || 0;
    if (Number(pCount) === 0) {
      await client.batch([
        { sql: "INSERT INTO products (name, category, price, image, available) VALUES ('Espresso', 'Coffee', 650, '', 1)", args: [] },
        { sql: "INSERT INTO products (name, category, price, image, available) VALUES ('Americano', 'Coffee', 750, '', 1)", args: [] },
        { sql: "INSERT INTO products (name, category, price, image, available) VALUES ('Cappuccino', 'Coffee', 700, '', 1)", args: [] },
        { sql: "INSERT INTO products (name, category, price, image, available) VALUES ('Cafe Latte', 'Coffee', 780, '', 1)", args: [] },
        { sql: "INSERT INTO products (name, category, price, image, available) VALUES ('Iced Coffee', 'Cold Drinks', 850, '', 1)", args: [] },
        { sql: "INSERT INTO products (name, category, price, image, available) VALUES ('Ceylon Tea', 'Tea', 350, '', 1)", args: [] },
        { sql: "INSERT INTO products (name, category, price, image, available) VALUES ('Fresh Juice', 'Cold Drinks', 450, '', 1)", args: [] },
        { sql: "INSERT INTO products (name, category, price, image, available) VALUES ('Chicken Burger', 'Food', 1200, '', 1)", args: [] },
        { sql: "INSERT INTO products (name, category, price, image, available) VALUES ('French Fries', 'Sides', 650, '', 1)", args: [] },
        { sql: "INSERT INTO products (name, category, price, image, available) VALUES ('Chocolate Cake', 'Desserts', 600, '', 1)", args: [] }
      ]);
    }

    const tCheck = await client.execute('SELECT COUNT(*) as tCount FROM tables');
    const tCount = tCheck.rows[0]?.tCount || 0;
    if (Number(tCount) === 0) {
      await client.batch([
        { sql: "INSERT INTO tables (name) VALUES ('Table 01')", args: [] },
        { sql: "INSERT INTO tables (name) VALUES ('Table 02')", args: [] },
        { sql: "INSERT INTO tables (name) VALUES ('Table 03')", args: [] },
        { sql: "INSERT INTO tables (name) VALUES ('Table 04')", args: [] }
      ]);
    }

    initialized = true;
  }

  // Adapter methods so existing code works seamlessly: db.all(), db.get(), db.run()
  return {
    async all(sql, args = []) {
      const res = await client.execute({ sql, args });
      return res.rows;
    },
    async get(sql, args = []) {
      const res = await client.execute({ sql, args });
      return res.rows[0] || null;
    },
    async run(sql, args = []) {
      const res = await client.execute({ sql, args });
      return {
        lastID: Number(res.lastInsertRowid) || 0,
        changes: res.rowsAffected
      };
    },
    async exec(sql) {
      return await client.execute(sql);
    }
  };
}
