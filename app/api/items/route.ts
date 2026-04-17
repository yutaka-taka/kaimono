import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.shoppingItem.findMany({
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json({ error: '商品名は必須です' }, { status: 400 })
    }

    const qty = parseInt(body.quantity)
    if (isNaN(qty) || qty < 1 || qty > 999) {
      return NextResponse.json({ error: '数量は1〜999の数字で入力してください' }, { status: 400 })
    }

    const item = await prisma.shoppingItem.create({
      data: {
        name: body.name.trim(),
        quantity: qty,
        registrar: body.registrar ?? '不明',
        image: body.image ?? null,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: '登録に失敗しました' }, { status: 500 })
  }
}
