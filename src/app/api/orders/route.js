import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
  try {
    const data = await req.json();
    const db = await getDb();

    // Generate Bill No
    const result = await db.get("SELECT COUNT(*) as count FROM orders");
    const nextId = (result?.count || 0) + 1;
    const billNo = 'VC-' + String(nextId).padStart(5, '0');
    const date = new Date().toISOString();

    const insertOrder = await db.run(
      `INSERT INTO orders (billNo, date, customerName, phone, service, tableId, subtotal, discount, cashTendered, changeAmount, total, payment, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        billNo,
        date,
        data.customerName || '',
        data.phone || '',
        data.service || 'Dine In',
        data.tableId || null,
        data.subtotal || data.total,
        data.discount || 0,
        data.cashTendered || 0,
        data.changeAmount || 0,
        data.total,
        data.paymentMethod || 'Cash',
        data.status || 'Completed'
      ]
    );

    const orderId = insertOrder.lastID;

    if (data.items && data.items.length > 0) {
      for (let item of data.items) {
        await db.run(
          `INSERT INTO order_items (orderId, name, qty, price) VALUES (?, ?, ?, ?)`,
          [orderId, item.name, item.qty, item.price]
        );
      }
    }

    // Upsert Customer if phone provided
    if (data.phone && data.status === 'Completed') {
      const existing = await db.get('SELECT * FROM customers WHERE phone = ?', [data.phone]);
      if (existing) {
        await db.run(
          'UPDATE customers SET visits = visits + 1, spent = spent + ?, lastVisit = ?, name = ? WHERE phone = ?',
          [data.total, date, data.customerName || existing.name, data.phone]
        );
      } else {
        await db.run(
          'INSERT INTO customers (name, phone, visits, spent, lastVisit) VALUES (?, ?, 1, ?, ?)',
          [data.customerName || 'Walk-in', data.phone, data.total, date]
        );
      }
    }

    return NextResponse.json({ id: orderId, billNo, date, message: 'Order saved successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const { id, password, customerName, phone, service, payment, status, total, cashTendered, changeAmount } = data;

    if (password !== 'DP1122') {
      return NextResponse.json({ error: 'Invalid password. Password is required to edit orders.' }, { status: 403 });
    }

    const db = await getDb();
    await db.run(
      `UPDATE orders SET customerName = ?, phone = ?, service = ?, payment = ?, status = ?, total = ?, cashTendered = ?, changeAmount = ? WHERE id = ?`,
      [customerName, phone, service, payment, status, total, cashTendered, changeAmount, id]
    );

    return NextResponse.json({ message: 'Order updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const password = searchParams.get('password');

    if (password !== 'DP1122') {
      return NextResponse.json({ error: 'Invalid password. Password is required to delete orders.' }, { status: 403 });
    }

    const db = await getDb();
    await db.run(`DELETE FROM order_items WHERE orderId = ?`, [id]);
    await db.run(`DELETE FROM orders WHERE id = ?`, [id]);

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
