// POST /api/tareas/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';

export async function POST(request: Request) {
    const { nombre, descripcion, estado, proyecto_id, asignado_a } = await request.json();

    if (!nombre || !estado || !proyecto_id || !asignado_a) {
        return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const db = await getConnection();
    const query = `
        INSERT INTO Tareas (nombre, descripcion, estado, proyecto_id, asignado_a) 
        VALUES (@nombre, @descripcion, @estado, @proyecto_id, @asignado_a);
    `;
    const result = await db.request()
        .input('nombre', nombre)
        .input('descripcion', descripcion || null)
        .input('estado', estado)
        .input('proyecto_id', proyecto_id)
        .input('asignado_a', asignado_a)
        .query(query);

    return NextResponse.json({ message: 'Tarea creada con éxito' });
}

// GET /api/tareas/route.ts
export async function GET() {
    const db = await getConnection();
    const result = await db.query('SELECT * FROM Tareas');

    return NextResponse.json(result.recordset);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { nombre, descripcion, estado, proyecto_id, asignado_a } = await request.json();

    const db = await getConnection();
    const query = `
        UPDATE Tareas 
        SET nombre = @nombre, descripcion = @descripcion, estado = @estado, 
            proyecto_id = @proyecto_id, asignado_a = @asignado_a
        WHERE id = @id
    `;

    const result = await db
        .request()
        .input('id', params.id)
        .input('nombre', nombre)
        .input('descripcion', descripcion || null)
        .input('estado', estado)
        .input('proyecto_id', proyecto_id)
        .input('asignado_a', asignado_a)
        .query(query);

    if (result.rowsAffected[0] === 0) {
        return NextResponse.json({ error: 'Tarea no encontrada o sin cambios' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tarea actualizada con éxito' });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const db = await getConnection();
    const result = await db
        .request()
        .input('id', params.id)
        .query('DELETE FROM Tareas WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
        return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tarea eliminada con éxito' });
}