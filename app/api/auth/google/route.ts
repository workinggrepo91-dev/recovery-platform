// app/api/auth/google/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  if (!clientId) {
    return NextResponse.redirect(new URL('/login?error=MissingOAuthClientId', request.url));
  }
  
  // Dynamically determine current domain (supports localhost and Vercel/production deployment)
  const url = new URL(request.url);
  const origin = url.origin;
  const redirectUri = `${origin}/api/auth/callback/google`;

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
    `client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent('openid email profile')}` +
    `&access_type=offline` +
    `&prompt=select_account`;

  return NextResponse.redirect(googleAuthUrl);
}
