// app/api/hello/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ mensaje: '¡Hello world!' });
}
