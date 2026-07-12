import { NextResponse } from 'next/server';

// Simple in-memory rate limiting
const rateLimit = new Map();

function getRateLimitKey(request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const path = new URL(request.url).pathname;
  return `${ip}:${path}`;
}

function checkRateLimit(key, limit = 60, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimit.has(key)) {
    rateLimit.set(key, []);
  }

  const timestamps = rateLimit.get(key).filter(t => t > windowStart);
  rateLimit.set(key, timestamps);

  if (timestamps.length >= limit) {
    return false;
  }

  timestamps.push(now);
  return true;
}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of rateLimit.entries()) {
    const valid = timestamps.filter(t => t > now - 60000);
    if (valid.length === 0) {
      rateLimit.delete(key);
    } else {
      rateLimit.set(key, valid);
    }
  }
}, 300000);

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const key = getRateLimitKey(request);
    // Stricter rate limit for auth-related endpoints
    const isAuthEndpoint = pathname.includes('/checkout') || pathname.includes('/midtrans');
    const limit = isAuthEndpoint ? 10 : 60;

    if (!checkRateLimit(key, limit)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Security headers
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://tlgvmiwdjjaeqpqmxgnd.supabase.co https://api.midtrans.com https://api.sandbox.midtrans.com; frame-src 'self' https://js.stripe.com;"
  );

  // Strict Transport Security
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
