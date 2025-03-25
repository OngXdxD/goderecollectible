import { NextResponse } from 'next/server';

// Define role levels and their access
const roleAccess = {
  1: ['admin'], // Admin has access to everything
  2: ['manager'], // Manager has access to most features
  3: ['user'] // Regular user has limited access
};

// Pages that require authentication
const protectedPages = [
  '/components/product',
  '/components/settings',
  '/components/salesorder',
  '/components/invoice',
  '/components/purchaseorder'
];

// Pages with role restrictions
const roleRestrictedPages = {
  '/components/settings/wix-config': [1], // Only admin can access
  '/components/settings/user-management': [1], // Only admin can access
  '/components/product/create-all-product': [1, 2], // Admin and manager can access
  '/components/product/view-all-products': [1, 2, 3] // All authenticated users can access
};

export function middleware(request) {
  const userRole = request.cookies.get('role-id')?.value;
  const token = request.cookies.get('access-token')?.value;
  const refreshToken = request.cookies.get('refresh-token')?.value;
  
  // Get the path from the request
  const path = request.nextUrl.pathname;

  // Check if the path requires protection
  const isProtectedRoute = protectedPages.some(page => path.startsWith(page));

  // If it's a protected route and no token exists, redirect to login
  if (isProtectedRoute && !token && !refreshToken) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  if (roleRestrictedPages[path]) {
    const allowedRoles = roleRestrictedPages[path];
    if (!allowedRoles.includes(Number(userRole))) {
      // Redirect to unauthorized page or dashboard
      const unauthorizedUrl = new URL('/components/dashboards/dashboard1', request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
}; 