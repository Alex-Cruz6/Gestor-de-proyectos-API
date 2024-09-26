import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';

export async function POST(req: NextRequest) {
  const { nombre_usuario, contrasena } = await req.json();

  if (!nombre_usuario || !contrasena) {
    return NextResponse.json({ message: 'Faltan campos obligatorios' }, { status: 400 });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('nombre_usuario', nombre_usuario)
      .input('contrasena', contrasena)
      .query(`
        SELECT * FROM Usuarios 
        WHERE nombre_usuario = @nombre_usuario 
          AND contrasena = @contrasena
      `);

    if (result.recordset.length > 0) {
      return NextResponse.json({ message: 'Login correcto' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error en la conexión o consulta SQL:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
