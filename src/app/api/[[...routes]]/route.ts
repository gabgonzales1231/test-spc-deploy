//C:\computer engineering\work experience\city government of san pablo - miso\spc-website\src\app\api\[[...routes]]\route.ts

import { cookies } from 'next/headers';
import { app } from '@/backend/elysia'; // Bun runtime can handle this cleanly

export async function handleRequest(request: Request) {
  try {
    const url = new URL(request.url);
    console.log('[HANDLER]', request.method, url.pathname);

    const response = await app.handle(request);
    console.log('[HANDLER] Response', response.status, url.pathname);

    return response;
  } catch (error) {
    console.error('[HANDLER] Error:', error);
    return Response.json(
      {
        success: false,
        error: {
          code: 'HANDLER_ERROR',
          message: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  return handleRequest(request);
}

export async function POST(request: Request) {
  try {
    const response = await handleRequest(request);

    const url = request.url;
    const cookieStore = await cookies();

    // ✅ Login
    if (url.includes('/users/login') && response.ok) {
      console.log('[HANDLER] Login detected, setting cookie...');
      try {
        const data = await response.clone().json();

        if (data.success && data.data?.token) {
          cookieStore.set('token', data.data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
          });
          console.log('[HANDLER] Token cookie set.');
        } else {
          console.log('[HANDLER] No token found in login response');
        }
      } catch (e) {
        console.error('[HANDLER] Error parsing login response:', e);
      }
    }

    // ✅ Logout
    if (url.includes('/users/logout') && response.ok) {
      console.log('[HANDLER] Logout detected, clearing cookie...');
      cookieStore.delete('token');
    }

    return response;
  } catch (error) {
    console.error('[HANDLER] POST error:', error);
    return Response.json(
      {
        success: false,
        error: {
          code: 'POST_ERROR',
          message: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 },
    );
  }
}

// ✅ Other verbs
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const HEAD = handleRequest;
export const OPTIONS = handleRequest;
