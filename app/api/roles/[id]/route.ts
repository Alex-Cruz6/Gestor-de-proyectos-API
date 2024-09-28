// app/api/roles/[id]/route.ts

import { NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const db = await getConnection();

    try {
        const result = await db
            .request()
            .input('id', params.id)
            .query('SELECT * FROM Roles WHERE id = @id');

        if (result.recordset.length === 0) {
            return NextResponse.json({ error: 'Rol no encontrado' }, { status: 404 });
        }

        return NextResponse.json(result.recordset[0]);
    } catch (error) {
        console.error('Error en la conexión o consulta SQL:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}