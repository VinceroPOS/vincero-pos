import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await getDb();
    
    // Fetch all required dashboard data in one call for simplicity
    const products = await db.all('SELECT * FROM products');
    const tables = await db.all('SELECT * FROM tables');
    const customers = await db.all('SELECT * FROM customers ORDER BY lastVisit DESC');
    
    const orders = await db.all('SELECT * FROM orders ORDER BY id DESC');
    for (let order of orders) {
      order.items = await db.all('SELECT * FROM order_items WHERE orderId = ?', [order.id]);
    }

    return NextResponse.json({ products, tables, customers, orders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
