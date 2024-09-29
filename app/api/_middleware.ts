import { NextResponse } from 'next/server';

export function middleware(request: Request) {
    const response = NextResponse.next();

    // Establecer los encabezados CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    // Manejo de la solicitud OPTIONS
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204, // No Content
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    return response;
}

// Se puede exportar la función middleware para usarla
export const config = {
    matcher: '/api/:path*', // Aplica el middleware solo a las rutas de la API
};
