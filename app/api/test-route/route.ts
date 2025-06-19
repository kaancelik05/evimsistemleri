import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Test API rotası başarıyla çalışıyor!',
    timestamp: new Date().toISOString(),
    status: 'ok'
  })
} 