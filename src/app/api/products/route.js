import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await getDb();
    const products = await db.all('SELECT * FROM products');
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO products (name, category, price, image, available) VALUES (?, ?, ?, ?, ?)',
      [data.name, data.category, data.price, data.image || '', data.available !== false ? 1 : 0]
    );
    return NextResponse.json({ id: result.lastID, ...data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const db = await getDb();
    await db.run(
      'UPDATE products SET name = ?, category = ?, price = ?, image = ?, available = ? WHERE id = ?',
      [data.name, data.category, data.price, data.image || '', data.available ? 1 : 0, data.id]
    );
    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const db = await getDb();
    await db.run('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
