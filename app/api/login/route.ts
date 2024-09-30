import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';

export async function POST(req: NextRequest) {
  const { nombre_usuario, contrasena } = await req.json();

  if (!nombre_usuario || !contrasena) {
    return NextResponse.json({ message: 'Faltan campos obligatorios' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
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
      const usuario = result.recordset[0];
      
      return NextResponse.json({
        message: 'Login correcto',
        usuario: {
          nombre: usuario.nombre_usuario,
          rol: usuario.rol,  
        },
      }, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
    } else {
      return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
  } catch (error) {
    console.error('Error en la conexión o consulta SQL:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
