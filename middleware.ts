import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Rate limit tracking (in-memory, not persistent across instances)
const requestCounts = new Map<string, { count: number; resetAt: number }>()

function rateLimitMiddleware(request: NextRequest, limit: number = 60, windowMs: number = 60000): { allowed: boolean; remaining: number } {
  // Use a generic key for middleware since we can't easily get client IP
  const ip = '127.0.0.1'
  const now = Date.now()
  const key = `rate_${ip}`
  
  const entry = requestCounts.get(key)
  
  if (!entry || now > entry.resetAt) {
    // New window
    requestCounts.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }
  
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 }
  }
  
  entry.count++
  return { allowed: true, remaining: limit - entry.count }
}

export function middleware(request: NextRequest) {
  // Skip static files and Next.js internals
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // Rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const limit = request.nextUrl.pathname.includes('/advice') ? 20 : 
                  request.nextUrl.pathname.includes('/search') ? 30 : 60
    const { allowed, remaining } = rateLimitMiddleware(request, limit)
    
    const response = allowed 
      ? NextResponse.next()
      : NextResponse.json(
          { error: 'Terlalu banyak permintaan. Coba lagi nanti.' },
          { status: 429 }
        )
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', limit.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(Date.now() / 1000) + 60))
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
