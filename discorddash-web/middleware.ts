import { auth } from "@/auth"

// Protect the dashboard routes
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboardRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
})

export const config = {
  // Only invoke middleware on specific paths
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - login (auth page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login).*)',
  ],
}
