import { NextResponse } from 'next/server';
import { fetchProducts } from '@/lib/celestial';

export async function GET() {
  try {
    const result = await fetchProducts();

    if (!result.success) {
      return NextResponse.json({ error: result.message || 'Gagal mengambil produk' }, { status: 400 });
    }

    const mlIndonesia = result.data.filter(item =>
      item.brand === 'Mobile Legends Indonesia' && item.status === 'Tersedia'
    );

    return NextResponse.json({ success: true, products: mlIndonesia });
  } catch (error) {
    console.error('Celestial products error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data produk' }, { status: 500 });
  }
}
