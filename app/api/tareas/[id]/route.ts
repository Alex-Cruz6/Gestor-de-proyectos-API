// /api/tareas/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const db = await getConnection();
    const result = await db
        .request()
        .input('id', params.id)
        .query('SELECT * FROM Tareas WHERE id = @id');

    if (result.recordset.length === 0) {
        return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
    }

    return NextResponse.json(result.recordset[0]);
}