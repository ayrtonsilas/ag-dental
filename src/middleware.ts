import { NextResponse, type NextRequest } from 'next/server'
import { verifyJWT } from './lib/auth'

// Paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/api/dashboard',
]

// Paths that are only accessible to logged-out users
const authPaths = [
  '/login',
  '/register',
  '/recuperar-senha',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  try {
    const token = request.cookies.get('auth-token')?.value
    
    // Check if path is protected
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
    const isAuthPath = authPaths.some(path => pathname.startsWith(path))
    
    // If no token and route is protected, redirect to login
    if (!token && isProtectedPath) {
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', encodeURI(pathname))
      return NextResponse.redirect(url)
    }
    
    // If there is a token
    if (token) {
      try {
        // Verify token
        await verifyJWT(token)
        
        // If token is valid and user is trying to access auth paths
        if (isAuthPath) {
          // Redirect to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      } catch {
        // Token is invalid - don't redirect from auth paths
        if (isProtectedPath) {
          const url = new URL('/login', request.url)
          url.searchParams.set('callbackUrl', encodeURI(pathname))
          return NextResponse.redirect(url)
        }
      }
    }
    
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    
    // In case of an error, allow access to auth paths, but redirect
    // protected paths to login
    if (protectedPaths.some(path => pathname.startsWith(path))) {
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', encodeURI(pathname))
      return NextResponse.redirect(url)
    }
    
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // Match all paths
    '/((?!_next/static|_next/image|favicon.ico|.*\\.css).*)',
  ],
} 