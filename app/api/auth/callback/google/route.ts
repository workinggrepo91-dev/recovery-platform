// app/api/auth/callback/google/route.ts
import { NextResponse } from 'next/server';
import { registerOrLoginClient } from '@/app/actions/clientAuth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    console.error('Google OAuth Error or cancelled by user:', error);
    return NextResponse.redirect(new URL('/login?error=OAuthCancelled', request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const redirectUri = `${url.origin}/api/auth/callback/google`;

  if (!clientId || !clientSecret) {
    console.error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment variables.');
    return NextResponse.redirect(new URL('/login?error=MissingOAuthCredentials', request.url));
  }

  try {
    // 1. Exchange one-time authentication code for OAuth tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Failed to obtain Google access token:', tokenData);
      return NextResponse.redirect(new URL('/login?error=TokenExchangeFailed', request.url));
    }

    // 2. Fetch authenticated client profile information (Full Name, Email, Picture)
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profileData = await profileResponse.json();

    const verifiedEmail = profileData.email;
    const verifiedFullName = profileData.name || profileData.given_name || (verifiedEmail ? verifiedEmail.split('@')[0] : 'Gmail Client');

    if (!verifiedEmail) {
      return NextResponse.redirect(new URL('/login?error=NoEmailProvided', request.url));
    }

    // 3. Authenticate client and set secure dashboard session cookie
    const result = await registerOrLoginClient({
      email: verifiedEmail,
      fullName: verifiedFullName,
      authProvider: 'GMAIL'
    });

    if (result && !result.hasPassword) {
      return NextResponse.redirect(new URL('/setup-password', request.url));
    }

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (err) {
    console.error('Exception during Google OAuth execution:', err);
    return NextResponse.redirect(new URL('/login?error=GoogleAuthFailed', request.url));
  }
}
